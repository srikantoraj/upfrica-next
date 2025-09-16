// src/app/(pages)/new-dashboard/requests/page.jsx
'use client';

import nextDynamic from 'next/dynamic';
export const dynamic = 'force-dynamic';

const MyRequests = nextDynamic(
  () => import('@/components/new-dashboard/sourcing/MyRequests'),
  { ssr: false }
);

export default function BuyerRequestsListPage() {
  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        My Requests
      </h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        View your sourcing requests, check offers, and manage status.
      </p>

      <div className="mt-4">
        <MyRequests detailsHrefBase="/new-dashboard/requests" />
      </div>
    </div>
  );
}