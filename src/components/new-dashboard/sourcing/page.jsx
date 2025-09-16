//src/app/(pages)/new-dashboard/sourcing/page.jsx
'use client';

import RequireRole from '@/components/new-dashboard/RequireRole';
import SourcingWorkbench from '@/components/new-dashboard/sourcing/SourcingWorkbench';

export const dynamic = 'force-dynamic';

export default function SourcingPage() {
  // Allow either seller or agent (your RequireRole already exists)
  return (
    <RequireRole roles={['seller', 'agent']}>
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Sourcing / Gigs</h1>
        <p className="text-sm text-neutral-600 mb-6">
          Browse buyer requests, submit quotes, and track your sourcing jobs.
        </p>
        <SourcingWorkbench />
      </main>
    </RequireRole>
  );
}