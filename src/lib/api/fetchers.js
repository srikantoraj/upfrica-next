// src/lib/api/fetchers.js
const withSlash = (p) => (/\.[a-z0-9]+$/i.test(p) || p.endsWith('/') ? p : `${p}/`);

export async function fetchJson(path, opts = {}) {
  const t0 = performance.now();
  const res = await fetch(withSlash(path), {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
    ...opts,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return {
    ok: res.ok,
    status: res.status,
    ms: Math.round(performance.now() - t0),
    data,
    error: res.ok ? null : (data?.detail || res.statusText),
  };
}

export async function fetchWithAuthRetry(path, opts = {}, attempts = 2, delayMs = 150) {
  let last;
  for (let i = 0; i < attempts; i++) {
    last = await fetchJson(path, opts);
    if (last.status !== 401 && last.status !== 403) return last;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return last;
}