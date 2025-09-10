// src/lib/api.js
// Cookie-first API helper that goes through Next's proxy (/api/b/...)
// so the server can inject Authorization from the HttpOnly `up_auth` cookie.

const DIRECT_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

const PROXY_PREFIX = "/api/b";

/** ---- tiny utils ---- */

function resolveTimezone() {
  if (typeof window === "undefined") return undefined;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

function persistTzCookie(tz) {
  if (typeof document === "undefined" || !tz) return;
  try {
    document.cookie = `tz=${encodeURIComponent(
      tz
    )}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

function withTZ(url, tz) {
  if (!tz) return url;
  try {
    const u = new URL(
      url,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    if (!u.searchParams.has("tz")) u.searchParams.set("tz", tz);
    return u.toString();
  } catch {
    return url;
  }
}

function isFormData(v) {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

function hasHeader(headersObj, name) {
  if (!headersObj) return false;
  const lower = name.toLowerCase();
  if (typeof headersObj.get === "function") {
    return headersObj.get(name) != null || headersObj.get(lower) != null;
  }
  return Object.keys(headersObj).some((k) => k.toLowerCase() === lower);
}

function looksLikeFile(p = "") {
  return /\.[a-z0-9]+$/i.test(p);
}

function trimSlashes(p = "") {
  return String(p).replace(/^\/+|\/+$/g, "");
}

function splitUrlish(s = "") {
  // Separate path + search + hash without requiring a base URL
  const hashIdx = s.indexOf("#");
  const beforeHash = hashIdx >= 0 ? s.slice(0, hashIdx) : s;
  const hash = hashIdx >= 0 ? s.slice(hashIdx) : "";
  const qIdx = beforeHash.indexOf("?");
  const pathname = qIdx >= 0 ? beforeHash.slice(0, qIdx) : beforeHash;
  const search = qIdx >= 0 ? beforeHash.slice(qIdx) : "";
  return { pathname, search, hash };
}

function ensureDrfSlash(pathname = "") {
  if (!pathname) return "/";
  const clean = trimSlashes(pathname);
  if (!clean) return "/";
  return looksLikeFile(clean) || clean.endsWith("/") ? `/${clean}` : `/${clean}/`;
}

// ✅ Consider a URL “already proxied” if it begins with /api/b/...
function isProxyPath(pathname = "") {
  const clean = trimSlashes(pathname).toLowerCase();
  return clean.startsWith("api/b/");
}

// ✅ Always ensure paths are rooted under /api/... for the backend
//    e.g. "products/1" → "api/products/1", "i18n/init" → "api/i18n/init"
function ensureApiRoot(pathname = "") {
  const clean = trimSlashes(pathname);
  return clean.toLowerCase().startsWith("api/") ? clean : `api/${clean}`;
}

function sameOriginAsDirectBase(absUrl) {
  try {
    const u = new URL(absUrl);
    const b = new URL(DIRECT_BASE);
    return (
      u.protocol === b.protocol &&
      u.hostname === b.hostname &&
      String(u.port || "") === String(b.port || "")
    );
  } catch {
    return false;
  }
}

/** ---- core fetcher ---- */
/**
 * api(path, opts)
 * - Pass *clean* API paths (with or without leading/trailing slash).
 * - You may accidentally pass '/api/...', '/i18n/init', '/fx/latest?base=USD', etc. — all handled.
 * - Absolute URLs that start with NEXT_PUBLIC_API_BASE_URL are rewritten to go
 *   through the proxy so cookies work; other absolutes are fetched directly.
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
  if (tz && !hasHeader(headers, "X-Timezone")) {
    headers.set("X-Timezone", tz);
  }

  let url = String(path || "");

  // 1) Absolute URL? If it matches DIRECT_BASE, route through proxy.
  if (/^https?:\/\//i.test(url)) {
    if (sameOriginAsDirectBase(url)) {
      const u = new URL(url);
      const qs = u.search || "";
      const hash = u.hash || "";
      const rooted = ensureApiRoot(u.pathname);          // <-- guarantee /api/…
      const drfPath = ensureDrfSlash(rooted);
      url = `${PROXY_PREFIX}${drfPath}${qs}${hash}`;
    } else {
      // Non-backend absolute URL: fetch directly.
      url = withTZ(url, tz);
    }
  } else {
    // 2) Relative URL: clean up and route through proxy.
    const { pathname, search, hash } = splitUrlish(url);

    if (isProxyPath(pathname)) {
      // Already /api/b/... → respect as-is (just ensure it starts with "/")
      const prefixed = pathname.startsWith("/") ? pathname : `/${pathname}`;
      url = `${prefixed}${search}${hash}`;
    } else {
      // Normalize to backend /api/... and let the proxy forward it.
      const rooted = ensureApiRoot(pathname);            // <-- guarantee /api/…
      const drfPath = ensureDrfSlash(rooted);
      url = `${PROXY_PREFIX}${drfPath}${search}${hash}`;
    }
  }

  const fetchInit = {
    ...opts,
    headers,
    credentials: "include", // keep cookies flowing to /api/*
  };

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

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

/** POST (JSON) convenience */
export async function apiJSON(path, data, opts = {}) {
  const body =
    data != null && typeof data !== "string" ? JSON.stringify(data) : data;
  return api(path, { ...opts, method: opts.method || "POST", body });
}

/** POST (multipart) convenience */
export async function apiForm(path, formData, opts = {}) {
  return api(path, { ...opts, method: opts.method || "POST", body: formData });
}