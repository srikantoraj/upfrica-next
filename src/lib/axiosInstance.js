// lib/axiosInstance.js
import axios from "axios";

/** Safely resolve the user's IANA timezone on the client. */
function resolveTimezone() {
  if (typeof window === "undefined") return undefined;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

/** Persist tz to a cookie so SSR/other tools can read it later if needed. */
function persistTzCookie(tz) {
  if (typeof document === "undefined" || !tz) return;
  try {
    document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

// ---- backend origin (used to rewrite absolute URLs) ----
const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

function isAbsUrl(u) {
  return typeof u === "string" && /^https?:\/\//i.test(u);
}
function sameBackendOrigin(absUrl) {
  try {
    const u = new URL(absUrl);
    const b = new URL(BACKEND);
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
function looksLikeFile(p = "") {
  return /\.[a-z0-9]+$/i.test(p);
}

/**
 * Normalize any path for our axios baseURL="/api/b":
 * - Accepts leading "/" or not.
 * - Accepts accidental "api/", "/api/", "b/", "/api/b/" prefixes and removes them.
 * - Rewrites absolute backend URLs to a relative proxy path.
 * - Ensures DRF trailing slash (unless looks like a file).
 * - Preserves query string and hash.
 * - NEW: replaces stray commas between segments with "/" (e.g. "product,4345,reviews").
 */
function normalizeProxyPath(input) {
  if (!input) return "";
  let s = String(input);

  // Absolute URL? If it's NOT the backend, leave it absolute (bypass baseURL).
  if (isAbsUrl(s)) {
    if (!sameBackendOrigin(s)) return s;
    try {
      const u = new URL(s);
      s = `${u.pathname}${u.search || ""}${u.hash || ""}`;
    } catch {
      return s;
    }
  }

  // Split path / query / hash
  const hashIdx = s.indexOf("#");
  const beforeHash = hashIdx >= 0 ? s.slice(0, hashIdx) : s;
  const hash = hashIdx >= 0 ? s.slice(hashIdx) : "";

  const qIdx = beforeHash.indexOf("?");
  let pathOnly = qIdx >= 0 ? beforeHash.slice(0, qIdx) : beforeHash;
  const query = qIdx >= 0 ? beforeHash.slice(qIdx) : "";

  // Remove leading slashes so baseURL joins correctly.
  pathOnly = pathOnly.replace(/^\/+/, "");

  // 🔧 NEW: fix any accidental commas between path segments
  pathOnly = pathOnly.replace(/,+/g, "/");

  // 🔑 IMPORTANT:
  // - If caller passed "/api/b/…", strip the *full* proxy prefix ("api/b/").
  // - If caller passed "/b/…", strip "b/" (old habit).
  // - If caller passed "/api/…", DO NOT strip "api/". Keep it, because your backend expects it.
  //   (Leaving it means final URL becomes "/api/b/api/…", which is the working shape today.)
  if (/^api\/+b\/+/i.test(pathOnly)) {
    pathOnly = pathOnly.replace(/^api\/+b\/+/i, "");
  } else if (/^b\/+/i.test(pathOnly)) {
    pathOnly = pathOnly.replace(/^b\/+/i, "");
  } // else: starts with "api/" → leave as-is

  // DRF trailing slash unless it looks like a file
  if (pathOnly && !looksLikeFile(pathOnly) && !pathOnly.endsWith("/")) {
    pathOnly += "/";
  }

  return `${pathOnly}${query}${hash}`;
}

// Reusable axios instance that goes through the Next proxy
const axiosInstance = axios.create({
  baseURL: "/api/b",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: normalize URL, add X-Timezone, handle FormData
axiosInstance.interceptors.request.use(
  (config) => {
    // Normalize URL / path so leading "/" and various prefixes are accepted.
    if (typeof config.url === "string") {
      const normalized = normalizeProxyPath(config.url);

      // If normalized is an absolute external URL (not our backend), use it as-is;
      // otherwise keep it relative so baseURL joins to "/api/b".
      if (isAbsUrl(normalized) && !sameBackendOrigin(normalized)) {
        config.baseURL = ""; // bypass proxy for true external calls
        config.url = normalized;
      } else {
        config.url = normalized; // relative → baseURL "/api/b" will prefix
      }
    }

    // Timezone header (and persist as cookie)
    const tz = resolveTimezone();
    if (tz) {
      config.headers = { ...(config.headers || {}), "X-Timezone": tz };
      persistTzCookie(tz);
    }

    // If body is FormData, let the browser set the multipart boundary
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers && ("Content-Type" in config.headers || "content-type" in config.headers)) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    // Do NOT set Authorization here; the proxy will add it from the HttpOnly cookie.
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle common auth errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;
      if (status === 401) {
        // e.g. soft-redirect or toast
      } else if (status === 403) {
        // forbidden
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;