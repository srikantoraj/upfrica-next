//src/lib/product-events.js
import axiosInstance from '@/lib/axiosInstance';

function productEventUrl(slug) {
  if (!slug) return '';
  const base = (axiosInstance.defaults.baseURL || '/api').replace(/\/$/, '');
  return `${base}/products/${encodeURIComponent(slug)}/event/`;
}

export function postProductEvent(slug, event, meta = {}) {
  try {
    if (typeof window === 'undefined') return; // client-only
    const url = productEventUrl(slug);
    if (!url) return;
    const payload = JSON.stringify({ event, ...meta });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      keepalive: true,
      body: payload,
    }).catch(() => {});
  } catch {}
}