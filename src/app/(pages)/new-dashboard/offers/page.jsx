// src/app/(pages)/new-dashboard/offers/page.jsx
'use client';

import { useMemo, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';

export const dynamic = 'force-dynamic';

const MyOffersTable = nextDynamic(
  () => import('@/components/new-dashboard/sourcing/tables/MyOffersTable'),
  { ssr: false }
);

// lightweight role helpers
function roleHas(user, name) {
  const acct = user?.account_type;
  if (Array.isArray(acct)) return acct.map(String).map(s => s.toLowerCase()).includes(name);
  return Boolean(user?.[`is_${name}`]);
}
const isAgentish = (u) => roleHas(u, 'agent') || roleHas(u, 'seller');
const isBuyerish = (u) => roleHas(u, 'buyer') || !isAgentish(u); // fallback

export default function MyOffersPage() {
  const { user, hydrated } = useAuth();

  const agent = useMemo(() => isAgentish(user), [user]);
  const buyer = useMemo(() => isBuyerish(user), [user]);

  // default: agents see “sent”, buyers see “received”
  const [view, setView] = useState(agent ? 'sent' : 'received');

  const subtitle = !hydrated
    ? ''
    : view === 'sent'
      ? 'Quotes you’ve sent to buyers.'
      : 'Quotes you’ve received on your requests.';

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        My Offers
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {subtitle}
      </p>

      {/* If user can be both buyer & agent, show a simple toggle */}
      {agent && buyer && (
        <div className="mt-3 inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <button
            className={`px-3 py-1.5 text-sm ${view === 'received' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}`}
            onClick={() => setView('received')}
          >
            Received
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${view === 'sent' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}`}
            onClick={() => setView('sent')}
          >
            Sent
          </button>
        </div>
      )}

      <div className="mt-4">
        {/* MyOffersTable reads `mode`:
            - "sent": offers where submitter === me
            - "received": offers where request.buyer === me */}
        <MyOffersTable mode={view} />
      </div>
    </div>
  );
}