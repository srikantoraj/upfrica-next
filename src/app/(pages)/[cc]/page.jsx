

// // app/(pages)/[cc]/page.jsx
// import ProductRail from "@/components/home/ProductRail";
// import HeroCurved from "@/components/home/HeroCurved";
// import HeroCarousel from "@/components/home/HeroCarousel";
// import PromoTiles from "@/components/home/PromoTiles";
// import ValuePills from "@/components/home/ValuePills";
// import NavCategories from "@/components/home/NavCategories";

// import { fixImageUrl as fixDisplayUrl } from "@/lib/image";
// import { SITE_BASE_URL, API_BASE } from "@/app/constants";

// export const revalidate = 300;
// export const dynamic = "auto";

// /* ---------- country helpers (inline; no other deps) ---------- */
// const COUNTRY_ALIAS = { uk: "gb" };
// const normCc = (cc) =>
//   (COUNTRY_ALIAS?.[cc?.toLowerCase?.()] ?? cc ?? "gh").toLowerCase();

// const isoToSlug = (iso) =>
//   (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
// const slugToIso = (slug) =>
//   (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());

// /* ---------- minimal country meta ---------- */
// const COUNTRY_META = {
//   gh: {
//     name: "Ghana",
//     lcpHeadline: "Shop Ghana — Fast Delivery, MoMo & BNPL",
//     lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection",
//     cities: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"],
//   },
//   ng: {
//     name: "Nigeria",
//     lcpHeadline: "Shop Nigeria — Fast Delivery & Pay on Delivery",
//     lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection",
//     cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"],
//   },
//   uk: {
//     name: "United Kingdom",
//     lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
//     lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection",
//     cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
//   },
//   gb: {
//     name: "United Kingdom",
//     lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
//     lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection",
//     cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
//   },
// };

// /* ---------- static params / metadata ---------- */
// export async function generateStaticParams() {
//   try {
//     const res = await fetch(`${API_BASE}/i18n/init/`, { next: { revalidate: 3600 } });
//     if (!res.ok) throw new Error("init failed");
//     const data = await res.json();
//     const supported = (data?.supported?.countries || [])
//       .map((c) => isoToSlug(c.code))
//       .filter(Boolean);
//     const uniq = Array.from(new Set(supported));
//     return (uniq.length ? uniq : ["gh", "ng", "uk"]).map((cc) => ({ cc }));
//   } catch {
//     return ["gh", "ng", "uk"].map((cc) => ({ cc }));
//   }
// }

// export async function generateMetadata({ params }) {
//   const ccSlug = (params?.cc || "gh").toLowerCase();
//   const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

//   let countryName = meta.name;
//   try {
//     const res = await fetch(`${API_BASE}/i18n/init/?country=${encodeURIComponent(ccSlug)}`, {
//       next: { revalidate: 3600 },
//     });
//     if (res.ok) {
//       const j = await res.json();
//       const iso = slugToIso(ccSlug);
//       const hit = (j?.supported?.countries || []).find(
//         (c) => String(c.code).toUpperCase() === iso
//       );
//       if (hit?.name) countryName = hit.name;
//     }
//   } catch { }

//   const baseUrl = SITE_BASE_URL || "https://www.upfrica.com";
//   const url = `${baseUrl}/${ccSlug}`;

//   return {
//     title: `${countryName} • Upfrica Marketplace — Fast Delivery, Local Sellers`,
//     description: meta.lcpTagline,
//     alternates: {
//       canonical: url,
//       languages: {
//         "en-GH": `${baseUrl}/gh`,
//         "en-NG": `${baseUrl}/ng`,
//         "en-GB": `${baseUrl}/uk`,
//         "x-default": `${baseUrl}/`,
//       },
//     },
//     openGraph: {
//       title: `Upfrica ${countryName}`,
//       description: meta.lcpTagline,
//       url,
//       siteName: "Upfrica",
//       type: "website",
//       images: [{ url: `${baseUrl}/og/upfrica-${ccSlug}.png`, width: 1200, height: 630, alt: `Upfrica ${countryName}` }],
//       locale: "en",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `Upfrica ${countryName}`,
//       description: meta.lcpTagline,
//       images: [`${baseUrl}/og/upfrica-${ccSlug}.png`],
//     },
//   };
// }

