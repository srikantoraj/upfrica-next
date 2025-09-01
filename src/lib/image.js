// Prefer a clear MEDIA_BASE (CDN) over API host
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ||
  process.env.NEXT_PUBLIC_CDN_BASE ||
  'https://cdn.upfrica.com'
)  .replace(/^https?:\/\//, '')
  .replace(/\/.*/, '');

// keep both names to avoid ref errors anywhere
export const FALLBACK_IMAGE = 'https://d3q0odwafjkyv1.cloudfront.net/assets/placeholders/placeholder-600x600.webp';
export const FALLBACK_IMG = FALLBACK_IMAGE;

function absoluteMedia(path) {
  const p = String(path || '').replace(/^\/+/, '');
  const mediaPath = `/media/${p}`;
  return `${MEDIA_BASE}${mediaPath}`;
}

function repairUrl(abs) {
  let s = String(abs || '').trim();
  s = s
    .replace(/(cloudfront)\.ne\b/gi, '$1.net')      // .ne -> .net
    .replace(/(cloudfront\.net)(?![/:])/gi, '$1/'); // ensure "/"

  try {
    const u = new URL(s);
    const m = u.hostname.match(/^(.+\.cloudfront\.net)(.+)$/i);
    if (m) {
      u.hostname = m[1];
      u.pathname = '/' + m[2] + (u.pathname || '');
    }
    u.pathname = u.pathname.replace(/\/t\/t\//g, '/t/').replace(/\/{2,}/g, '/');
    return u.toString();
  } catch {
    return s
      .replace(/(cloudfront)\.ne\b/gi, '$1.net')
      .replace(/^((?:https?:)?\/\/[^/]+)([^/])/i, '$1/$2')
      .replace(/\/t\/t\//g, '/t/');
  }
}

export function fixImageUrl(u) {
  if (!u) return FALLBACK_IMAGE;
  let s = String(u).trim();
  if (!s || /^(null|none|undefined)$/i.test(s)) return FALLBACK_IMAGE;

  // JSON array payloads stored as strings
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      const first = Array.isArray(arr) ? arr[0] : null;
      if (typeof first === 'string') s = first;
      else if (first && typeof first === 'object') s = first.url || first.image_url || first.secure_url || first.src || '';
    } catch {}
  }

  if (/^https?:\/\//i.test(s) || s.startsWith('data:')) return repairUrl(s);
  if (s.startsWith('/media/')) return `${MEDIA_BASE}${s}`;
  if (/^media\//i.test(s))    return `${MEDIA_BASE}/${s}`;
  if (/^direct_uploads\//i.test(s)) return absoluteMedia(s);
  if (/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(s)) return absoluteMedia(s);

  const cleaned = s.replace(/^\/+/, '');
  return repairUrl(`${MEDIA_BASE}/${cleaned}`);
}

// helpers to pick first viable image from various shapes
function firstImageFromArray(arr) {
  for (const it of arr) {
    if (typeof it === 'string' && it.trim()) return it;
    if (it && typeof it === 'object') {
      const u = it.image_url || it.url || it.secure_url || it.src || it.path || it.image;
      if (typeof u === 'string' && u.trim()) return u;
    }
  }
  return null;
}

function pickCandidateImage(item) {
  if (!item || typeof item !== 'object') return null;

  const singleKeys = [
    'product_image_url','product_image','thumbnail','thumb',
    'image_url','image','main_image','primary_image','picture',
    'preview','cover_image','seo_image',
  ];
  for (const k of singleKeys) {
    const v = item[k];
    if (typeof v === 'string' && v.trim() && !/^(null|none|undefined)$/i.test(v)) return v;
  }

  const arrayKeys = ['image_objects','imageObjects','images','photos','gallery','media','pictures','thumbnails','product_images'];
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
    } else if (typeof nested === 'object') {
      for (const key of Object.keys(nested)) {
        const v = nested[key];
        if (Array.isArray(v)) {
          const first = firstImageFromArray(v);
          if (first) return first;
        }
      }
      const direct = nested.url || nested.image_url || nested.secure_url || nested.src;
      if (typeof direct === 'string' && direct.trim()) return direct;
    }
  }
  return null;
}

export function pickProductImage(item) {
  return fixImageUrl(pickCandidateImage(item) || FALLBACK_IMAGE);
}

export function pickShopHeroImage(shop) {
  return fixImageUrl(pickCandidateImage(shop) || shop?.top_banner || shop?.shop_logo || FALLBACK_IMAGE);
}