// Custom loader for next/image.
// Rewrites S3 & /media/* URLs to your CDN host, and appends ?w=&q= for Next.
// Other absolute URLs are passed through (with ?w=&q= appended).

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
    .replace(/(^|\b)https?:\/+/, (m) => m.replace(/\/+$/, '/'))
    .replace(/([^:]\/)\/+/g, '$1'); // collapse //
}

function clampQuality(q) {
  const n = Number(q);
  if (!Number.isFinite(n)) return 75;
  return Math.min(100, Math.max(1, Math.round(n)));
}

function withSizeParams(urlStr, width, quality) {
  // If absolute, use URL API to merge/override params
  if (isAbs(urlStr)) {
    const u = new URL(urlStr);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', String(clampQuality(quality)));
    return u.toString();
  }
  // Relative: append (don’t sweat duplicates)
  const sep = urlStr.includes('?') ? '&' : '?';
  return `${urlStr}${sep}w=${encodeURIComponent(width)}&q=${encodeURIComponent(clampQuality(quality))}`;
}

/**
 * Next calls this with { src, width, quality }.
 * We always return a URL that includes ?w=&q= to satisfy Next’s custom loader contract.
 */
export default function cdnImageLoader({ src, width, quality }) {
  if (!src) return '';

  // 1) Data URIs pass through unchanged
  if (isData(src)) return src;

  let out;

  // 2) Absolute URLs
  if (isAbs(src)) {
    try {
      const u = new URL(src);

      // S3 → CDN (keep path, drop origin)
      if (/\.s3[.-][a-z0-9-]+\.amazonaws\.com$/i.test(u.hostname)) {
        out = `https://${CDN_HOST}${u.pathname}`;
      } else if (u.hostname === CDN_HOST) {
        out = u.toString();
      } else {
        // Any other absolute host → keep as-is
        out = u.toString();
      }
    } catch {
      // Fall through to relative handling
    }
  }

  // 3) Relative paths (or parse failure above)
  if (!out) {
    if (src.startsWith('/media/')) {
      // Django media via CDN
      out = join(`https://${CDN_HOST}`, src);
    } else if (API_ORIGIN) {
      // Site-local assets from configured origin
      out = join(API_ORIGIN, src);
    } else {
      // Dev fallback: keep relative
      out = src;
    }
  }

  // Ensure ?w=&q= are present to avoid Next warning
  return withSizeParams(out, width, quality);
}