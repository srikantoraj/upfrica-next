// Custom loader for next/image.
// DO NOT rewrite absolute bucket URLs. Add ?w=&q= only when safe.

const CDN_HOST = (process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.upfrica.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/+$/, '');

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE || `https://${CDN_HOST}`)
  .replace(/\/+$/, '');

const API_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL || '')
  .replace(/\/+$/, '');

function isAbs(u)     { return /^https?:\/\//i.test(u); }
function isData(u)    { return /^data:/i.test(u); }
function join(...p)   { return p.filter(Boolean).join('/').replace(/([^:]\/)\/+/g, '$1'); }
function clampQ(q)    { const n = +q; return Number.isFinite(n) ? Math.min(100, Math.max(1, Math.round(n))) : 75; }

const PASS_THROUGH_RE =
  /(amazonaws\.com|r2\.cloudflarestorage\.com|storage\.googleapis\.com|digitaloceanspaces\.com|blob\.core\.windows\.net|supabase\.co)/i;

function shouldAppendParams(urlStr) {
  if (!isAbs(urlStr)) return true;
  try {
    const sp = new URL(urlStr).searchParams;
    // Don’t touch signed URLs
    if (sp.has('X-Amz-Signature') || sp.has('X-Amz-Algorithm') || sp.has('X-Amz-Credential')) return false;
    if (sp.has('X-Goog-Signature') || sp.has('X-Goog-Algorithm') || sp.has('GoogleAccessId')) return false;
    return true;
  } catch { return true; }
}

function withSizeParams(urlStr, width, quality) {
  if (!shouldAppendParams(urlStr)) return urlStr;
  if (isAbs(urlStr)) {
    const u = new URL(urlStr);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', String(clampQ(quality)));
    return u.toString();
  }
  const sep = urlStr.includes('?') ? '&' : '?';
  return `${urlStr}${sep}w=${encodeURIComponent(width)}&q=${encodeURIComponent(clampQ(quality))}`;
}

export default function cdnImageLoader({ src, width, quality }) {
  if (!src) return '';
  if (isData(src)) return src;

  let out;

  // Absolute URLs
  if (isAbs(src)) {
    try {
      const u = new URL(src);
      if (u.hostname === CDN_HOST) {
        out = u.toString();                  // our CDN → keep
      } else if (PASS_THROUGH_RE.test(u.hostname)) {
        out = u.toString();                  // S3/R2/GCS/Spaces/etc → PASS THROUGH
      } else {
        out = u.toString();                  // any other host → keep
      }
    } catch { /* fall through */ }
  }

  // Relative URLs
  if (!out) {
    if (src.startsWith('/media/')) {
      out = join(MEDIA_BASE, src);           // Django media via MEDIA_BASE/CDN
    } else if (src.startsWith('direct_uploads/')) {
      out = join(MEDIA_BASE, '/media/', src);
    } else if (API_ORIGIN) {
      out = join(API_ORIGIN, src);           // site-local assets
    } else {
      out = src;                             // dev fallback
    }
  }

  return withSizeParams(out, width, quality);
}