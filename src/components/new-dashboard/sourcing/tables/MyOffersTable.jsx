//src/components/new-dashboard/sourcing/tables/MyOffersTable.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

/* -------------------------------- helpers -------------------------------- */

const PAGE_SIZE = 12;

const sym = (c) =>
  ({
    GHS: '₵',
    NGN: '₦',
    KES: 'KSh',
    TZS: 'TSh',
    UGX: 'USh',
    RWF: 'FRw',
    GBP: '£',
    USD: '$',
    EUR: '€',
  }[String(c).toUpperCase()] || '');

const fmtMoney = (n, c) => {
  const v = Number(n || 0);
  if (!c) return v.toLocaleString();
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).format(v); }
  catch { return `${sym(c)}${v.toLocaleString()}`; }
};

const prettyCode = (raw) => {
  const id = raw?.public_id || raw?.uid || raw?.id || raw;
  if (!id) return 'RQ-??????';
  const s = String(id);
  const base = /^\d+$/.test(s)
    ? Number(s).toString(36).toUpperCase()
    : s.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `RQ-${base.padStart(6, '0').slice(-6)}`;
};

const statusStyle = (s) => {
  const k = String(s || '').toLowerCase();
  if (k === 'accepted' || k === 'awarded')
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (k === 'rejected')
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'; // submitted / pending
};

function parseNextParams(nextUrl) {
  try {
    if (!nextUrl) return null;
    const u = new URL(nextUrl);
    const sp = new URLSearchParams(u.search);
    const out = {};
    for (const k of ['page','page_size','ordering','status','q','received','mine','submitter','buyer']) {
      if (sp.has(k)) out[k] = sp.get(k);
    }
    return out;
  } catch { return null; }
}

/** Fetch offers for me.
 *  mode === 'sent'      -> offers I submitted
 *  mode === 'received'  -> offers on requests where I am the buyer
 */
async function fetchMyOffers(mode = 'received', params = {}, { signal } = {}) {
  const search = new URLSearchParams({
    page_size: String(PAGE_SIZE),
    ordering: '-created_at',
    ...params,
  }).toString();

  const candidates =
    mode === 'sent'
      ? [
          `/api/sourcing/my/offers/?${search}`,
          `/api/sourcing/offers/?mine=1&${search}`,
          `/api/sourcing/offers/?submitter=me&${search}`,
        ]
      : [
          `/api/sourcing/my/received_offers/?${search}`,
          `/api/sourcing/offers/?received=1&${search}`,
          `/api/sourcing/offers/?buyer=me&${search}`,
        ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { signal, credentials: 'include' });
      if (!res.ok) continue;
      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      return { results, next: data?.next || null };
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      // try next
    }
  }
  return { results: [], next: null };
}

/* -------------------------------- component ------------------------------- */

export default function MyOffersTable({ mode = 'received' }) {
  // filters
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(''); // '', 'submitted', 'accepted', 'rejected'
  const [sort, setSort] = useState('new');  // 'new' only for now, hook future sort options

  // data
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [nextParams, setNextParams] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const inFlight = useRef(null);
  const sentinelRef = useRef(null);

  // params builder
  const buildParams = () => {
    const p = {};
    if (q) p.q = q;
    if (status) p.status = status;
    // default '-created_at' set in fetcher; room for future sorts
    return p;
  };

  // page 1
  useEffect(() => {
    let alive = true;

    if (inFlight.current) inFlight.current.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const { results, next } = await fetchMyOffers(mode, { page: 1, ...buildParams() }, { signal: ctrl.signal });

        if (!alive) return;
        setRows(results);
        setPage(1);
        setHasMore(Boolean(next) || results.length === PAGE_SIZE);
        setNextParams(parseNextParams(next));
      } catch (e) {
        if (e?.name !== 'AbortError') setError('Failed to load your offers.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, q, status, sort]);

  // load more
  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const params = nextParams ?? { page: page + 1, ...buildParams() };
      const { results, next } = await fetchMyOffers(mode, params);
      setRows((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        return [...prev, ...results.filter((x) => !seen.has(x.id))];
      });
      setPage((p) => p + 1);
      setHasMore(Boolean(next) || results.length === PAGE_SIZE);
      setNextParams(parseNextParams(next));
    } finally {
      setLoadingMore(false);
    }
  }

  // infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) loadMore(); },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, page, rows.length]);

  const skeletons = Array.from({ length: 6 });

  /* ------------------------------- UI ------------------------------------ */

  return (
    <section className="space-y-3">
      {/* Brand bar (purple → blue) */}
      <div
        className="rounded-xl p-3 sm:p-4 text-sm text-neutral-800 dark:text-neutral-100 border border-[#8710D8]/20 dark:border-[#8710D8]/30"
        style={{ backgroundImage: 'linear-gradient(90deg, #8710D880, #8710D8CC 55%, #1E5BFF 100%)' }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={mode === 'sent' ? 'Search sent offers…' : 'Search received offers…'}
            className="h-10 w-full md:flex-1 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          >
            <option value="">All status</option>
            <option value="submitted">Submitted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          >
            <option value="new">Newest</option>
          </select>
        </div>

        <div className="mt-1 text-xs text-neutral-700/90 dark:text-neutral-300">
          {mode === 'sent'
            ? 'Offers you sent · Offers visible to buyers.'
            : 'Offers you received · Offers from agents/sellers on your requests.'}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={`sk-${i}`}
              className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-neutral-200/60 dark:via-neutral-700/30 to-transparent" />
            </div>
          ))}

        {!loading &&
          rows.map((o) => {
            const currency = (o.currency || o.request_currency || 'GHS').toUpperCase();
            const buyerTotal = Number(o.quoted_item_cost || 0) + Number(o.delivery_fee || 0);
            const reqId = o.request?.id || o.request;
            const reqTitle = o.request_title || o.request?.title || 'Request';
            const code = prettyCode(o.request_public_id || reqId);

            const viewHref = `/new-dashboard/requests/${reqId}`;

            return (
              <article
                key={o.id}
                className={clsx(
                  'group relative overflow-hidden rounded-2xl border p-4',
                  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                )}
              >
                <div className="mb-3">
                  <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs', statusStyle(o.status))}>
                    {String(o.status || 'submitted').toLowerCase()}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {reqTitle}
                  </h3>

                  <Link
                    href={viewHref}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-sm bg-[#1E5BFF] text-white hover:bg-[#1246CA]"
                    title="View request"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
                  <div className="font-medium">
                    Buyer total: {fmtMoney(buyerTotal, currency)}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Item: {fmtMoney(o.quoted_item_cost || 0, currency)} · Delivery: {fmtMoney(o.delivery_fee || 0, currency)} · ETA: {o.eta_days ? `${o.eta_days}d` : '—'}
                  </div>
                  {o.notes && (
                    <p className="mt-2 line-clamp-2 text-neutral-600 dark:text-neutral-400">
                      {o.notes}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {code}
                  </span>
                  <Link href={viewHref} className="text-sm text-[#1E5BFF] hover:underline">
                    View request →
                  </Link>
                </div>
              </article>
            );
          })}

        {!loading && !rows.length && !error && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-neutral-600 dark:text-neutral-400">
            {mode === 'sent'
              ? "You haven't sent any quotes yet."
              : "You haven't received any quotes yet."}
          </div>
        )}
      </div>

      <div ref={sentinelRef} />

      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className={clsx(
              'rounded-lg border px-4 py-2 text-sm',
              'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800',
              'hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-60'
            )}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}