// /* ---------- CMS helpers (prefix: cms*) ---------- */
// const CMS_HERO_FALLBACK = {
//   gh: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2400&auto=format&fit=crop",
//   ng: "https://images.unsplash.com/photo-1590648938591-6fc4f1a6391c?q=80&w=2400&auto=format&fit=crop",
//   uk: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
//   gb: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
// };
// const cmsHeroImage = (cc) => CMS_HERO_FALLBACK[cc] || CMS_HERO_FALLBACK.gh;

// function cmsPickImage(section, name, fallback) {
//   if (!section) return fallback;
//   if (section.primary_image?.url) return section.primary_image.url;
//   const byName = section.images_by_name || {};
//   if (byName[name]) return byName[name];
//   return section.images?.[0]?.url || fallback;
// }
// function cmsCardImage(card, section, fallback) {
//   if (card?.image) return card.image;
//   if (card?.image_name) {
//     const byName = section?.images_by_name || {};
//     if (byName[card.image_name]) return byName[card.image_name];
//     const hit = section?.images?.find?.((i) => i.name === card.image_name);
//     if (hit?.url) return hit.url;
//   }
//   return fallback;
// }
// function cmsHeroCurved(section, ccSlug, meta) {
//   const cfg = section?.config || {};
//   const cityList =
//     Array.isArray(cfg.cities) && cfg.cities.length
//       ? cfg.cities
//       : COUNTRY_META[ccSlug]?.cities || ["Your City"];
//   const city = cityList[0];

//   const normalizeHref = (href) => {
//     if (!href || typeof href !== "string") return href;
//     if (!href.startsWith("/")) return href;
//     return href.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${ccSlug}`);
//   };

//   const defaults = [
//     { title: "Today’s Deals", href: `/${ccSlug}/deals` },
//     { title: `Same-Day in ${city}`, href: `/${ccSlug}/search?delivery=same-day` },
//     { title: "Wholesale & Bulk", href: `/${ccSlug}/wholesale` },
//   ];

//   const rawCards = Array.isArray(cfg.mini_cards) ? cfg.mini_cards.slice(0, 3) : [];
//   const miniCards = Array.from({ length: 3 }).map((_, i) => {
//     const raw = rawCards[i] || {};
//     const fallbackImageName = `hero_card_${i}`;
//     const image = cmsCardImage(
//       { image: raw.image, image_name: raw.image_name || fallbackImageName },
//       section,
//       null
//     );
//     return {
//       title: raw.title || defaults[i].title,
//       href: normalizeHref(raw.href || defaults[i].href),
//       ...(image ? { image } : {}),
//     };
//   });

//   const mainImage =
//     (cfg.image_slot &&
//       (section?.images_by_name?.[cfg.image_slot] ||
//         section?.images?.find?.((i) => i.name === cfg.image_slot)?.url)) ||
//     cmsPickImage(section, "hero", cmsHeroImage(ccSlug));

//   const primaryCtaRaw =
//     cfg.primaryCta || cfg.primary_cta || { label: "Browse Today’s Deals", href: `/${ccSlug}/deals` };
//   const secondaryCtaRaw =
//     cfg.secondaryCta || cfg.secondary_cta || { label: "Sell on Upfrica", href: `/${ccSlug}/sell` };

//   const primaryCta = { ...primaryCtaRaw, href: normalizeHref(primaryCtaRaw.href) };
//   const secondaryCta = { ...secondaryCtaRaw, href: normalizeHref(secondaryCtaRaw.href) };

//   return {
//     cc: ccSlug,
//     headline: cfg.headline || meta.lcpHeadline,
//     tagline: cfg.tagline || meta.lcpTagline,
//     image: mainImage,
//     alt: cfg.alt || `Upfrica ${meta.name} marketplace deals banner`,
//     primaryCta,
//     secondaryCta,
//     miniCards,
//   };
// }
// function cmsBanners(section, ccSlug) {
//   if (!section) return [];
//   const cfg = section.config || {};
//   const imgs = section.images || [];
//   return imgs.map((img, i) => ({
//     title: cfg[`title_${i + 1}`] || section.title || "Featured",
//     sub: cfg[`sub_${i + 1}`] || section.subtitle || "",
//     href: cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
//     img: img.url,
//   }));
// }
// function cmsPromos(section, ccSlug) {
//   if (!section) return [];
//   const cfg = section.config || {};
//   const imgs = section.images || [];
//   return imgs.slice(0, 3).map((img, i) => ({
//     title: (cfg.promos && cfg.promos[i]?.title) || cfg[`title_${i + 1}`] || "Promo",
//     href: (cfg.promos && cfg.promos[i]?.href) || cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
//     image: img.url,
//   }));
// }

