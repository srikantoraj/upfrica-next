// Custom loader for next/image.
// Rewrites S3 & /media/* URLs to your CDN host, and leaves other absolute URLs intact.

const CDN_HOST = (process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.upfrica.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/+$/, ''); // hostname only

const API_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL || '')
  .replace(/\/+$/, ''); // optional, used for non-media relative paths

function isAbs(u) { return /^https?:\/\//i.test(u); }
function isData(u) { return /^data:/i.test(u); }
function join(...parts) {
  return parts
    .filter(Boolean)
    .join('/')
    .replace(/(^|\b)https?:\/+/, (m) => m.replace(/\/+$/, '/') ) // keep protocol
    .replace(/([^:]\/)\/+/g, '$1'); // collapse //
}

/**
 * Next will call this with { src, width, quality }.
 * If your CDN supports resizing via query params, you can append `?w=${width}&q=${quality||75}`.
 * If not, just return the canonical URL without params (as below).
 */
export default function cdnImageLoader({ src, width, quality }) {
  if (!src) return '';

  // 1) Data URIs pass through
  if (isData(src)) return src;

  // 2) Absolute URLs
  if (isAbs(src)) {
    try {
      const u = new URL(src);

      // S3 → CDN (keep path)
      if (/\.s3[.-][a-z0-9-]+\.amazonaws\.com$/i.test(u.hostname)) {
        return `https://${CDN_HOST}${u.pathname}`;
      }

      // Already on CDN_HOST → return as-is
      if (u.hostname === CDN_HOST) return u.toString();

      // Any other absolute host → return as-is
      return u.toString();
    } catch {
      // If URL parsing fails, fall through to treat as relative
    }
  }

  // 3) Relative paths
  if (src.startsWith('/media/')) {
    // Django media → serve via CDN
    return join(`https://${CDN_HOST}`, src);
  }

  // If you have other relative assets that should come from site origin:
  if (API_ORIGIN) {
    return join(API_ORIGIN, src);
  }

  // Fallback to current origin (dev)
  return src;
}