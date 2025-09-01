/* eslint-disable no-console */
const RAW_CDN = process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.upfrica.com';
// hostname only, lowercased
const CDN_HOST = RAW_CDN.replace(/^https?:\/\//, '').replace(/\/.*/, '').toLowerCase();

const OUR_HOSTS = new Set([
  CDN_HOST,
  'd3q0odwafjkyv1.cloudfront.net',
  'd26ukeum83vx3b.cloudfront.net',
]);

function normalizeSrc(src) {
  if (!src) return '';

  let s = String(src).trim();

  // Leave data/blob URLs untouched
  if (/^(data|blob):/i.test(s)) return s;

  // Fix: "https://cdn.upfrica.com<key>" (missing slash after host)
  s = s.replace(/^(https?:\/\/cdn\.upfrica\.com)(?!\/)/i, '$1/');

  // If it's already absolute, collapse duplicate slashes after host,
  // collapse any '//' in the path (not protocol), and drop trailing slash.
  if (/^https?:\/\//i.test(s)) {
    s = s.replace(/(https?:\/\/[^/]+)\/+/, '$1/');
    s = s.replace(/([^:])\/{2,}/g, '$1/');
    return s.replace(/\/+$/, '');
  }

  // Scheme-relative
  if (/^\/\//.test(s)) return ('https:' + s).replace(/\/+$/, '');

  // Bare key -> prefix CDN
  s = s.replace(/^\/+/, ''); // no leading slashes in key
  s = `https://${CDN_HOST}/${s}`;
  return s.replace(/\/+$/, '');
}

module.exports = function cdnImageLoader({ src, width, quality }) {
  const url = normalizeSrc(src);
  if (!url) return '';

  // Add width/quality hints for caching (safe even if origin ignores them)
  const u = new URL(url);
  if (OUR_HOSTS.has(u.hostname.toLowerCase())) {
    if (width) u.searchParams.set('w', String(width));
    if (typeof quality === 'number') u.searchParams.set('q', String(quality));
  }

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[img-loader ↻]', { in: src, out: u.toString() });
  }
  return u.toString();
};