// /* ---------- product normalization (prefix: prod*) ---------- */
// const prodURLish = (s) =>
//   typeof s === "string" &&
//   !!s.trim() &&
//   (/^https?:\/\//i.test(s) || s.startsWith("/") || /^data:image\//i.test(s));
// const prodIsNotImageExt = (s = "") =>
//   /\.(mp4|mov|m4v|webm|avi|mkv|mp3|wav|m4a|aac|ogg|flac|pdf|zip|rar|7z|tar|gz|docx?|xlsx?|pptx?)($|[?#])/i.test(s);
// const prodIsPlaceholder = (s = "") =>
//   /(placeholder|no[-_ ]?image|image[-_ ]?not[-_ ]?available|spacer|blank|dummy|default.*\.(png|jpg|jpeg|gif|svg)|\/x\.svg)($|[?#])/i.test(
//     s
//   );

// function prodPickImage(raw) {
//   if (!raw || typeof raw !== "object") return null;
//   const candidates = [];
//   [raw.image_objects, raw.product_images, raw.images, raw.media]
//     .filter(Array.isArray)
//     .forEach((arr) => {
//       arr.forEach((x) => {
//         const u =
//           (typeof x === "string" && x) ||
//           x?.image_url ||
//           x?.url ||
//           x?.image ||
//           x?.file ||
//           x?.thumbnail ||
//           null;
//         if (u) candidates.push(u);
//       });
//     });
//   candidates.push(
//     raw.primary_image?.url,
//     raw.image,
//     raw.image_url,
//     raw.thumbnail,
//     raw.thumbnail_url,
//     raw.primary_image_url,
//     raw.main_image,
//     raw.photo_url,
//     raw.product_image_url
//   );
//   const seen = new Set();
//   for (const u0 of candidates) {
//     const u = u0 ? fixDisplayUrl(String(u0)) : "";
//     if (!u || seen.has(u)) continue;
//     seen.add(u);
//     if (prodURLish(u) && !prodIsNotImageExt(u) && !prodIsPlaceholder(u)) return u;
//   }
//   return null;
// }
// function prodNormalizeCountryPath(path, ccSlug) {
//   if (!path) return null;
//   let p = path.replace(/^https?:\/\/[^/]+/i, "");
//   if (!p.startsWith("/")) p = `/${p}`;
//   return p.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${ccSlug}`);
// }
// function prodHrefFor(raw, ccSlug) {
//   const candidate = [raw?.href, raw?.frontend_url, raw?.seo_url, raw?.canonical_url].find(
//     (s) => typeof s === "string" && s.trim()
//   );
//   const norm = prodNormalizeCountryPath(candidate || "", ccSlug);
//   if (norm) return norm;
//   if (typeof raw?.slug === "string" && raw.slug.trim()) return `/${ccSlug}/${raw.slug.trim()}`;
//   return `/${ccSlug}/p/${raw?.id ?? ""}`;
// }
// function prodPriceNumber(raw) {
//   const cents =
//     [raw?.sale_price_cents, raw?.price_cents, raw?.list_price_cents, raw?.compare_at_cents]
//       .find((v) => Number.isFinite(v) && v > 0) ?? null;
//   if (cents != null) return cents / 100;
//   const num = [raw?.sale_price, raw?.price].find((v) => Number.isFinite(v) && v > 0);
//   return Number.isFinite(num) ? num : null;
// }
// function prodMapToRailItem(raw, ccSlug) {
//   const title = raw?.title || raw?.name || "";
//   const image = prodPickImage(raw);
//   const price = prodPriceNumber(raw) ?? 0;
//   const href = prodHrefFor(raw, ccSlug);
//   return {
//     id: raw?.id,
//     title,
//     image: image ? fixDisplayUrl(image) : "",
//     price,
//     compareAt: undefined,
//     city: raw?.seller_town || raw?.city || "",
//     rating: null,
//     reviews: null,
//     href,
//     _raw: {
//       ...raw,
//       ...(Number.isFinite(price) && price > 0 ? { sale_price: price, price } : {}),
//     },
//   };
// }
// function prodFilterPassable(it) {
//   return (
//     typeof it.title === "string" &&
//     it.title.trim().length > 0 &&
//     typeof it.image === "string" &&
//     it.image.startsWith("http") &&
//     Number.isFinite(it.price) &&
//     it.price > 0 &&
//     typeof it.href === "string" &&
//     it.href.startsWith("/")
//   );
// }

