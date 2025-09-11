'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { myRequests } from '@/lib/sourcing/api';

export default function MyRequests({ cc, limit = 10 }) {
  const [state, setState] = useState({ results: [], count: 0, loading: true });

  useEffect(() => {
    let alive = true;
    (async () => {
      const resp = await myRequests({
        pageSize: limit,
        country: cc?.toLowerCase(),
        ordering: '-created_at',
        mine: 1,            // 👈 explicit
      });
      if (alive) setState({ ...resp, loading: false });
    })();
    return () => { alive = false; };
  }, [cc, limit]);

  if (state.loading) return <p className="text-sm text-neutral-500">Loading your requests…</p>;
  if (!state.results?.length) return <p className="text-sm">You haven’t posted any requests yet.</p>;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Your requests</h2>
      <ul className="space-y-3">
        {state.results.map(r => (
          <li key={r.id} className="rounded-lg border p-4 hover:bg-neutral-50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium line-clamp-1">{r.title}</div>
                <div className="text-xs text-neutral-600">
                  {(r.deliver_to_country || cc)?.toUpperCase()} · {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
              <Link
                href={`/${cc}/sourcing?request=${r.id}`}
                className="text-sm px-3 py-1.5 rounded-lg border hover:bg-black hover:text-white"
              >
                View offers
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}