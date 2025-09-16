// src/app/(pages)/new-dashboard/requests/[id]/page.jsx
// Buyer: Request details + offers (server wrapper → client)
import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const RequestDetails = nextDynamic(
  () => import("@/components/new-dashboard/sourcing/RequestDetails"),
  { ssr: false }
);

export default function BuyerRequestDetailsPage({ params }) {
  const { id } = params || {};
  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <RequestDetails requestId={String(id)} />
    </div>
  );
}