// /* ---------- direct API fetchers (no lib/api) ---------- */
// async function fetchCountryHome(cc) {
//   const ccn = normCc(cc);
//   try {
//     const res = await fetch(`${API_BASE}/home/${ccn}/`, { next: { revalidate: 300 } });
//     if (!res.ok) throw new Error("home cms");
//     return await res.json();
//   } catch {
//     return { country: ccn, version: 0, updated_at: null, sections: [] };
//   }
// }
// async function fetchCategories(cc) {
//   const ccn = normCc(cc);
//   try {
//     const res = await fetch(`${API_BASE}/categories/?country=${ccn}&page_size=60`, { next: { revalidate: 600 } });
//     if (!res.ok) throw new Error("cats");
//     const data = await res.json();
//     const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
//     return items.map((c) => ({
//       id: c.id,
//       label: c.name || c.title || "Category",
//       href: `/${ccn}/${c.slug || c.id}`,
//       icon:
//         (c.slug || "").includes("hair") || (c.slug || "").includes("beaut")
//           ? "hair"
//           : (c.slug || "").includes("food")
//             ? "food"
//             : (c.slug || "").includes("elect")
//               ? "devices"
//               : (c.slug || "").includes("whole")
//                 ? "box"
//                 : "home",
//     }));
//   } catch {
//     return [];
//   }
// }
// async function fetchProductsDirect(cc, params = {}) {
//   const ccn = normCc(cc);
//   const qs = new URLSearchParams({ country: ccn, page_size: "48", ...params }).toString();
//   try {
//     const res = await fetch(`${API_BASE}/products/?${qs}`, { next: { revalidate: 60 } });
//     if (!res.ok) throw new Error("products");
//     const data = await res.json().catch(() => null);
//     return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
//   } catch {
//     return [];
//   }
// }

// /* --------------------------------- PAGE --------------------------------- */
// export default async function CountryHome({ params }) {
//   const ccSlug = (params?.cc || "gh").toLowerCase(); // gh|ng|uk
//   const cc = normCc(ccSlug); // backend expects uk→gb
//   const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

//   const [cms, categories, trendingRaw, recentRaw, verifiedRaw] = await Promise.all([
//     fetchCountryHome(cc),
//     fetchCategories(cc),
//     fetchProductsDirect(cc, { ordering: "-created_at", page_size: "48" }),
//     fetchProductsDirect(cc, { ordering: "-created_at", page_size: "48" }),
//     fetchProductsDirect(cc, { page_size: "48" }),
//   ]);

//   const sections = cms?.sections || [];
//   const heroSec =
//     sections.find((s) => s.kind === "hero_curved" && s.key === "hero") ||
//     sections.find((s) => s.kind === "hero_curved");
//   const bannerSec = sections.find((s) => s.kind === "banner_carousel");
//   const promoSec = sections.find((s) => s.kind === "promo_tiles");

//   const heroProps = cmsHeroCurved(heroSec, ccSlug, meta);
//   const banners = cmsBanners(bannerSec, ccSlug);
//   const promos = cmsPromos(promoSec, ccSlug);

//   // Normalize products so ProductRail keeps them
//   const trending = (Array.isArray(trendingRaw) ? trendingRaw : [])
//     .map((r) => prodMapToRailItem(r, ccSlug))
//     .filter(prodFilterPassable)
//     .slice(0, 36);

//   const recent = (Array.isArray(recentRaw) ? recentRaw : [])
//     .map((r) => prodMapToRailItem(r, ccSlug))
//     .filter(prodFilterPassable)
//     .slice(0, 36);

//   const verified = (Array.isArray(verifiedRaw) ? verifiedRaw : [])
//     .map((r) => prodMapToRailItem(r, ccSlug))
//     .filter(prodFilterPassable)
//     .slice(0, 36);

//   // Debug (server logs)
//   console.log(
//     `[HOME] cc=${ccSlug} trending src=${trendingRaw.length || 0} pass=${trending.length} | ` +
//     `recent src=${recentRaw.length || 0} pass=${recent.length} | ` +
//     `verified src=${verifiedRaw.length || 0} pass=${verified.length}`
//   );

