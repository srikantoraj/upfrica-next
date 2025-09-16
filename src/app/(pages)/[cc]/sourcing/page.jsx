// src/app/[cc]/sourcing/page.jsx
import Link from "next/link";
import RequestForm from "@/components/sourcing/RequestForm";
import OffersPanel from "@/components/sourcing/OffersPanel";
import MyRequests from "@/components/sourcing/MyRequests";

export const dynamic = "force-static";
export const revalidate = 3600;
export function generateStaticParams() {
  return [{ cc: "gh" }, { cc: "ng" }, { cc: "ke" }];
}

// (generateMetadata unchanged)

/* Small card that links to the public browse page */
function LiveRequestsCard({ cc }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Browse live requests
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        See what buyers are requesting right now and send a quote.
      </p>
      <Link
        href={`/${cc}/requests`}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-3 py-2 text-sm hover:opacity-90"
      >
        Browse live requests →
      </Link>
    </div>
  );
}

export default function SourcingPage({ params: { cc } }) {
  const CC = String(cc || "").toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-2">
          <li><Link href={`/${cc}`} className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-neutral-800 dark:text-neutral-200">Sourcing</li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
          Request Product Sourcing
        </h1>
        <p className="text-neutral-700 dark:text-neutral-300">
          We connect you with vetted sellers and negotiate the best prices in {CC}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 space-y-8">
          <RequestForm cc={cc} />
          <MyRequests cc={cc} />
        </section>

        <aside className="lg:col-span-2 space-y-6">
          <LiveRequestsCard cc={cc} />

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              How it works
            </h2>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <li>Tell us what you need (specs, budget, timeline).</li>
              <li>We verify sellers and collect quotes.</li>
              <li>You review offers, then accept the best one.</li>
            </ol>
            <hr className="my-5 border-neutral-200 dark:border-neutral-800" />
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Live offers
            </h3>
            <OffersPanel cc={cc} />
          </div>
        </aside>
      </div>

      <p className="sr-only">
        <Link href={`/${cc}/requests`}>Live sourcing requests</Link>
      </p>
    </main>
  );
}