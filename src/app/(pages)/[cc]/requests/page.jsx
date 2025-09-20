// src/app/(pages)/[cc]/requests/page.jsx
import Script from "next/script";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import PublicBrowseRequests from "@/components/sourcing/PublicBrowseRequests";

/** Mount react-hot-toast on the client without making this file a client component */
const ClientToaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false }
);

/* ---------- helpers to build absolute origins and API base ---------- */
function getSiteOrigin() {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_ORIGIN ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL || // e.g. myapp.vercel.app
    process.env.VERCEL_URL; // vercel preview/prod bare host

  if (env) {
    // allow both https://domain and bare domain
    return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env}`;
  }

  const h = headers();
  const rawProto = h.get("x-forwarded-proto") || "http";
  const rawHost = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = rawProto.split(",")[0].trim();
  const host = rawHost.split(",")[0].trim();
  return host ? `${proto}://${host}` : "http://127.0.0.1:3000";
}

function getServerApiBase() {
  const envBase =
    process.env.BACKEND_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.UP_API_BASE;

  if (envBase) return `${envBase.replace(/\/$/, "")}/api`;

  const origin = getSiteOrigin();
  // default to Next’s /api proxy if we don’t have a separate backend origin
  return `${origin}/api`;
}

/* ------------------------------ data fetch ------------------------------ */
async function fetchOpenCount(cc) {
  const API = getServerApiBase();
  const qs = new URLSearchParams({
    public: "1",
    status: "open",
    page_size: "1",
    deliver_to_country: String(cc).toLowerCase(),
  });

  const res = await fetch(`${API}/sourcing/requests/?${qs.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 }, // 5 min
  });

  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return typeof data?.count === "number" ? data.count : null;
}
/* ------------------------------ metadata ------------------------------ */
export async function generateMetadata({ params }) {
  const cc = String(params?.cc || "gh").toUpperCase();
  const count = await fetchOpenCount(cc);
  const title = `Live Sourcing Requests in ${cc}${
    typeof count === "number" ? ` — ${count} open` : ""
  }`;
  const description = `Browse live sourcing requests in ${cc}. Sign in to send a quote.`;

  const origin = getSiteOrigin();
  const path = `/${cc.toLowerCase()}/requests`;
  const url = `${origin}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* Static revalidation for the page shell itself (list is client-rendered). */
export const revalidate = 300; // 5 minutes

/* ------------------------------- page ---------------------------------- */
export default async function PublicRequestsPage({ params }) {
  const cc = String(params?.cc || "gh").toLowerCase();
  const initialCount = await fetchOpenCount(cc);

  // JSON-LD: Collection Page + ItemList shell (count only; items are client-side)
  const origin = getSiteOrigin();
  const pageUrl = `${origin}/${cc}/requests`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Live Sourcing Requests in ${cc.toUpperCase()}`,
    url: pageUrl,
    hasPart: {
      "@type": "ItemList",
      name: "Open Sourcing Requests",
      numberOfItems: typeof initialCount === "number" ? initialCount : undefined,
      itemListOrder: "http://schema.org/ItemListOrderDescending",
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Toast host (client only) */}
      <ClientToaster
        position="top-center"
        containerClassName="!top-16"
        toastOptions={{
          className:
            "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 " +
            "border border-neutral-200 dark:border-neutral-700 shadow",
        }}
      />

      <header className="mb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Live Sourcing Requests
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Browse what buyers are looking for. Sign in to send a quote.
        </p>
      </header>

      {/* SEO structured data */}
      <Script id="ld-requests" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* Client component renders the list; receives SSR-prefetched count */}
      <PublicBrowseRequests cc={cc} initialCount={initialCount} />
    </main>
  );
}