//   return (
//     <main className="bg-[#f1f2f4] text-[var(--ink)]">
//       <HeroCurved section={heroSec} cc={ccSlug} {...heroProps} />
//       {banners.length > 0 && <HeroCarousel banners={banners} />}
//       <ValuePills cc={ccSlug} />
//       <NavCategories categories={categories} />
//       {promos.length > 0 && <PromoTiles tiles={promos} />}

//       {/* Rails rendered directly */}
//       <section className="mx-auto max-w-7xl px-4 py-8">
//         <ProductRail
//           railKey="trending_near_you"
//           cc={ccSlug}
//           title="Trending Near You"
//           subtitle="Hot right now in your area"
//           items={trending}
//         />
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-8">
//         <ProductRail
//           railKey="for_you"
//           cc={ccSlug}
//           title="Just for You"
//           subtitle="Handpicked picks for you"
//           items={recent}
//         />
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-8">
//         <ProductRail
//           railKey="verified_sellers"
//           cc={ccSlug}
//           title="From Verified Sellers"
//           subtitle="Top-rated, trusted shops"
//           items={verified}
//         />
//       </section>
//     </main>
//   );
// }


// app/(pages)/[cc]/page.jsx
import ProductRail from "@/components/home/ProductRail";
import HeroCurved from "@/components/home/HeroCurved";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoTiles from "@/components/home/PromoTiles";
import ValuePills from "@/components/home/ValuePills";
// import NavCategories from "@/components/home/NavCategories";

import { fixImageUrl as fixDisplayUrl } from "@/lib/image";
import { SITE_BASE_URL, API_BASE } from "@/app/constants";

export const revalidate = 300;
export const dynamic = "auto";

/* ---------- country helpers ---------- */
const COUNTRY_ALIAS = { uk: "gb" };
const normCc = (cc) =>
  (COUNTRY_ALIAS?.[cc?.toLowerCase?.()] ?? cc ?? "gh").toLowerCase();

