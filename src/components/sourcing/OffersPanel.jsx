//src/components/sourcing/OffersPanel.jsx:
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

export default function OffersPanel({ cc = 'gh' }) {
  const sp = useSearchParams();
  const requestId = sp.get('request');

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!requestId) {
        setRequest(null);
        setOffers([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [rReq, rOffers] = await Promise.all([
          fetch(`/api/sourcing/requests/${encodeURIComponent(requestId)}/`, {
            credentials: 'include',
            cache: 'no-store',
          }),
          fetch(
            `/api/sourcing/offers/?request=${encodeURIComponent(requestId)}&country=${encodeURIComponent(
              cc
            )}&page=1`,
            { credentials: 'include', cache: 'no-store' }
          ),
        ]);

        const reqData = rReq.ok ? await rReq.json() : null;
        const offData = rOffers.ok ? await rOffers.json() : null;

        if (!alive) return;

        if (reqData) setRequest(reqData);
        const list = Array.isArray(offData?.results)
          ? offData.results
          : Array.isArray(offData)
          ? offData
          : [];
        setOffers(list);
      } catch {
        if (alive) setError('Failed to load offers.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [requestId, cc]);

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Live offers</h2>

      <div className="text-sm text-neutral-600 mb-3">
        {requestId ? (
          <>
            Offers for:{' '}
            <span className="font-medium">{request?.title || `Request #${requestId}`}</span>
            <span className="ml-1 text-neutral-400">#{requestId}</span>
          </>
        ) : (
          <>Select a request above to see its offers.</>
        )}
      </div>

      {loading && (
        <div className="p-3 border rounded-lg">Loading offers…</div>
      )}
      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-sm text-red-700 rounded">
          {error}
        </div>
      )}

      {!loading && requestId && offers.length === 0 && (
        <div className="p-4 border rounded-xl bg-neutral-50 text-sm">
          <div className="font-medium">No offers yet for this request.</div>
          <div className="text-neutral-600 mt-1">
            Your request is now visible to sourcing agents. We’ll notify you as soon as someone bids.
          </div>
        </div>
      )}

      <div className="space-y-3">
        {offers.map((o) => (
          <article key={o.id} className="border rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Seller</div>
              {o.status && (
                <span
                  className={clsx(
                    'text-xs rounded-full px-2 py-0.5',
                    o.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : o.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-neutral-100 text-neutral-700'
                  )}
                >
                  {o.status}
                </span>
              )}
            </div>

            <div className="mt-1 text-sm text-neutral-700 whitespace-pre-line">
              {o.notes || o.message || o.description || '—'}
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-8 mt-3 text-sm">
              <div>
                <dt className="text-neutral-500">Price</dt>
                <dd className="font-medium">
                  {o.price_display || o.price_text || o.price || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Condition</dt>
                <dd className="font-medium">{o.condition || '—'}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">ETA</dt>
                <dd className="font-medium">
                  {o.eta_display || o.eta_text || (o.eta_days ? `${o.eta_days} days` : '—')}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">MOQ</dt>
                <dd className="font-medium">{o.moq || '—'}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}