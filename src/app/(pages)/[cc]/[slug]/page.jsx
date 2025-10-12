// // app/(pages)/[cc]/[slug]/page.jsx
// import { notFound, redirect } from "next/navigation";
// import { headers } from "next/headers";
// import Footer from "@/components/common/footer/Footer";
// import ProductDetailSection from "@/components/ProductDetailSection/ProductDetailSection";
// import RelatedProducts from "@/components/home/ProductList/RealtedProduct";
// import ClientTrackView from "./ClientTrackView";
// import { getPdpSignals } from "@/lib/pdp-signals-server";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /* ---------------- constants ---------------- */
// const FRONTEND_PREFIXES = new Set([
//   "onboarding",
//   "new-dashboard",
//   "dashboard",
//   "agent",
//   "affiliate",
//   "seller",
//   "buyer",
//   "login",
//   "signup",
//   "password",
// ]);

// const REGION_TO_COUNTRY = { gh: "Ghana", ng: "Nigeria", uk: "United Kingdom" };

// /* ---------------- helpers ---------------- */
// // Build absolute origin for server-side fetches
// function getOrigin() {
//   const h = headers();
//   const proto =
//     h.get("x-forwarded-proto") ||
//     (process.env.NODE_ENV === "production" ? "https" : "http");
//   const host = h.get("x-forwarded-host") || h.get("host");
//   if (host) return `${proto}://${host}`;
//   if (process.env.NEXT_PUBLIC_SITE_URL)
//     return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//   return "http://localhost:3000";
// }

// async function tryJson(url) {
//   const res = await fetch(url, {
//     cache: "no-store",
//     headers: {
//       Accept: "application/json",
//       "X-Requested-With": "XMLHttpRequest",
//     },
//     redirect: "manual",
//   });
//   const body = await res.text();
//   let data = null;
//   try {
//     data = body ? JSON.parse(body) : null;
//   } catch {}
//   return { ok: res.ok, status: res.status, url, data };
// }

// function looksLikeProduct(d) {
//   if (!d) return false;
//   if (Array.isArray(d?.results) && d.results.length)
//     return looksLikeProduct(d.results[0]);
//   return !!(d.id || d.slug || d.title);
// }

// function toApiPath(p) {
//   if (!p) return "";
//   if (p.startsWith("/api/")) return p;
//   return `/api${p.startsWith("/") ? "" : "/"}${p}`;
// }

// /** Normalize signals to the UI shape regardless of backend keys */
// function normalizeSignals(src) {
//   const pickNum = (...keys) => {
//     for (const k of keys) {
//       const v = src?.[k];
//       if (v != null && Number.isFinite(Number(v))) return Number(v);
//     }
//     return 0;
//   };
//   return {
//     views24h: pickNum("views24h", "views_24h", "views_last_24h", "views"),
//     baskets24h: pickNum("baskets24h", "baskets_24h", "added_to_basket_24h", "baskets"),
//     wishlistsTotal: pickNum("wishlistsTotal", "wishlists_total", "wishlist_total", "wishlists"),
//   };
// }

// /** Get signals with multiple fallbacks: Redis helper → API by ID → API by slug */
// async function getSignalsSSR(cc, slug, productId) {
//   // 1) Redis/server util
//   try {
//     const s = await getPdpSignals(productId);
//     if (s && Object.keys(s).length) return normalizeSignals(s);
//   } catch {}

//   const origin = getOrigin();

//   // Helper that follows one JSON redirect
//   const fetchMaybeRedirect = async (firstUrl) => {
//     const r = await tryJson(firstUrl);
//     if (
//       (r.status === 200 || r.status === 301 || r.status === 302) &&
//       r.data?.redirect
//     ) {
//       const redirectedPath = toApiPath(r.data.redirect);
//       const viaProxy = `${origin}${redirectedPath}`;
//       const r2 = await tryJson(viaProxy);
//       if (r2.ok && r2.data) return r2.data;
//     }
//     if (r.ok && r.data) return r.data;
//     return null;
//   };

//   // 2) API by product ID
//   const byId = await fetchMaybeRedirect(`${origin}/api/products/${encodeURIComponent(productId)}/signals`);
//   if (byId) return normalizeSignals(byId);

