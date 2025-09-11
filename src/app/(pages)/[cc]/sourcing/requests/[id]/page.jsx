//src/app/(pages)/[cc]/sourcing/requests/[id]/page.jsx
import OfferList from "@/components/sourcing/OfferList";

export const dynamic = "force-dynamic"; // offers change frequently

export default function SourcingRequestDetail({ params: { cc, id } }) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Your request #{id}</h1>
      <p className="text-sm text-neutral-600 mb-6">We’ll notify you as offers arrive.</p>
      <OfferList cc={cc} requestId={id} />
    </main>
  );
}