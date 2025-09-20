// src/lib/image.js

// Prefer a stable branded placeholder (square, transparent bg)
export const MEDIA_BASE = (
  process.env.NEXT_PUBLIC_MEDIA_BASE ||
  process.env.NEXT_PUBLIC_CDN_BASE ||
  "https://cdn.upfrica.com"
).replace(/\/+$/, "");

export const FALLBACK_IMAGE =
  process.env.NEXT_PUBLIC_FALLBACK_IMAGE ||
  "https://cdn.upfrica.com/assets/placeholders/pdp-fallback-800.webp";
export const FALLBACK_IMG = FALLBACK_IMAGE;

const CDN_HOST = (process.env.NEXT_PUBLIC_CDN_HOST || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

const MEDIA_HOST = (process.env.NEXT_PUBLIC_MEDIA_HOST || process.env.NEXT_PUBLIC_MEDIA_BASE || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/.*/, "");

// Common raw storage hosts
const RAW_HOST_RE =
  /(s3[.-][a-z0-9-]+\.amazonaws\.com|r2\.cloudflarestorage\.com|digitaloceanspaces\.com|blob\.core\.windows\.net|storage\.googleapis\.com|googleapis\.com)/i;

function absoluteMedia(path) {
  const p = String(path || "").replace(/^\/+/, "");
  return `${MEDIA_BASE}/media/${p}`;
}

// Decode "https%3A/cdn..." or ".../https%3A/cdn..." proxy artifacts
function cleanProxy(u) {
  if (!u) return u;
  let s = String(u);
  if (/https?%3A/i.test(s)) {
    const start = s.toLowerCase().indexOf("http");
    const slice = start >= 0 ? s.slice(start) : s;
    try {
      const decoded = decodeURIComponent(slice);
      return decoded.replace(/^https:\//, "https://").replace(/^http:\//, "http://");
    } catch {}
  }
  try {
    const url = new URL(s);
    const p = url.pathname.replace(/^\/+/, "");
    if (/^(https|http)%3A/i.test(p)) {
      const decoded = decodeURIComponent(p)
        .replace(/^https:\//, "https://")
        .replace(/^http:\//, "http://");
      if (/^https?:\/\//i.test(decoded)) return decoded;
    }
  } catch {}
  return s;
}

function repairUrl(abs) {
  let s = String(abs || "").trim();
  s = s
    .replace(/(cloudfront)\.ne\b/gi, "$1.net") // .ne -> .net typos
    .replace(/cloudfront\.netdirect_uploads/gi, "cloudfront.net/direct_uploads") // missing slash
    .replace(/(cloudfront\.net)(?![/:])/gi, "$1/") // ensure path slash
    .replace(/\/{2,}/g, "/"); // collapse double slashes (path)
  try {
    const u = new URL(s);
    u.pathname = u.pathname.replace(/\/t\/t\//g, "/t/").replace(/\/{2,}/g, "/");
    return u.toString();
  } catch {
    return s;
  }
}

export function fixImageUrl(u) {
  if (!u) return FALLBACK_IMAGE;
  let s = String(u).trim();
  if (!s || /^(null|none|undefined)$/i.test(s)) return FALLBACK_IMAGE;

  // JSON array payloads saved as strings
  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      const first = Array.isArray(arr) ? arr[0] : null;
      if (typeof first === "string") s = first;
      else if (first && typeof first === "object")
        s = first.url || first.image_url || first.secure_url || first.src || "";
    } catch {}
  }

  // Fix percent-encoded proxy format first
  s = cleanProxy(s);

  // Full URLs or data URLs → repair & pass through
  if (/^https?:\/\//i.test(s) || s.startsWith("data:")) {
    return repairUrl(s);
  }

  // Common relative shapes from DRF/media
  if (s.startsWith("/media/")) return `${MEDIA_BASE}${s}`;
  if (/^media\//i.test(s)) return `${MEDIA_BASE}/${s}`;
  if (/^direct_uploads\//i.test(s)) return absoluteMedia(s);
  if (/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(s)) return absoluteMedia(s);

  const cleaned = s.replace(/^\/+/, "");
  return repairUrl(`${MEDIA_BASE}/${cleaned}`);
}

// ---- helpers to pick a viable image from many shapes ----
function firstImageFromArray(arr) {
  for (const it of arr || []) {
    if (typeof it === "string" && it.trim()) return it;
    if (it && typeof it === "object") {
      const u =
        it.image_url ||
        it.url ||
        it.secure_url ||
        it.src ||
        it.path ||
        it.image ||
        it.thumbnail;
      if (typeof u === "string" && u.trim()) return u;
    }
  }
  return null;
}

function pickCandidateImage(item) {
  if (!item || typeof item !== "object") return null;

  const singleKeys = [
    "product_image_url",
    "product_image",
    "thumbnail",
    "thumb",
    "image_url",
    "image",
    "main_image",
    "primary_image",
    "picture",
    "preview",
    "cover_image",
    "seo_image",
  ];
  for (const k of singleKeys) {
    const v = item[k];
    if (typeof v === "string" && v.trim() && !/^(null|none|undefined)$/i.test(v)) return v;
  }

  const arrayKeys = [
    "image",
    "image_objects",
    "imageObjects",
    "images",
    "photos",
    "gallery",
    "media",
    "pictures",
    "thumbnails",
    "product_images",
  ];
  for (const k of arrayKeys) {
    const v = item[k];
    if (Array.isArray(v)) {
      const first = firstImageFromArray(v);
      if (first) return first;
    }
  }

  const nested = item.media || item.assets || item.primary_media;
  if (nested) {
    if (Array.isArray(nested)) {
      const first = firstImageFromArray(nested);
      if (first) return first;
    } else if (typeof nested === "object") {
      for (const key of Object.keys(nested)) {
        const v = nested[key];
        if (Array.isArray(v)) {
          const first = firstImageFromArray(v);
          if (first) return first;
        }
      }
      const direct = nested.url || nested.image_url || nested.secure_url || nested.src;
      if (typeof direct === "string" && direct.trim()) return direct;
    }
  }
  return null;
}

export function pickProductImage(item) {
  return fixImageUrl(pickCandidateImage(item) || FALLBACK_IMAGE);
}

export function pickShopHeroImage(shop) {
  return fixImageUrl(
    pickCandidateImage(shop) || shop?.top_banner || shop?.shop_logo || FALLBACK_IMAGE
  );
}

// Tell Next/Image when to skip its optimizer (CDN + raw storage + /media)
export function shouldBypassOptimizer(u) {
  if (!u) return false;
  if (/^data:/i.test(u)) return true;
  try {
    const host = new URL(u).hostname.replace(/^www\./, "");
    return (
      (CDN_HOST && host === CDN_HOST) ||
      (MEDIA_HOST && host === MEDIA_HOST) ||
      RAW_HOST_RE.test(host)
    );
  } catch {
    // If it's a relative /media path, treat as raw
    return String(u || "").startsWith("/media/");
  }
}