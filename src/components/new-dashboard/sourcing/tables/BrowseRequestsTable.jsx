// src/components/new-dashboard/sourcing/tables/BrowseRequestsTable.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { listOpenRequests } from '@/lib/sourcing/api';
import OfferComposeModal from '../OfferComposeModal';

/* ------------------------- helpers ------------------------- */
function currencySym(code) {
  const map = { GHS: '₵', NGN: '₦', ZAR: 'R', KES: 'KSh', GBP: '£', USD: '$', EUR: '€' };
  return map[(code || '').toUpperCase()] || '';
}
function fmtMoney(n, c) {
  if (n == null || n === '') return null;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).format(Number(n));
  } catch {
    return `${currencySym(c)}${Number(n).toLocaleString()}`;
  }
}
function fmtRange(min, max, c) {
  const a = fmtMoney(min, c);
  const b = fmtMoney(max, c);
  if (a && b) return `${a} – ${b}`;
  return a || b || '—';
}
function daysLeft(deadline) {
  if (!deadline) return null;
  const end = new Date(deadline);
  end.setHours(23, 59, 59, 999);
  return Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
}
function shortRequestCode(req) {
  const raw = req?.public_id || req?.uid || req?.id;
  if (!raw) return 'RQ-??????';
  const s = String(raw);
  const base = /^\d+$/.test(s)
    ? Number(s).toString(36).toUpperCase()
    : s.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `RQ-${base.padStart(6, '0').slice(-6)}`;
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

/* ---------------------- component ------------------------- */
export default function BrowseRequestsTable() {
  const router = useRouter();
  const sp = useSearchParams();

  const [rows, setRows] = useState([]);
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [flash, setFlash] = useState('');
  const [q, setQ] = useState(''); // client-side search

  const sentinelRef = useRef(null);
  const lastOpenBtnRef = useRef(null);
  const closingRef = useRef(false);

  // initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await listOpenRequests({ page: 1, page_size: 12 });
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        if (!alive) return;
        setRows(items);
        setHasMore(Boolean(data?.next) || items.length >= 12);
        setPage(1);
        setError('');
      } catch {
        if (alive) setError('Failed to load requests.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // deep-link open: ?quote=<id>
  useEffect(() => {
    if (closingRef.current) return; // ignore while closing
    const qid = sp.get('quote');
    if (!qid) {
      setPicked(null);
      return;
    }
    if (picked?.id && String(picked.id) === qid) return; // already open
    const found = rows.find(
      (r) => String(r.id) === qid || String(r.public_id) === qid || String(r.uid) === qid
    );
    if (found) setPicked(found);
  }, [sp, rows, picked]);

  function openQuote(r, btnEl) {
    setPicked(r);
    lastOpenBtnRef.current = btnEl ?? null;
    const params = new URLSearchParams(sp?.toString() || '');
    params.set('quote', String(r.id));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function closeQuote() {
    closingRef.current = true;
    setPicked(null);
    const params = new URLSearchParams(sp?.toString() || '');
    params.delete('quote');
    router.replace(params.size ? `?${params.toString()}` : '', { scroll: false });
    requestAnimationFrame(() => {
      try {
        lastOpenBtnRef.current?.focus();
      } catch {}
      setTimeout(() => {
        closingRef.current = false;
      }, 120);
    });
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await listOpenRequests({ page: page + 1, page_size: 12 });
      const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setRows((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...items.filter((it) => !seen.has(it.id))];
      });
      setHasMore(Boolean(data?.next) || items.length >= 12);
      setPage((p) => p + 1);
    } finally {
      setLoadingMore(false);
    }
  }

  // infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, page, rows.length]);

  // counts
  const totalActive = useMemo(
    () => rows.filter((r) => (daysLeft(r?.deadline) ?? 1) >= 0).length,
    [rows]
  );

  // simple client-side filter
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const hay =
        `${r.title || ''} ${r.deliver_to_city || ''} ${r.deliver_to_country || ''}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q, rows]);

  const skeletons = Array.from({ length: 9 });

  return (
    <section className="space-y-4">
      {/* Control bar with brand gradient */}
      <div
        className="rounded-xl p-[1px]"
        style={{
          background:
            'linear-gradient(90deg, var(--violet-600, #8710D8) 0%, var(--brand-600, #1E5BFF) 100%)',
        }}
      >
        <div className="rounded-[11px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search requests…"
              className="h-10 w-full sm:flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 text-sm"
            />
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {filtered.length} shown • {totalActive} active
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              className="rounded-md border border-red-300/70 px-2 py-1 text-xs hover:bg-red-100 dark:hover:bg-red-900/40"
              onClick={() => {
                setError('');
                (async () => {
                  try {
                    setLoading(true);
                    const data = await listOpenRequests({ page: 1, page_size: 12 });
                    const items = Array.isArray(data?.results)
                      ? data.results
                      : Array.isArray(data)
                      ? data
                      : [];
                    setRows(items);
                    setHasMore(Boolean(data?.next) || items.length >= 12);
                    setPage(1);
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={`sk-${i}`}
              className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-neutral-700/30 to-transparent" />
            </div>
          ))}

        {!loading &&
          filtered.map((r) => {
            const dleft = daysLeft(r?.deadline);
            const late = dleft != null && dleft < 0;
            const code = shortRequestCode(r);
            const cur = (r?.currency || 'GHS').toUpperCase();
            const offersCount = r?.offers_count ?? 0;

            return (
              <article
                key={r.id}
                className={clsx(
                  'group relative overflow-hidden rounded-2xl border p-4',
                  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                )}
              >
                <div className="mb-3">
                  {dleft == null ? (
                    <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                      No deadline
                    </span>
                  ) : late ? (
                    <span className="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-xs text-rose-700 dark:text-rose-300">
                      Deadline passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                      {dleft}d left
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {r.title}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => openQuote(r, e.currentTarget)}
                    disabled={late}
                    className={clsx(
                      'shrink-0 rounded-lg px-3 py-1.5 text-sm',
                      late
                        ? 'bg-neutral-300 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
                        : 'text-white hover:opacity-95',
                      !late &&
                        'bg-[color:var(--brand-600,#1E5BFF)] dark:bg-[color:var(--brand-600,#1E5BFF)]'
                    )}
                    title={late ? 'Deadline passed' : 'Send quote'}
                  >
                    Quote
                  </button>
                </div>

                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {r.deliver_to_city ? `${r.deliver_to_city}, ` : ''}
                  {(r.deliver_to_country || '').toUpperCase()} • {(r.currency || '').toUpperCase()}
                </div>

                <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {fmtRange(r.budget_min, r.budget_max, cur)}
                </div>

                {r.specs?.details && (
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {r.specs.details}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={async () => {
                      await copyText(code);
                      setCopiedCode(code);
                      setFlash(`${code} copied`);
                      setTimeout(() => setCopiedCode(null), 1200);
                      setTimeout(() => setFlash(''), 1400);
                    }}
                    className={clsx(
                      'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono',
                      'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    )}
                    title="Copy request code"
                  >
                    {code}
                    <span
                      className={clsx(
                        'transition-opacity duration-200',
                        copiedCode === code ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      ✓
                    </span>
                  </button>

                  <span
                    className={clsx(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      // brand-tinted chip
                      'bg-[color:var(--brand-50,#F3F7FF)] text-[color:var(--brand-700,#1246CA)] dark:bg-[color:rgba(30,91,255,0.18)] dark:text-[color:var(--brand-200,#C7D7FF)]'
                    )}
                  >
                    {offersCount} {offersCount === 1 ? 'offer' : 'offers'}
                  </span>
                </div>
              </article>
            );
          })}

        {!loading && !filtered.length && !error && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-neutral-600 dark:text-neutral-400">
            No open requests match your search.
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

      {flash && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm shadow-lg"
        >
          {flash}
        </div>
      )}

      {picked && (
        <OfferComposeModal
          request={picked}
          onClose={closeQuote}
          onCreated={() => {
            closeQuote();
            setFlash('Quote sent ✅');
            setTimeout(() => setFlash(''), 1500);
          }}
        />
      )}
    </section>
  );
}