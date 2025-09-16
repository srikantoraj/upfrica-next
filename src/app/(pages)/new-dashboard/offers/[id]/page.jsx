// src/app/(pages)/new-dashboard/offers/[id]/page.jsx
import dynamicImport from "next/dynamic"; // ⬅️ renamed
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

/** Mount react-hot-toast on the client without making this file a client component */
const ClientToaster = dynamicImport(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false }
);

// Lazy-load the client editor (bottom sheet UI lives here)
const OfferEditSheet = dynamicImport(
  () => import("@/components/new-dashboard/sourcing/OfferEditSheet"),
  { ssr: false }
);

/* ---------- helpers to build absolute origins and API base ---------- */
function getSiteOrigin() {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_ORIGIN ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (env) {
    return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env}`;
  }
  const h = headers();
  const proto = (h.get("x-forwarded-proto") || "http").split(",")[0].trim();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
  return host ? `${proto}://${host}` : "http://127.0.0.1:3000";
}

function getServerApiBase() {
  const envBase =
    process.env.BACKEND_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.UP_API_BASE;
  if (envBase) return `${envBase.replace(/\/$/, "")}/api`;
  return `${getSiteOrigin()}/api`;
}

/* ------------------------------ data fetch ------------------------------ */
async function fetchOfferById(id) {
  const API = getServerApiBase();
  const h = headers();
  const res = await fetch(`${API}/sourcing/offers/${encodeURIComponent(id)}/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: h.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    const origin = getSiteOrigin();
    const nextUrl = `${origin}/new-dashboard/offers/${encodeURIComponent(id)}`;
    redirect(`/login?next=${encodeURIComponent(nextUrl)}`);
  }

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load offer ${id}`);

  return res.json().catch(() => null);
}

/* ------------------------------ metadata ------------------------------ */
export async function generateMetadata({ params }) {
  const id = params?.id;
  let title = `Offer #${id}`;
  try {
    const offer = await fetchOfferById(id);
    const reqId = offer?.request_id ?? offer?.request ?? "";
    title = offer?.status
      ? `Edit Offer #${id} — ${String(offer.status).toUpperCase()}`
      : `Edit Offer #${id}`;
    return {
      title,
      description: reqId ? `Edit your offer for request ${reqId}.` : "Edit your offer.",
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title,
      description: "Edit your offer.",
      robots: { index: false, follow: false },
    };
  }
}

/* Avoid caching; this page reflects current offer values and permissions */
export const dynamic = "force-dynamic";

/* -------------------------------- page ---------------------------------- */
export default async function OfferEditPage({ params }) {
  const id = params?.id;
  const offer = await fetchOfferById(id);
  if (!offer) notFound();

  const normalized = {
    id: offer.id,
    request_id: offer.request_id ?? offer.request ?? null,
    currency: (offer.currency || "GHS").toUpperCase(),
    eta_days: offer.eta_days ?? 2,
    quoted_item_cost: offer.quoted_item_cost ?? 0,
    agent_fee: offer.agent_fee ?? 0,
    delivery_fee: offer.delivery_fee ?? 0,
    notes: offer.notes ?? "",
    status: offer.status,
    submitter_id: offer.submitter_id ?? null,
    agent_id: offer.agent_id ?? null,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
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
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Edit offer</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Update the price, fees, ETA or notes. Changes apply to this offer only.
        </p>
      </header>

      {/* Fallback editor view; OfferEditSheet should be a client component that renders a bottom sheet on mobile */}
      <OfferEditSheet offer={normalized} />
    </main>
  );
}