const isoToSlug = (iso) =>
  (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
const slugToIso = (slug) =>
  (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());

/* ---------- minimal country meta ---------- */
const COUNTRY_META = {
  gh: {
    name: "Ghana",
    lcpHeadline: "Shop Ghana — Fast Delivery, MoMo & BNPL",
    lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection",
    cities: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"],
  },
  ng: {
    name: "Nigeria",
    lcpHeadline: "Shop Nigeria — Fast Delivery & Pay on Delivery",
    lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection",
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"],
  },
  uk: {
    name: "United Kingdom",
    lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
    lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
  },
  gb: {
    name: "United Kingdom",
    lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
    lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
  },
};

/* ---------- static params / metadata ---------- */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/i18n/init/`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("init failed");
    const data = await res.json();
    const supported = (data?.supported?.countries || [])
      .map((c) => isoToSlug(c.code))
      .filter(Boolean);
    const uniq = Array.from(new Set(supported));
    return (uniq.length ? uniq : ["gh", "ng", "uk"]).map((cc) => ({ cc }));
  } catch {
    return ["gh", "ng", "uk"].map((cc) => ({ cc }));
  }
}

export async function generateMetadata({ params }) {
  const ccSlug = (params?.cc || "gh").toLowerCase();
  const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

  let countryName = meta.name;
  try {
    const res = await fetch(`${API_BASE}/i18n/init/?country=${encodeURIComponent(ccSlug)}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const j = await res.json();
      const iso = slugToIso(ccSlug);
      const hit = (j?.supported?.countries || []).find(
        (c) => String(c.code).toUpperCase() === iso
      );
      if (hit?.name) countryName = hit.name;
    }
  } catch { }

  const baseUrl = SITE_BASE_URL || "https://www.upfrica.com";
  const url = `${baseUrl}/${ccSlug}`;

  return {
    title: `${countryName} • Upfrica Marketplace — Fast Delivery, Local Sellers`,
    description: meta.lcpTagline,
    alternates: {
      canonical: url,
      languages: {
        "en-GH": `${baseUrl}/gh`,
        "en-NG": `${baseUrl}/ng`,
        "en-GB": `${baseUrl}/uk`,
        "x-default": `${baseUrl}/`,
      },
    },
    openGraph: {
      title: `Upfrica ${countryName}`,
      description: meta.lcpTagline,
      url,
      siteName: "Upfrica",
      type: "website",
      images: [{ url: `${baseUrl}/og/upfrica-${ccSlug}.png`, width: 1200, height: 630, alt: `Upfrica ${countryName}` }],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Upfrica ${countryName}`,
      description: meta.lcpTagline,
      images: [`${baseUrl}/og/upfrica-${ccSlug}.png`],
    },
  };
}

/* ---------- CMS helpers (cms*) ---------- */
const CMS_HERO_FALLBACK = {
  gh: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2400&auto=format&fit=crop",
  ng: "https://images.unsplash.com/photo-1590648938591-6fc4f1a6391c?q=80&w=2400&auto=format&fit=crop",
  uk: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
  gb: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2400&auto=format&fit=crop",
};
const cmsHeroImage = (cc) => CMS_HERO_FALLBACK[cc] || CMS_HERO_FALLBACK.gh;

function cmsPickImage(section, name, fallback) {
  if (!section) return fallback;
  if (section.primary_image?.url) return section.primary_image.url;
  const byName = section.images_by_name || {};
  if (byName[name]) return byName[name];
  return section.images?.[0]?.url || fallback;
}
function cmsCardImage(card, section, fallback) {
  if (card?.image) return card.image;
  if (card?.image_name) {
    const byName = section?.images_by_name || {};
    if (byName[card.image_name]) return byName[card.image_name];
    const hit = section?.images?.find?.((i) => i.name === card.image_name);
    if (hit?.url) return hit.url;
  }
  return fallback;
}
function cmsHeroCurved(section, ccSlug, meta) {
  const cfg = section?.config || {};
  const cityList =
    Array.isArray(cfg.cities) && cfg.cities.length
      ? cfg.cities
      : COUNTRY_META[ccSlug]?.cities || ["Your City"];
  const city = cityList[0];

  const normalizeHref = (href) => {
    if (!href || typeof href !== "string") return href;
    if (!href.startsWith("/")) return href;
    return href.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${ccSlug}`);
  };

  const defaults = [
    { title: "Today’s Deals", href: `/${ccSlug}/deals` },
    { title: `Same-Day in ${city}`, href: `/${ccSlug}/search?delivery=same-day` },
    { title: "Wholesale & Bulk", href: `/${ccSlug}/wholesale` },
  ];

  const rawCards = Array.isArray(cfg.mini_cards) ? cfg.mini_cards.slice(0, 3) : [];
  const miniCards = Array.from({ length: 3 }).map((_, i) => {
    const raw = rawCards[i] || {};
    const fallbackImageName = `hero_card_${i}`;
    const image = cmsCardImage(
      { image: raw.image, image_name: raw.image_name || fallbackImageName },
      section,
      null
    );
    return {
      title: raw.title || defaults[i].title,
      href: normalizeHref(raw.href || defaults[i].href),
      ...(image ? { image } : {}),
    };
  });

  const mainImage =
    (cfg.image_slot &&
      (section?.images_by_name?.[cfg.image_slot] ||
        section?.images?.find?.((i) => i.name === cfg.image_slot)?.url)) ||
    cmsPickImage(section, "hero", cmsHeroImage(ccSlug));

  const primaryCtaRaw =
    cfg.primaryCta || cfg.primary_cta || { label: "Browse Today’s Deals", href: `/${ccSlug}/deals` };
  const secondaryCtaRaw =
    cfg.secondaryCta || cfg.secondary_cta || { label: "Sell on Upfrica", href: `/${ccSlug}/sell` };

  const primaryCta = { ...primaryCtaRaw, href: normalizeHref(primaryCtaRaw.href) };
  const secondaryCta = { ...secondaryCtaRaw, href: normalizeHref(secondaryCtaRaw.href) };

  return {
    cc: ccSlug,
    headline: cfg.headline || meta.lcpHeadline,
    tagline: cfg.tagline || meta.lcpTagline,
    image: mainImage,
    alt: cfg.alt || `Upfrica ${meta.name} marketplace deals banner`,
    primaryCta,
    secondaryCta,
    miniCards,
  };
}
function cmsBanners(section, ccSlug) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.map((img, i) => ({
    title: cfg[`title_${i + 1}`] || section.title || "Featured",
    sub: cfg[`sub_${i + 1}`] || section.subtitle || "",
    href: cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
    img: img.url,
  }));
}
function cmsPromos(section, ccSlug) {
  if (!section) return [];
  const cfg = section.config || {};
  const imgs = section.images || [];
  return imgs.slice(0, 3).map((img, i) => ({
    title: (cfg.promos && cfg.promos[i]?.title) || cfg[`title_${i + 1}`] || "Promo",
    href: (cfg.promos && cfg.promos[i]?.href) || cfg[`href_${i + 1}`] || `/${ccSlug}/deals`,
    image: img.url,
  }));
}

