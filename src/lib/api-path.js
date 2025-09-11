// src/lib/api-path.js

// Unified Next proxy entry (we killed /b)
export const API_PROXY_PREFIX = "/api";

const DIRECT_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

const looksLikeFile = (p = "") => /\.[a-z0-9]+$/i.test(p);
const trimSlashes = (p = "") => String(p).replace(/^\/+|\/+$/g, "");

/** Remove any accidental leading proxy bits and a single leading "api/". */
function stripLeadingPrefixes(p = "") {
  let out = String(p).replace(/^\/+/, "");

  // Back-compat: strip old proxy-ish prefixes callers might pass
  out = out.replace(/^api\/+b\/+/i, ""); // "api/b/..."
  out = out.replace(/^b\/+/i, "");       // "b/..."

  // If it still begins with "api/", drop that *one* instance.
  // (We will add our own `/api/` prefix outside.)
  out = out.replace(/^api\/+/i, "");

  return out;
}

function ensureTrailingSlash(p = "") {
  if (!p) return p;
  return looksLikeFile(p) || p.endsWith("/") ? p : `${p}/`;
}

function toQueryString(obj) {
  if (!obj) return "";
  if (typeof obj === "string") {
    const s = obj.trim();
    if (!s) return "";
    return s.startsWith("?") ? s.slice(1) : s;
  }
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
    else params.append(k, String(v));
  });
  return params.toString();
}

function sameBackendOrigin(absUrl) {
  try {
    const u = new URL(absUrl);
    const b = new URL(DIRECT_BASE);
    const low = (x) => String(x || "").toLowerCase();
    return (
      low(u.protocol) === low(b.protocol) &&
      low(u.hostname) === low(b.hostname) &&
      String(u.port || "") === String(b.port || "")
    );
  } catch {
    return false;
  }
}

/**
 * Build a proxied URL that ALWAYS looks like: /api/<path>/?<query>
 *
 * Examples:
 *   b("addresses")                     -> /api/addresses/
 *   b(["product", 4345, "reviews"])    -> /api/product/4345/reviews/
 *   b("gh/slug/related?limit=12",{p:2})-> /api/gh/slug/related/?limit=12&p=2
 *   b("http://127.0.0.1:8000/api/product/4345")
 *                                       -> /api/product/4345/
 */
export function b(path, query) {
  if (path instanceof URL) path = path.toString();
  const raw = String(path || "");

  // Absolute URL? If it's your backend, rewrite via proxy; otherwise leave as-is.
  if (/^https?:\/\//i.test(raw)) {
    if (!sameBackendOrigin(raw)) return raw;
    try {
      const u = new URL(raw);
      const body = stripLeadingPrefixes(trimSlashes(u.pathname));
      const normalized = ensureTrailingSlash(body);
      const fromUrl = u.search ? u.search.slice(1) : "";
      const extra = toQueryString(query);
      const merged = [fromUrl, extra].filter(Boolean).join("&");
      return `${API_PROXY_PREFIX}/${normalized}${merged ? `?${merged}` : ""}`;
    } catch {
      return raw;
    }
  }

  // Relative path
  const hashIdx = raw.indexOf("#");
  const beforeHash = hashIdx >= 0 ? raw.slice(0, hashIdx) : raw;
  const hash = hashIdx >= 0 ? raw.slice(hashIdx) : "";

  const qIdx = beforeHash.indexOf("?");
  const rawPath = qIdx >= 0 ? beforeHash.slice(0, qIdx) : beforeHash;
  const rawQuery = qIdx >= 0 ? beforeHash.slice(qIdx + 1) : "";

  const body = stripLeadingPrefixes(trimSlashes(rawPath));
  const normalized = ensureTrailingSlash(body);

  const extra = toQueryString(query);
  const merged = [rawQuery, extra].filter(Boolean).join("&");

  return `${API_PROXY_PREFIX}/${normalized}${merged ? `?${merged}` : ""}${hash}`;
}

// Friendly alias used around the codebase
export const api = b;

export function ensureSlash(path) {
  return ensureTrailingSlash(trimSlashes(path));
}