//   // 3) API by slug/market
//   const bySlug = await fetchMaybeRedirect(`${origin}/api/${cc}/${slug}/signals`);
//   if (bySlug) return normalizeSignals(bySlug);

//   // Default
//   return { views24h: 0, baskets24h: 0, wishlistsTotal: 0 };
// }

// /**
//  * Resolver order (via unified /api proxy):
//  *  1) if ?id=… → /api/products/:id
//  *  2) /api/:cc/:slug  (DRF SEO route)
//  *  + follow one JSON redirect if response contains { redirect: "/api/<...>" } or "/<...>"
//  */
// async function resolveProduct({ cc, slug, id }) {
//   const origin = getOrigin();
//   const tried = [];

//   const candidates = [];
//   if (id) candidates.push(`${origin}/api/products/${encodeURIComponent(id)}`);
//   candidates.push(`${origin}/api/${cc}/${slug}`);

//   for (const firstUrl of candidates) {
//     let r = await tryJson(firstUrl);
//     tried.push({ url: firstUrl, status: r.status, ok: r.ok });

//     if (
//       (r.status === 200 || r.status === 301 || r.status === 302) &&
//       r.data?.redirect
//     ) {
//       const redirectedPath = toApiPath(r.data.redirect);
//       const viaProxy = `${origin}${redirectedPath}`;
//       const r2 = await tryJson(viaProxy);
//       tried.push({ url: viaProxy, status: r2.status, ok: r2.ok });
//       if (r2.ok && looksLikeProduct(r2.data)) {
//         return {
//           product: Array.isArray(r2.data?.results)
//             ? r2.data.results[0]
//             : r2.data,
//           tried,
//         };
//       }
//     }

//     if (r.ok && looksLikeProduct(r.data)) {
//       return {
//         product: Array.isArray(r.data?.results) ? r.data.results[0] : r.data,
//         tried,
//       };
//     }
//   }

//   return { product: null, tried };
// }

// /** Fetch related products (same JSON-redirect behavior) */
// async function getRelatedProducts(cc, slug) {
//   const origin = getOrigin();
//   const first = `${origin}/api/${cc}/${slug}/related`;
//   const r = await tryJson(first);

//   if (
//     (r.status === 200 || r.status === 301 || r.status === 302) &&
//     r.data?.redirect
//   ) {
//     const redirectedPath = toApiPath(r.data.redirect);
//     const viaProxy = `${origin}${redirectedPath}`;
//     const r2 = await tryJson(viaProxy);
//     if (r2.ok && Array.isArray(r2.data?.results)) return r2.data.results;
//   }

//   if (r.ok && Array.isArray(r.data?.results)) return r.data.results;
//   return [];
// }

// /* ---------------- SEO metadata ---------------- */
// export async function generateMetadata({ params: { cc, slug }, searchParams }) {
//   if (FRONTEND_PREFIXES.has(cc)) {
//     return { title: "Upfrica", description: "Buy and sell on Upfrica." };
//   }

//   const forceId = searchParams?.id;
//   const { product } = await resolveProduct({ cc, slug, id: forceId });
//   if (!product) return notFound();

//   const conditionSlug =
//     (typeof product.condition === "string" && product.condition) ||
//     product.condition?.slug ||
//     "brand-new";

//   const cityName = product.user?.town || product.seller_town || "";
//   const citySlug = cityName ? cityName.toLowerCase().replace(/\s+/g, "-") : "accra";

//   const countryForTitle =
//     product.user?.country ||
//     product.seller_country ||
//     product.seller_country_code ||
//     "Upfrica";

//   const canonical =
//     product.canonical_url ||
//     `https://www.upfrica.com/${cc}/${product.slug}-${conditionSlug}-${citySlug}`;

//   return {
//     title: `${product.title} – ${countryForTitle}`,
//     description:
//       (typeof product.description === "string" &&
//         product.description.replace(/<[^>]*>/g, "").slice(0, 180)) || "",
//     alternates: { canonical },
//     openGraph: { title: product.title, url: canonical },
//   };
// }

// /* ---------------- Page ---------------- */
// export default async function Page({ params: { cc, slug }, searchParams }) {
//   // let non-product areas fall through to their own routes
//   if (FRONTEND_PREFIXES.has(cc)) redirect(`/${cc}/${slug}`);

