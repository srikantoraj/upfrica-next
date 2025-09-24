// lib/i18n.js
import { b } from '@/lib/api-path';

const inflight = new Map(); // key -> Promise

function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') sp.set(k, String(v));
  });
  return `?${sp.toString()}`;
}

export async function fetchI18nInit(country) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const key = `${String(country || '').toLowerCase()}|${tz}`;

  if (inflight.has(key)) return inflight.get(key);

  const url = b('i18n/init') + qs({ country, tz }); // no trailing slash
  const p = fetch(url, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(r => r.ok ? r.json() : null)
    .finally(() => inflight.delete(key));

  inflight.set(key, p);
  return p;
}