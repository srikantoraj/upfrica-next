
// src/lib/api.js
// Cookie-first API helper that goes through Next's proxy (/api/...)
// so the server can inject Authorization from the HttpOnly `up_auth` cookie.

const DIRECT_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.BACKEND_BASE ||            // ← extra fallback
  "http://127.0.0.1:8000";

const PROXY_PREFIX = "/api"; // ✅ no /b

/** ---- tiny utils ---- */

function resolveTimezone() {
  if (typeof window === "undefined") return undefined;
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined; } catch { return undefined; }
}

function persistTzCookie(tz) {
  if (typeof document === "undefined" || !tz) return;
  try {
    document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

function withTZ(url, tz) {
  if (!tz) return url;
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (!u.searchParams.has("tz")) u.searchParams.set("tz", tz);
    return u.toString();
  } catch { return url; }
}

function isFormData(v) { return typeof FormData !== "undefined" && v instanceof FormData; }

function hasHeader(headersObj, name) {
  if (!headersObj) return false;
  const lower = name.toLowerCase();
  if (typeof headersObj.get === "function") {
    return headersObj.get(name) != null || headersObj.get(lower) != null;
  }
  return Object.keys(headersObj).some((k) => k.toLowerCase() === lower);
}

function looksLikeFile(p = "") { return /\.[a-z0-9]+$/i.test(p); }
function trimSlashes(p = "") { return String(p).replace(/^\/+|\/+$/g, ""); }

function splitUrlish(s = "") {
  const hashIdx = s.indexOf("#");
  const beforeHash = hashIdx >= 0 ? s.slice(0, hashIdx) : s;
  const hash = hashIdx >= 0 ? s.slice(hashIdx) : "";
  const qIdx = beforeHash.indexOf("?");
  const pathname = qIdx >= 0 ? beforeHash.slice(0, qIdx) : beforeHash;
  const search = qIdx >= 0 ? beforeHash.slice(qIdx) : "";
  return { pathname, search, hash };
}

function ensureTrailingSlash(pathname = "") {
  const clean = trimSlashes(pathname);
  if (!clean) return "";
  return looksLikeFile(clean) || clean.endsWith("/") ? clean : `${clean}/`;
}

// 🔧 Strip any accidental leading proxy bits *and* a single "api/" if present.
function stripProxyPrefixes(p = "") {
  let out = trimSlashes(p);

  // collapse stray commas between segments (e.g., "product,4345,reviews")
  out = out.replace(/,+/g, "/");

  // drop our old proxy prefixes if callers still pass them
  out = out.replace(/^api\/+b\/+/i, ""); // "api/b/..."
  out = out.replace(/^b\/+/i, "");       // "b/..."

  // if still starts with "api/", drop one copy — the proxy route already lives at /api/[...]
  out = out.replace(/^api\/+/i, "");

  // collapse duplicate slashes
  out = out.replace(/\/{2,}/g, "/");

  return out;
}

function canonHost(h) {
  const low = String(h || "").toLowerCase();
  return low === "localhost" ? "127.0.0.1" : low;
}

function sameOriginAsDirectBase(absUrl) {
  try {
    const u = new URL(absUrl);
    const b = new URL(DIRECT_BASE);
    const lp = (x) => String(x || "").toLowerCase();
    return (
      lp(u.protocol) === lp(b.protocol) &&
      canonHost(u.hostname) === canonHost(b.hostname) &&
      String(u.port || "") === String(b.port || "")
    );
  } catch { return false; }
}

/** ---- core fetcher ---- */
/**
 * api(path, opts)
 * - Pass clean API paths (with/without leading/trailing slash), e.g.:
 *     "addresses", "/addresses", "product/4345/reviews"
 * - If you pass "/api/..." or "api/..." (or even "api/b/..."), we normalize it.
 * - Absolute URLs that match DIRECT_BASE are rewritten to /api/<path>/ so cookies work.
 * - Other absolute URLs are fetched directly (not proxied), unless opts.forceProxy is true.
 *
 * Extra opts:
 *   - forceProxy?: boolean — force routing through /api even for absolute URLs that match DIRECT_BASE.
 */
export async function api(path, opts = {}) {
  const tz = resolveTimezone();
  if (tz) persistTzCookie(tz);

  // Headers (safe for FormData)
  const body = opts.body;
  const form = isFormData(body);
  const incoming = opts.headers || {};
  const headers =
    typeof Headers !== "undefined" && incoming instanceof Headers
      ? incoming
      : new Headers(incoming);

  if (!form && !hasHeader(headers, "Content-Type") && body != null) {
    headers.set("Content-Type", "application/json");
  }
  if (!hasHeader(headers, "Accept")) {
    headers.set("Accept", "application/json");
  }
  if (tz && !hasHeader(headers, "X-Timezone")) {
    headers.set("X-Timezone", tz);
  }

  let url = String(path || "");

  // 1) Absolute URL? If it's your backend (or forceProxy), route via proxy. Else fetch direct.
  if (/^https?:\/\//i.test(url)) {
    if (opts.forceProxy || sameOriginAsDirectBase(url)) {
      const u = new URL(url);
      const qs = u.search || "";
      const hash = u.hash || "";
      const bodyPath = stripProxyPrefixes(u.pathname);    // drop any leading /api[/b]/...
      const normalized = ensureTrailingSlash(bodyPath);   // add slash unless looks like file
      url = `${PROXY_PREFIX}/${normalized}${qs}${hash}`;  // → /api/<path>/
    } else {
      url = withTZ(url, tz);
    }
  } else {
    // 2) Relative URL: clean up and route through proxy.
    const { pathname, search, hash } = splitUrlish(url);
    const bodyPath = stripProxyPrefixes(pathname);        // drop /api[/b]/ if caller passed
    const normalized = ensureTrailingSlash(bodyPath);
    url = `${PROXY_PREFIX}/${normalized}${search}${hash}`; // → /api/<path>/
  }

  const fetchInit = { ...opts, headers, credentials: "include" };

  const res = await fetch(withTZ(url, tz), fetchInit);

  if (!res.ok) {
    let msg = `API ${res.status} ${url}`;
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const err = await res.json();
        if (err?.detail) msg = err.detail;
        else if (err?.message) msg = err.message;
        else msg = JSON.stringify(err);
      } else {
        const text = await res.text();
        if (text) msg = text;
      }
    } catch {}
    throw new Error(msg);
  }

  // No content
  if (res.status === 204 || res.status === 205) return null;

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

/** POST (JSON) convenience */
export async function apiJSON(path, data, opts = {}) {
  const body = data != null && typeof data !== "string" ? JSON.stringify(data) : data;
  return api(path, { ...opts, method: opts.method || "POST", body });
}

/** POST (multipart) convenience */
export async function apiForm(path, formData, opts = {}) {
  return api(path, { ...opts, method: opts.method || "POST", body: formData });
}