//   const forceId = searchParams?.id; // allow /gh/<slug>?id=4345
//   const { product, tried } = await resolveProduct({ cc, slug, id: forceId });

//   if (!product) {
//     return (
//       <main style={{ padding: 24 }}>
//         <h1>❌ Couldn’t fetch product</h1>
//         <p>
//           cc=<code>{cc}</code>, slug=<code>{slug}</code>
//           {forceId ? (
//             <>
//               , forced id=<code>{forceId}</code>
//             </>
//           ) : null}
//         </p>
//         <h3>Tried:</h3>
//         <ol>
//           {tried.map((t, i) => (
//             <li key={i}>
//               <code>{t.url}</code> → {t.status}
//             </li>
//           ))}
//         </ol>
//         <p>
//           Tip: open <code>/{cc}/{slug}?id=4345</code> with a real ID. If that
//           succeeds but <code>/api/{cc}/{slug}</code> is 404, the issue is in
//           your DRF <em>ProductFullDetailBySlugView</em>.
//         </p>
//       </main>
//     );
//   }

//   // PDP signals (views, baskets, wishlists) with robust fallbacks
//   let signals = await getSignalsSSR(cc, slug, product.id);

//   const relatedProducts = await getRelatedProducts(cc, slug);
//   const regionLower = (cc || "").toLowerCase();
//   const locationDisplay =
//     product.seller_country ||
//     product.user?.country ||
//     REGION_TO_COUNTRY[regionLower] ||
//     "Upfrica";

//   return (
//     <>
//       <main className="w-full max-w-[1380px] mx-auto py-0 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
//         {/* PDP */}
//         <ProductDetailSection product={product} signals={signals} />

//         {/* Related */}
//         <section id="related" aria-labelledby="related-heading" className="mt-10">
//           <h2 id="related-heading" className="sr-only">
//             Related items
//           </h2>
//           <RelatedProducts
//             relatedProducts={relatedProducts}
//             productSlug={product.slug}
//             productTitle={product.title}
//             location={locationDisplay}
//           />
//         </section>
//       </main>

//       {/* Client-side, one-per-session view ping */}
//       <ClientTrackView productId={product.id} slug={product.slug} />

//       <Footer />
//     </>
//   );
// }



// app/(pages)/[cc]/[slug]/page.jsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Footer from "@/components/common/footer/Footer";
import ProductDetailSection from "@/components/ProductDetailSection/ProductDetailSection";
import RelatedProducts from "@/components/home/ProductList/RealtedProduct";
import ClientTrackView from "./ClientTrackView";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

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

const REGION_TO_COUNTRY = { gh: "Ghana", ng: "Nigeria", uk: "United Kingdom", gb: "United Kingdom" };

/* ---------------- helpers ---------------- */
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

// fetch JSON with cookies forwarded; expose status + Location + parsed body
async function tryJson(url) {
  const h = headers();
  const cookie = h.get("cookie") || "";
  const auth = h.get("authorization") || "";

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-SSR-NoRedirect": "1", // hint to backend to serialize instead of redirect
      ...(cookie ? { cookie } : {}),
      ...(auth ? { authorization: auth } : {}),
    },
    redirect: "manual",
  });

  const status = res.status;
  const location = res.headers.get("location") || res.headers.get("Location") || null;

  let data = null;
  let text = "";
  try { text = await res.text(); } catch { }
  if (text) {
    try { data = JSON.parse(text); } catch { }
  }

  return { ok: res.ok, status, url, data, location };
}

// Always coerce redirects back to the slug endpoint (never to ID)
function coerceToSlugApi(origin, cc, slug) {
  return `${origin}/api/${cc}/${slug}?noredirect=1`;
}

/* ---------------- slug-only resolvers ---------------- */
async function resolveProduct({ cc, slug }) {
  const origin = getOrigin();
  const tried = [];

  const firstUrl = coerceToSlugApi(origin, cc, slug);
  const r = await tryJson(firstUrl);
  tried.push({ url: firstUrl, status: r.status, ok: r.ok });

  // If backend returned a redirect (JSON or HTTP), coerce right back to slug API
  if ((r.status === 301 || r.status === 302) || (r.data && r.data.redirect)) {
    const via = coerceToSlugApi(origin, cc, slug);
    if (via !== firstUrl) {
      const r2 = await tryJson(via);
      tried.push({ url: via, status: r2.status, ok: r2.ok });
      if (r2.ok && r2.data) {
        const data = Array.isArray(r2.data?.results) ? r2.data.results[0] : r2.data;
        if (data && (data.id || data.slug)) return { product: data, tried };
      }
    }
  }

  if (r.ok && r.data) {
    const data = Array.isArray(r.data?.results) ? r.data.results[0] : r.data;
    if (data && (data.id || data.slug)) return { product: data, tried };
  }

  return { product: null, tried };
}

