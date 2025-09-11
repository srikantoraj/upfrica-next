import Link from "next/link";
import RequestForm from "@/components/sourcing/RequestForm";
import OffersPanel from "@/components/sourcing/OffersPanel";
import MyRequests from "@/components/sourcing/MyRequests";

export const dynamic = "force-static";
export const revalidate = 3600;
export function generateStaticParams() { return [{ cc: "gh" }, { cc: "ng" }, { cc: "ke" }]; }

// (generateMetadata unchanged)

export default function SourcingPage({ params: { cc } }) {
  const CC = String(cc || "").toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-2">
          <li><Link href={`/${cc}`} className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-neutral-800">Sourcing</li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Request Product Sourcing</h1>
        <p className="text-neutral-700">We connect you with vetted sellers and negotiate the best prices in {CC}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 space-y-8">
          <RequestForm cc={cc} />
          {/* 👇 Your requests list */}
          <MyRequests cc={cc} />
        </section>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">How it works</h2>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-neutral-700">
              <li>Tell us what you need (specs, budget, timeline).</li>
              <li>We verify sellers and collect quotes.</li>
              <li>You review offers, then accept the best one.</li>
            </ol>
            <hr className="my-5" />
            <h3 className="text-base font-medium mb-2">Live offers</h3>
            {/* Filters by ?request=<id> if present */}
            <OffersPanel cc={cc} />
          </div>
        </aside>
      </div>

      <p className="sr-only"><Link href={`/${cc}/find-for-me`}>Find for me</Link></p>
    </main>
  );
}