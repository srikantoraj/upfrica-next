// src/lib/sourcing/hooks.js
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const BASE = '/api/sourcing';

function toParams(obj = {}) {
  const s = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.set(k, v);
  });
  return s;
}

async function fetchOffersPage(params) {
  const url = new URL(`${BASE}/offers/`, window.location.origin);
  url.search = toParams(params).toString();
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return {
    items: Array.isArray(json?.results) ? json.results : Array.isArray(json) ? json : [],
    next: json?.next || null,
  };
}

export function useOffers(arg) {
  const opts = typeof arg === 'object' && arg !== null ? arg : { requestId: arg };
  const { requestId, cc, status = 'all', search = '', pollMs = 15000, pageSize = 50, fetchAll = true } = opts;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useMemo(() => {
    const p = {};
    if (requestId) p.request = requestId;
    if (cc) p.country = String(cc).toLowerCase();
    if (status && status !== 'all') p.status = status;
    if (search) p.search = search;
    p.page_size = pageSize;
    return p;
  }, [requestId, cc, status, search, pageSize]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let page = 1;
      let all = [];
      // fetch first page
      let { items, next } = await fetchOffersPage({ ...params, page });
      all = all.concat(items);
      // optionally walk all pages
      while (fetchAll && next) {
        page += 1;
        ({ items, next } = await fetchOffersPage({ ...params, page }));
        all = all.concat(items);
      }
      setOffers(all);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [params, fetchAll]);

  useEffect(() => {
    let alive = true;
    (async () => { if (alive) await load(); })();
    const id = pollMs ? setInterval(() => alive && load(), pollMs) : null;
    return () => { alive = false; if (id) clearInterval(id); };
  }, [load, pollMs]);

  return { offers, loading, error, refresh: load, params };
}