/* ---------- product normalization (prod*) ---------- */
const prodURLish = (s) =>
  typeof s === "string" &&
  !!s.trim() &&
  (/^https?:\/\//i.test(s) || s.startsWith("/") || /^data:image\//i.test(s));
const prodIsNotImageExt = (s = "") =>
  /\.(mp4|mov|m4v|webm|avi|mkv|mp3|wav|m4a|aac|ogg|flac|pdf|zip|rar|7z|tar|gz|docx?|xlsx?|pptx?)($|[?#])/i.test(s);
const prodIsPlaceholder = (s = "") =>
  /(placeholder|no[-_ ]?image|image[-_ ]?not[-_ ]?available|spacer|blank|dummy|default.*\.(png|jpg|jpeg|gif|svg)|\/x\.svg)($|[?#])/i.test(
    s
  );

function prodPickImage(raw) {
  if (!raw || typeof raw !== "object") return null;
  const candidates = [];
  [raw.image_objects, raw.product_images, raw.images, raw.media]
    .filter(Array.isArray)
    .forEach((arr) => {
      arr.forEach((x) => {
        const u =
          (typeof x === "string" && x) ||
          x?.image_url ||
          x?.url ||
          x?.image ||
          x?.file ||
          x?.thumbnail ||
          null;
        if (u) candidates.push(u);
      });
    });
  candidates.push(
    raw.primary_image?.url,
    raw.image,
    raw.image_url,
    raw.thumbnail,
    raw.thumbnail_url,
    raw.primary_image_url,
    raw.main_image,
    raw.photo_url,
    raw.product_image_url
  );
  const seen = new Set();
  for (const u0 of candidates) {
    const u = u0 ? fixDisplayUrl(String(u0)) : "";
    if (!u || seen.has(u)) continue;
    seen.add(u);
    if (prodURLish(u) && !prodIsNotImageExt(u) && !prodIsPlaceholder(u)) return u;
  }
  return null;
}
function prodNormalizeCountryPath(path, ccSlug) {
  if (!path) return null;
  let p = path.replace(/^https?:\/\/[^/]+/i, "");
  if (!p.startsWith("/")) p = `/${p}`;
  return p.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${ccSlug}`);
}
function prodHrefFor(raw, ccSlug) {
  const candidate = [raw?.href, raw?.frontend_url, raw?.seo_url, raw?.canonical_url].find(
    (s) => typeof s === "string" && s.trim()
  );
  const norm = prodNormalizeCountryPath(candidate || "", ccSlug);
  if (norm) return norm;
  if (typeof raw?.slug === "string" && raw.slug.trim()) return `/${ccSlug}/${raw.slug.trim()}`;
  return `/${ccSlug}/p/${raw?.id ?? ""}`;
}
function prodPriceNumber(raw) {
  const cents =
    [raw?.sale_price_cents, raw?.price_cents, raw?.list_price_cents, raw?.compare_at_cents]
      .find((v) => Number.isFinite(v) && v > 0) ?? null;
  if (cents != null) return cents / 100;
  const num = [raw?.sale_price, raw?.price].find((v) => Number.isFinite(v) && v > 0);
  return Number.isFinite(num) ? num : null;
}
function prodMapToRailItem(raw, ccSlug) {
  const title = raw?.title || raw?.name || "";
  const image = prodPickImage(raw);
  const price = prodPriceNumber(raw) ?? 0;
  const href = prodHrefFor(raw, ccSlug);
  return {
    id: raw?.id,
    title,
    image: image ? fixDisplayUrl(image) : "",
    price,
    compareAt: undefined,
    city: raw?.seller_town || raw?.city || "",
    rating: null,
    reviews: null,
    href,
    _raw: {
      ...raw,
      ...(Number.isFinite(price) && price > 0 ? { sale_price: price, price } : {}),
    },
  };
}

/* ✅ Only drop items w/o image; keep everything else */
function prodFilterHasImage(it) {
  return typeof it?.image === "string" && it.image.startsWith("http");
}

/* ---------- direct API fetchers ---------- */
async function fetchCountryHome(cc) {
  const ccn = normCc(cc);
  try {
    const res = await fetch(`${API_BASE}/home/${ccn}/`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("home cms");
    return await res.json();
  } catch {
    return { country: ccn, version: 0, updated_at: null, sections: [] };
  }
}
async function fetchCategories(cc) {
  const ccn = normCc(cc);
  try {
    const res = await fetch(`${API_BASE}/categories/?country=${ccn}&page_size=60`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("cats");
    const data = await res.json();
    const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    return items.map((c) => ({
      id: c.id,
      label: c.name || c.title || "Category",
      href: `/${ccn}/${c.slug || c.id}`,
      icon:
        (c.slug || "").includes("hair") || (c.slug || "").includes("beaut")
          ? "hair"
          : (c.slug || "").includes("food")
            ? "food"
            : (c.slug || "").includes("elect")
              ? "devices"
              : (c.slug || "").includes("whole")
                ? "box"
                : "home",
    }));
  } catch {
    return [];
  }
}
async function fetchProductsDirect(cc, params = {}) {
  const ccn = normCc(cc);
  const qs = new URLSearchParams({ country: ccn, page_size: "48", ...params }).toString();
  try {
    const res = await fetch(`${API_BASE}/products/?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("products");
    const data = await res.json().catch(() => null);
    return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* --------------------------------- PAGE --------------------------------- */
export default async function CountryHome({ params }) {
  const ccSlug = (params?.cc || "gh").toLowerCase(); // gh|ng|uk
  const cc = normCc(ccSlug); // backend expects uk→gb
  const meta = COUNTRY_META[ccSlug] || COUNTRY_META.gh;

  const [cms, categories, trendingRaw, recentRaw, verifiedRaw] = await Promise.all([
    fetchCountryHome(cc),
    fetchCategories(cc),
    fetchProductsDirect(cc, { ordering: "-created_at", page_size: "48" }),
    fetchProductsDirect(cc, { ordering: "-created_at", page_size: "48" }),
    fetchProductsDirect(cc, { page_size: "48" }),
  ]);

  const sections = cms?.sections || [];
  const heroSec =
    sections.find((s) => s.kind === "hero_curved" && s.key === "hero") ||
    sections.find((s) => s.kind === "hero_curved");
  const bannerSec = sections.find((s) => s.kind === "banner_carousel");
  const promoSec = sections.find((s) => s.kind === "promo_tiles");

  const heroProps = cmsHeroCurved(heroSec, ccSlug, meta);
  const banners = cmsBanners(bannerSec, ccSlug);
  const promos = cmsPromos(promoSec, ccSlug);

  // Normalize → only filter by image → cap to 36
  const trending = (Array.isArray(trendingRaw) ? trendingRaw : [])
    .map((r) => prodMapToRailItem(r, ccSlug))
    .filter(prodFilterHasImage)
    .slice(0, 36);

  const recent = (Array.isArray(recentRaw) ? recentRaw : [])
    .map((r) => prodMapToRailItem(r, ccSlug))
    .filter(prodFilterHasImage)
    .slice(0, 36);

  const verified = (Array.isArray(verifiedRaw) ? verifiedRaw : [])
    .map((r) => prodMapToRailItem(r, ccSlug))
    .filter(prodFilterHasImage)
    .slice(0, 36);

  // Debug (optional)
  console.log(
    `[HOME] cc=${ccSlug} trending src=${trendingRaw.length || 0} pass=${trending.length} | ` +
    `recent src=${recentRaw.length || 0} pass=${recent.length} | ` +
    `verified src=${verifiedRaw.length || 0} pass=${verified.length}`
  );

  return (
    <main className="bg-[#f1f2f4] text-[var(--ink)]">
      <HeroCurved section={heroSec} cc={ccSlug} {...heroProps} />
      {banners.length > 0 && <HeroCarousel banners={banners} />}
      <ValuePills cc={ccSlug} />
      {/* <NavCategories categories={categories} /> */}
      {promos.length > 0 && <PromoTiles tiles={promos} />}

      {/* Rails rendered directly */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <ProductRail
          railKey="trending_near_you"
          cc={ccSlug}
          title="Trending Near You"
          subtitle="Hot right now in your area"
          items={trending}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <ProductRail
          railKey="for_you"
          cc={ccSlug}
          title="Just for You"
          subtitle="Handpicked picks for you"
          items={recent}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <ProductRail
          railKey="verified_sellers"
          cc={ccSlug}
          title="From Verified Sellers"
          subtitle="Top-rated, trusted shops"
          items={verified}
        />
      </section>
    </main>
  );
}