function normalizeSignals(src) {
  const pickNum = (...keys) => {
    for (const k of keys) {
      const v = src?.[k];
      if (v != null && Number.isFinite(Number(v))) return Number(v);
    }
    return 0;
  };
  return {
    views24h: pickNum("views24h", "views_24h", "views_last_24h", "views"),
    baskets24h: pickNum("baskets24h", "baskets_24h", "added_to_basket_24h", "baskets"),
    wishlistsTotal: pickNum("wishlistsTotal", "wishlists_total", "wishlist_total", "wishlists"),
  };
}

async function getSignalsSSR(cc, slug) {
  const origin = getOrigin();
  const url = `${origin}/api/${cc}/${slug}/signals?noredirect=1`;
  const r = await tryJson(url);
  if (r.ok && r.data) return normalizeSignals(r.data);
  return { views24h: 0, baskets24h: 0, wishlistsTotal: 0 };
}

async function getRelatedProducts(cc, slug) {
  const origin = getOrigin();
  const url = `${origin}/api/${cc}/${slug}/related?noredirect=1`;
  const r = await tryJson(url);
  if (r.ok && Array.isArray(r.data?.results)) return r.data.results;
  return [];
}

/* ---------------- metadata ---------------- */
export async function generateMetadata({ params: { cc, slug } }) {
  if (FRONTEND_PREFIXES.has(cc)) {
    return { title: "Upfrica", description: "Buy and sell on Upfrica." };
  }
  const { product } = await resolveProduct({ cc, slug });
  if (!product) {
    return {
      title: "Product • Upfrica",
      description: "Browse products on Upfrica.",
      openGraph: { title: "Product • Upfrica" },
    };
  }

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
    REGION_TO_COUNTRY[cc.toLowerCase()] ||
    "Upfrica";

  const canonical =
    product.canonical_url ||
    `https://www.upfrica.com/${cc}/${product.slug}-${conditionSlug}-${citySlug}`;

  const desc =
    (typeof product.description === "string"
      ? product.description.replace(/<[^>]*>/g, "").slice(0, 180)
      : "") || "";

  return {
    title: `${product.title} – ${countryForTitle}`,
    description: desc,
    alternates: { canonical },
    openGraph: { title: product.title, url: canonical, description: desc },
    twitter: { card: "summary_large_image", title: product.title, description: desc },
  };
}

/* ---------------- page ---------------- */
export default async function Page({ params: { cc, slug } }) {
  // let non-product areas fall through to their own routes
  if (FRONTEND_PREFIXES.has(cc)) redirect(`/${cc}/${slug}`);

  const { product, tried } = await resolveProduct({ cc, slug });

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>❌ Couldn’t fetch product (slug-only)</h1>
        <p>
          cc=<code>{cc}</code>, slug=<code>{slug}</code>
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
          Ensure the backend slug endpoint <code>/api/{cc}/{slug}</code> is publicly
          readable (or that cookies are forwarded), and that your slug exists or maps
          via history/legacy. If your API still issues redirects, it should honor{" "}
          <code>?noredirect=1</code> / <code>X-SSR-NoRedirect: 1</code> to return JSON.
        </p>
      </main>
    );
  }

  const signals = await getSignalsSSR(cc, slug);
  const relatedProducts = await getRelatedProducts(cc, slug);

  const regionLower = (cc || "").toLowerCase();
  const locationDisplay =
    product.seller_country ||
    product.user?.country ||
    REGION_TO_COUNTRY[regionLower] ||
    "Upfrica";

  return (
    <>
      <main className="w-full max-w-[1380px] mx-auto py-0 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
        <ProductDetailSection product={product} signals={signals} />

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

      <ClientTrackView productId={product.id} slug={product.slug} />
      <Footer />
    </>
  );
}
