import Link from "next/link";
import { Suspense } from "react";
import { headers, cookies } from "next/headers";
import SearchFacets from "@/components/search/SearchFacets";
import SafeImage from "@/components/common/SafeImage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------------- utils ---------------- */
const qp = (obj = {}) =>
  Object.entries(obj)
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && !v.length)
    )
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]));

const buildQS = (params) => {
  const s = new URLSearchParams(qp(params)).toString();
  return s ? `?${s}` : "";
};

function absoluteUrl(path) {
  const h = headers();
  const proto =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}${path}`;
}

/* ---------------- data fetch (server) ---------------- */
async function fetchSearch({ cc, searchParams, cookieDefaults }) {
  // Merge defaults for cross-border UX
  const merged = {
    country: cc,
    // respect explicit include_global=1; otherwise default deliverable=1
    ...(searchParams.include_global === "1"
      ? {}
      : { deliverable: searchParams.deliverable ?? "1" }),
    // if we know a city, pass it to improve ETA/filtering
    ...(cookieDefaults.deliver_to ? { deliver_to: cookieDefaults.deliver_to } : {}),
    ...searchParams,
  };

  const qs = buildQS(merged);
  const url = absoluteUrl(`/api/products/search${qs}`);

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!res.ok) {
    try {
      console.error("Search fetch error", res.status, await res.text());
    } catch {}
    return { results: [], facets: {}, error: `HTTP_${res.status}` };
  }
  return res.json();
}

/* ---------------- UI bits ---------------- */
function pickImage(p) {
  return (
    p.thumbnail ||
    (Array.isArray(p.image_objects) && p.image_objects[0]?.url) ||
    p.image_url ||
    (Array.isArray(p.product_images) && p.product_images[0]?.url) ||
    "/placeholder.png"
  );
}

function ResultCard({ p }) {
  const href = p.frontend_url || `/${p.country || "gh"}/${p.slug || "#"}`;
  const img = pickImage(p);
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-[var(--line)] overflow-hidden hover:shadow-md bg-white"
    >
      <div className="aspect-square bg-[var(--alt-surface)] overflow-hidden relative">
        <SafeImage
          src={img}
          alt={p.title || "Product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
          quality={75}
        />
      </div>
      <div className="p-3">
        <div className="text-sm line-clamp-2">{p.title}</div>
        <div className="mt-1 font-semibold">
          {p.price_display || p.price_text || p.price || "—"}
        </div>
        {p.brand && (
          <div className="text-xs text-[var(--ink-2)] mt-0.5">{p.brand}</div>
        )}
      </div>
    </Link>
  );
}

function Toolbar({ cc, q, count }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="text-sm">
        <span className="font-semibold">{count ?? 0}</span> results
        {q ? (
          <>
            {" "}
            for <span className="font-semibold">“{q}”</span>
          </>
        ) : null}
      </div>

      <form className="flex items-center gap-2" action={`/${cc}/search`}>
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Refine search…"
          className="h-9 w-56 rounded-lg border border-[var(--line)] px-3 text-sm"
        />
        <select
          name="sort"
          className="h-9 rounded-lg border border-[var(--line)] px-2 text-sm"
          defaultValue="relevance"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="newest">Newest</option>
          <option value="fastest">Fastest delivery</option>
        </select>
        <button className="h-9 px-3 rounded-lg bg-[var(--brand-600)] text-white text-sm">
          Apply
        </button>
      </form>
    </div>
  );
}

function Empty({ cc, q }) {
  return (
    <div className="text-center py-16 border border-dashed rounded-2xl">
      <div className="text-2xl">No results found</div>
      {q ? (
        <div className="text-[var(--ink-2)] mt-1">We couldn’t find “{q}”.</div>
      ) : null}
      <div className="mt-4 flex items-center justify-center gap-2">
        <Link
          href={`/${cc}/sourcing?intent=${encodeURIComponent(q || "")}`}
          className="px-4 py-2 rounded-lg bg-[var(--brand-600)] text-white text-sm"
        >
          🔎 Find it for me
        </Link>
        <Link
          href={`/${cc}/search?sort=trending`}
          className="px-4 py-2 rounded-lg border text-sm"
        >
          Browse trending
        </Link>
      </div>
      <p className="text-xs text-[var(--ink-2)] mt-3">
        A local sourcing agent will search nearby markets and get back to you.
      </p>
    </div>
  );
}

/* ---------------- page ---------------- */
export default async function SearchPage({ params, searchParams }) {
  const cc = params?.cc || "gh";

  // Cookie-defaults for discovery alignment
  const ck = cookies();
  const deliverCC = (ck.get("deliver_cc")?.value || cc).toLowerCase();
  const deliverCity =
    ck.get(`deliver_to_${deliverCC}`)?.value ||
    ck.get("deliver_to")?.value ||
    "";

  const data = await fetchSearch({
    cc,
    searchParams,
    cookieDefaults: { deliver_to: deliverCity },
  });

  const { q = "" } = searchParams || {};
  const results = data?.results || [];
  const facets = data?.facets || {};

  return (
    <main className="mx-auto max-w-7xl px-4 py-4">
      <Toolbar cc={cc} q={q} count={results.length} />

      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4">
        <aside className="md:sticky md:top-[64px] self-start">
          <Suspense
            fallback={<div className="p-3 border rounded-xl">Loading filters…</div>}
          >
            <SearchFacets cc={cc} facets={facets} />
          </Suspense>
        </aside>

        <section>
          {results.length === 0 ? (
            <Empty cc={cc} q={q} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.map((p) => (
                <ResultCard key={p.id || p.slug} p={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}