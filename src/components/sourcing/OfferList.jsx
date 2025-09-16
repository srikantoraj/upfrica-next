// src/components/sourcing/OfferList.jsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { listOffers, acceptOffer } from '@/lib/sourcing/api';

function money(v, ccy) {
  if (v == null || v === '' || Number.isNaN(Number(v))) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (ccy || 'USD').toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(v));
  } catch {
    return `${ccy ? `${ccy} ` : ''}${Number(v).toFixed(2)}`;
  }
}

function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-neutral-100 text-neutral-700',
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warn: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs', tones[tone])}>
      {children}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
      <div className="h-4 w-1/2 rounded bg-neutral-200" />
      <div className="mt-3 h-3 w-2/3 rounded bg-neutral-200" />
      <div className="mt-4 h-9 w-28 rounded bg-neutral-200" />
    </div>
  );
}

function isImg(url = '') {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}

function OfferCard({ offer, onAccept, disabled }) {
  const statusRaw = (offer?.status || 'submitted').toLowerCase();
  const status =
    statusRaw === 'submitted' || statusRaw === 'pending' ? 'pending' : statusRaw;

  const tone =
    status === 'accepted' ? 'success' : status === 'pending' ? 'info' : 'neutral';

  const ccy =
    (offer?.currency ||
      offer?.price_currency ||
      offer?.currency_code ||
      'GHS').toUpperCase();

  // New schema (with graceful fallbacks)
  const item = offer?.quoted_item_cost ?? offer?.item_price ?? offer?.price ?? 0;
  const service = offer?.agent_fee ?? offer?.service_fee ?? 0;
  const delivery = offer?.delivery_fee ?? offer?.shipping_fee ?? 0;
  const total =
    offer?.buyer_total ??
    [item, service, delivery].map(Number).reduce((a, b) => a + b, 0);

  const eta =
    offer?.eta_days != null
      ? `${offer.eta_days} day${offer.eta_days === 1 ? '' : 's'}`
      : offer?.eta || '—';

  const submitterTag =
    offer?.submitter_type === 'seller'
      ? 'Offer from Verified Seller'
      : 'Offer from Upfrica Sourcing Agent';

  const specBits = [offer?.brand, offer?.model, offer?.variant]
    .filter(Boolean)
    .join(' · ');
  const exactOnly = offer?.no_alternatives === true;

  const attachments = Array.isArray(offer?.attachments) ? offer.attachments : [];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold truncate">
              {offer?.seller_name || offer?.seller?.name || offer?.submitter_name || 'Seller'}
            </h3>
            <Badge tone="neutral">{submitterTag}</Badge>
            {exactOnly && <Badge tone="warn">Exact match only</Badge>}
            <Badge tone={tone}>&nbsp;{status}</Badge>
          </div>

          {specBits && (
            <div className="mt-1 text-sm text-neutral-700">
              <span className="text-neutral-500">Spec: </span>
              <span className="font-medium">{specBits}</span>
            </div>
          )}

          <div className="mt-1 text-sm text-neutral-600 line-clamp-2">
            {offer?.notes || offer?.message || offer?.description || 'No note from seller/agent'}
          </div>

          {/* Attachments */}
          {!!attachments.length && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {attachments.slice(0, 6).map((u, i) => (
                <a
                  key={`${offer.id}-att-${i}`}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md border"
                >
                  {isImg(u) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u} alt={`Attachment ${i + 1}`} className="h-20 w-full object-cover" />
                  ) : (
                    <div className="grid h-20 w-full place-items-center text-xs text-neutral-500">
                      View
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Price breakdown */}
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-5">
            <div>
              <dt className="text-neutral-500">Item</dt>
              <dd className="font-medium">{money(item, ccy)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Service</dt>
              <dd className="font-medium">{money(service, ccy)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Delivery</dt>
              <dd className="font-medium">{money(delivery, ccy)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">ETA</dt>
              <dd className="font-medium">{eta}</dd>
            </div>
            <div className="sm:text-right">
              <dt className="text-neutral-500">All-in total</dt>
              <dd className="font-semibold">{money(total, ccy)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex gap-2 sm:flex-col sm:items-stretch">
          <button
            type="button"
            disabled={disabled || status === 'accepted'}
            onClick={() => onAccept?.(offer)}
            className={clsx(
              'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
              status === 'accepted'
                ? 'bg-emerald-600 text-white disabled:opacity-100'
                : 'bg-black text-white hover:bg-black/90 disabled:opacity-50'
            )}
          >
            {status === 'accepted' ? 'Accepted' : 'Accept & Continue'}
          </button>

          {offer?.details_url && (
            <Link
              href={offer.details_url}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * OfferList
 * - If `requestId` is provided, filters offers for that request.
 * - Otherwise shows the user's recent offers (optionally by `cc`).
 */
export default function OfferList({ requestId, cc }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const pageRef = useRef(1);
  const [hasMore, setHasMore] = useState(false);

  const queryParams = useMemo(() => {
    const params = { page: pageRef.current };
    if (requestId) params.request = requestId;
    if (cc) params.country = String(cc).toLowerCase();
    if (status !== 'all') params.status = status;
    if (q.trim()) params.q = q.trim();
    return params;
  }, [requestId, cc, status, q]);

  const fetchOffers = useCallback(
    async (reset = true) => {
      try {
        if (reset) {
          setLoading(true);
          pageRef.current = 1;
        }
        // Prefer your API helper; fall back to fetch if needed.
        let data;
        try {
          data = await listOffers(queryParams);
        } catch {
          const url = new URL('/api/sourcing/offers/', window.location.origin);
          Object.entries(queryParams).forEach(([k, v]) => url.searchParams.set(k, v));
          const res = await fetch(url.toString(), { credentials: 'include' });
          if (!res.ok) throw new Error(`Failed (${res.status})`);
          data = await res.json();
        }

        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        setOffers(reset ? items : (prev) => [...prev, ...items]);

        const hasNext =
          (data && typeof data?.next === 'string' && data.next) ||
          (Array.isArray(data?.results) && data.results.length >= 20);
        setHasMore(Boolean(hasNext));
      } catch {
        setError('Could not load offers.');
      } finally {
        setLoading(false);
      }
    },
    [queryParams]
  );

  useEffect(() => {
    fetchOffers(true);
    const t = setInterval(() => fetchOffers(true), 15000);
    return () => clearInterval(t);
  }, [fetchOffers]);

  async function onLoadMore() {
    pageRef.current += 1;
    await fetchOffers(false);
  }

  async function handleAccept(offer) {
    if (!offer?.id) return;
    if (!window.confirm('Accept this offer? Specs will be locked and you’ll continue to checkout.')) return;
    try {
      setAcceptingId(offer.id);
      await acceptOffer(offer.id); // POST /offers/:id/accept/
      // Optimistic refresh
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, status: 'accepted' } : o))
      );
    } catch {
      alert('Sorry, failed to accept this offer.');
    } finally {
      setAcceptingId(null);
    }
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return offers;
    return offers.filter((o) => {
      const hay = [
        o?.seller_name,
        o?.seller?.name,
        o?.submitter_name,
        o?.notes,
        o?.message,
        o?.description,
        o?.brand,
        o?.model,
        o?.variant,
        String(o?.quoted_item_cost ?? o?.price ?? ''),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [offers, q]);

  return (
    <section className="mt-10 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Offers</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-600">Status</label>
            <select
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <input
            type="search"
            placeholder="Search offers…"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
          <div className="text-2xl mb-1">🕵️‍♀️</div>
          <p className="text-sm text-neutral-700">
            No offers yet. We’ll notify you as soon as sellers respond.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Tip: include exact specs, quantity, delivery city and deadline in your request to get
            faster quotes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            disabled={acceptingId === offer.id}
            onAccept={handleAccept}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}