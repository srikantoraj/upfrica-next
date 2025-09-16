//src/components/new-dashboard/sourcing/tables/MySourcingOrders.jsx
'use client';
import { useEffect, useState } from 'react';
import { listMySourcingOrders } from '@/lib/sourcing/api';

export default function MySourcingOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listMySourcingOrders({ page: 1 });
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        if (alive) setRows(items);
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="rounded border p-3">Loading…</div>;
  if (!rows.length) return <div className="rounded-xl border border-dashed p-6 text-sm text-neutral-600">No active jobs.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-3 py-2 text-left">Request</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Payout</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(o => (
            <tr key={o.id} className="border-t">
              <td className="px-3 py-2">{o.request_title || `#${o.request}`}</td>
              <td className="px-3 py-2 capitalize">{o.status}</td>
              <td className="px-3 py-2 text-right">
                {o.currency ? new Intl.NumberFormat(undefined,{style:'currency',currency:o.currency}).format(o.payout_amount || 0) : (o.payout_amount || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}