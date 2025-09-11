// src/lib/axiosInstance.js
import axios from "axios";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

function isAbs(u){ return /^https?:\/\//i.test(String(u||"")); }
function looksLikeFile(p=""){ return /\.[a-z0-9]+$/i.test(p); }
function sameBackendOrigin(abs){
  try{
    const u=new URL(abs), b=new URL(BACKEND);
    const L=x=>String(x||"").toLowerCase();
    return L(u.protocol)===L(b.protocol) && L(u.hostname)===L(b.hostname) && String(u.port||"")===String(b.port||"");
  }catch{return false;}
}

/**
 * Normalize any path so it works with baseURL="/api"
 * - Accepts leading "/" or not
 * - Accepts accidental "api/", "/api/", "api/b/", "b/" prefixes and removes them
 * - Rewrites absolute BACKEND URLs to a relative proxy path
 * - Ensures DRF trailing slash (unless it looks like a file)
 * - Collapses duplicate slashes and stray commas
 */
export function normalizeProxyPath(input){
  if(!input) return "";
  let s=String(input).trim();

  // Absolute URL? If it's NOT the backend, leave it absolute (bypass baseURL).
  if (isAbs(s)) {
    if (!sameBackendOrigin(s)) return s;
    try {
      const u=new URL(s);
      s=`${u.pathname}${u.search||""}${u.hash||""}`;
    } catch {
      return s;
    }
  }

  // Split path+query+hash safely
  const hashIdx=s.indexOf("#");
  const beforeHash=hashIdx>=0?s.slice(0,hashIdx):s;
  const hash=hashIdx>=0?s.slice(hashIdx):"";

  const qIdx=beforeHash.indexOf("?");
  let pathOnly=qIdx>=0?beforeHash.slice(0,qIdx):beforeHash;
  const query=qIdx>=0?beforeHash.slice(qIdx):"";

  // Clean and strip legacy prefixes
  pathOnly = pathOnly
    .replace(/^\/+/, "")
    .replace(/\/{2,}/g, "/")
    .replace(/,+/g, "/")
    .replace(/^api\/+b\/+/i, "") // strip "api/b/..."
    .replace(/^b\/+/i, "")       // strip "b/..."
    .replace(/^(?:api\/)+/i, "api/"); // collapse multiple api/ → "api/"

  // IMPORTANT: since baseURL is "/api", drop a *single* leading "api/" here
  if (pathOnly.toLowerCase().startsWith("api/")) {
    pathOnly = pathOnly.slice(4);
  }

  // DRF trailing slash (except files)
  if (pathOnly && !looksLikeFile(pathOnly) && !pathOnly.endsWith("/")) pathOnly+="/";

  return `${pathOnly}${query}${hash}`;
}

const api = axios.create({
  baseURL: "/api",                 // ← unified proxy (no /b)
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type":"application/json", Accept:"application/json" },
});

api.interceptors.request.use((config)=>{
  if (typeof config.url === "string") {
    const normalized = normalizeProxyPath(config.url);
    // If it's an absolute URL to a non-backend host, bypass the proxy.
    if (isAbs(normalized) && !sameBackendOrigin(normalized)) {
      config.baseURL = "";
      config.url = normalized;
    } else {
      // relative → join with /api
      config.url = normalized;
    }
  }

  // Timezone header + cookie
  if (typeof window !== "undefined") {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        config.headers = { ...(config.headers||{}), "X-Timezone": tz };
        if (typeof document !== "undefined") {
          document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
        }
      }
    } catch {}
  }

  // FormData → let browser set boundary
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers?.["Content-Type"];
    delete config.headers?.["content-type"];
  }
  return config;
});

export default api;