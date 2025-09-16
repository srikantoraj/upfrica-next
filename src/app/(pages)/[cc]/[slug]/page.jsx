// app/(pages)/[cc]/[slug]/page.jsx
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Header from "@/components/home/Header";
import Footer from "@/components/common/footer/Footer";
import ProductDetailSection from "@/components/ProductDetailSection/ProductDetailSection";
import RelatedProducts from "@/components/home/ProductList/RealtedProduct";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------------- constants ---------------- */
const FRONTEND_PREFIXES = new Set([
  "onboarding",
  "new-dashboard",
  "dashboard",
  "agent",
  "affiliate",
  "seller",
  "buyer",
  "login",
  "signup",
  "password",
]);

const REGION_TO_COUNTRY = { gh: "Ghana", ng: "Nigeria", uk: "United Kingdom" };

/* ---------------- helpers ---------------- */
// Build absolute origin for server-side fetches
function getOrigin() {
  const h = headers();
  const proto =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) return `${proto}://${host}`;
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function tryJson(url) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    redirect: "manual",
  });
  const body = await res.text();
  let data = null;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {}
  return { ok: res.ok, status: res.status, url, data };
}

function looksLikeProduct(d) {
  if (!d) return false;
  if (Array.isArray(d?.results) && d.results.length)
    return looksLikeProduct(d.results[0]);
  return !!(d.id || d.slug || d.title);
}

function toApiPath(p) {
  // Ensure paths we follow from JSON redirects go through /api/…
  if (!p) return "";
  if (p.startsWith("/api/")) return p;
  return `/api${p.startsWith("/") ? "" : "/"}${p}`;
}

/**
 * Resolver order (via unified /api proxy):
 *  1) if ?id=… → /api/products/:id
 *  2) /api/:cc/:slug  (DRF SEO route)
 *  + follow one JSON redirect if response contains { redirect: "/api/<...>" } or "/<...>"
 */
async function resolveProduct({ cc, slug, id }) {
  const origin = getOrigin();
  const tried = [];

  const candidates = [];
  if (id)
    candidates.push(
      `${origin}/api/products/${encodeURIComponent(id)}`
    );
  candidates.push(`${origin}/api/${cc}/${slug}`);

  for (const firstUrl of candidates) {
    let r = await tryJson(firstUrl);
    tried.push({ url: firstUrl, status: r.status, ok: r.ok });

    if (
      (r.status === 200 || r.status === 301 || r.status === 302) &&
      r.data?.redirect
    ) {
      const redirectedPath = toApiPath(r.data.redirect);
      const viaProxy = `${origin}${redirectedPath}`;
      const r2 = await tryJson(viaProxy);
      tried.push({ url: viaProxy, status: r2.status, ok: r2.ok });
      if (r2.ok && looksLikeProduct(r2.data)) {
        return {
          product: Array.isArray(r2.data?.results)
            ? r2.data.results[0]
            : r2.data,
          tried,
        };
      }
    }

    if (r.ok && looksLikeProduct(r.data)) {
      return {
        product: Array.isArray(r.data?.results) ? r.data.results[0] : r.data,
        tried,
      };
    }
  }

  return { product: null, tried };
}

/** Fetch related products (same JSON-redirect behavior) */
async function getRelatedProducts(cc, slug) {
  const origin = getOrigin();
  const first = `${origin}/api/${cc}/${slug}/related`;
  const r = await tryJson(first);

  if (
    (r.status === 200 || r.status === 301 || r.status === 302) &&
    r.data?.redirect
  ) {
    const redirectedPath = toApiPath(r.data.redirect); // e.g. "/api/gh/canonical-slug/related"
    const viaProxy = `${origin}${redirectedPath}`;
    const r2 = await tryJson(viaProxy);
    if (r2.ok && Array.isArray(r2.data?.results)) return r2.data.results;
  }

  if (r.ok && Array.isArray(r.data?.results)) return r.data.results;
  return [];
}

/* ---------------- SEO metadata ---------------- */
export async function generateMetadata({ params: { cc, slug }, searchParams }) {
  if (FRONTEND_PREFIXES.has(cc)) {
    return { title: "Upfrica", description: "Buy and sell on Upfrica." };
  }

  const forceId = searchParams?.id;
  const { product } = await resolveProduct({ cc, slug, id: forceId });
  if (!product) return notFound();

  const conditionSlug =
    (typeof product.condition === "string" && product.condition) ||
    product.condition?.slug ||
    "brand-new";

  const cityName = product.user?.town || product.seller_town || "";
  const citySlug = cityName ? cityName.toLowerCase().replace(/\s+/g, "-") : "accra";

  const countryForTitle =
    product.user?.country ||
    product.seller_country ||
    product.seller_country_code ||
    "Upfrica";

  const canonical =
    product.canonical_url ||
    `https://www.upfrica.com/${cc}/${product.slug}-${conditionSlug}-${citySlug}`;

  return {
    title: `${product.title} – ${countryForTitle}`,
    description:
      (typeof product.description === "string" &&
        product.description.replace(/<[^>]*>/g, "").slice(0, 180)) ||
      "",
    alternates: { canonical },
    openGraph: { title: product.title, url: canonical },
  };
}

/* ---------------- Page ---------------- */
export default async function Page({ params: { cc, slug }, searchParams }) {
  // let non-product areas fall through to their own routes
  if (FRONTEND_PREFIXES.has(cc)) redirect(`/${cc}/${slug}`);

  const forceId = searchParams?.id; // allow /gh/<slug>?id=4345
  const { product, tried } = await resolveProduct({ cc, slug, id: forceId });

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>❌ Couldn’t fetch product</h1>
        <p>
          cc=<code>{cc}</code>, slug=<code>{slug}</code>
          {forceId ? (
            <>
              , forced id=<code>{forceId}</code>
            </>
          ) : null}
        </p>
        <h3>Tried:</h3>
        <ol>
          {tried.map((t, i) => (
            <li key={i}>
              <code>{t.url}</code> → {t.status}
            </li>
          ))}
        </ol>
        <p>
          Tip: open <code>/{cc}/{slug}?id=4345</code> with a real ID. If that
          succeeds but <code>/api/{cc}/{slug}</code> is 404, the issue is in
          your DRF <em>ProductFullDetailBySlugView</em>.
        </p>
      </main>
    );
  }

  const relatedProducts = await getRelatedProducts(cc, slug);
  const regionLower = (cc || "").toLowerCase();
  const locationDisplay =
    product.seller_country ||
    product.user?.country ||
    REGION_TO_COUNTRY[regionLower] ||
    "Upfrica";

  return (
    <>
 
      <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
        {/* PDP */}
        <ProductDetailSection product={product} />

        {/* Related */}
        <section id="related" aria-labelledby="related-heading" className="mt-10">
          <h2 id="related-heading" className="sr-only">
            Related items
          </h2>
          <RelatedProducts
            relatedProducts={relatedProducts}
            productSlug={product.slug}
            productTitle={product.title}
            location={locationDisplay}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}