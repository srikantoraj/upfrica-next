// // src/lib/home.js
// import { api } from "@/lib/api";

// export const REVALIDATE_SECONDS = 300;

// /* ----------------------- country helpers ----------------------- */
// const COUNTRY_ALIAS = { uk: "gb" };
// const VALID_CC = new Set(["gh", "ng", "uk", "gb"]); // normalize uk→gb

// function normCc(cc) {
//   const raw = (cc || "").toString().trim().toLowerCase().slice(0, 2);
//   return COUNTRY_ALIAS[raw] || raw || null;
// }

// function ccFromUrlPath(urlLike) {
//   if (!urlLike || typeof urlLike !== "string") return null;
//   const path = urlLike.replace(/^https?:\/\/[^/]+/i, "");
//   const m = path.match(/^\/(gh|ng|uk|gb)(?=\/|$)/i);
//   if (!m) return null;
//   const c = normCc(m[1]);
//   return VALID_CC.has(c) ? c : null;
// }

// // Very small city hints (negative filter only). Extend as needed.
// const CITY_CC_HINTS = {
//   gh: new Set(["accra", "kumasi", "takoradi", "tamale", "tema", "cape coast", "kasoa"]),
//   ng: new Set(["lagos", "abuja", "ibadan", "benin", "yenagoa", "isolo", "port harcourt"]),
//   id: new Set(["jakarta"]),
// };

// function cityHint(raw) {
//   const s =
//     (raw?.seller_town || raw?.city || raw?.seller_info?.town || "")
//       .toString()
//       .trim()
//       .toLowerCase();
//   if (!s) return null;
//   for (const [cc, set] of Object.entries(CITY_CC_HINTS)) {
//     if (set.has(s)) return cc; // e.g. "lagos"→"ng"
//   }
//   return null;
// }

// function deriveCcFromFields(raw) {
//   const candidates = [
//     raw?.seller_country_code,
//     raw?.listing_country_code,
//     raw?.cached_country_code,
//     raw?.country_code,
//     raw?.country,
//     raw?.seller_info?.country,
//     raw?.user?.country_fk?.code,
//     raw?.user?.country,
//     ccFromUrlPath(raw?.frontend_url),
//     ccFromUrlPath(raw?.seo_url),
//     ccFromUrlPath(raw?.canonical_url),
//   ];
//   for (const c of candidates) {
//     const n = normCc(c);
//     if (n && VALID_CC.has(n)) return n;
//   }
//   return null;
// }

// /**
//  * Accept an item only if we can confidently match it to the page country.
//  * Priority:
//  *   1) explicit country fields / URL prefix must equal page cc
//  *   2) if unknown, use a city hint: if it suggests a different country → reject
//  *   3) if still unknown → accept (strict, but allows unknowns)
//  */
// function acceptForCountry(raw, pageCc) {
//   const want = normCc(pageCc);
//   if (!want) return true;

//   const cc = deriveCcFromFields(raw);
//   if (cc) return cc === want;      // explicit country must match

//   const hint = cityHint(raw);
//   if (hint && hint !== want) return false; // conflicting hint → reject

//   return true; // unknown origin → accept
// }

// /* ----------------------- image helpers ------------------------ */
// export function primaryImageUrl(p) {
//   if (Array.isArray(p.image_objects) && p.image_objects.length) {
//     const x = p.image_objects[0];
//     if (typeof x === "string") return x;
//     return x.url || x.image_url || null;
//   }
//   if (Array.isArray(p.product_images) && p.product_images.length) {
//     const x = p.product_images[0];
//     if (typeof x === "string") return x;
//     return x.url || x.image_url || null;
//   }
//   return p.thumbnail || p.product_image_url || null;
// }

// /* ------------------------ mapping -------------------------------- */
// function mapRailProduct(p, cc) {
//   const hasSale =
//     Number.isFinite(p.sale_price_cents) && p.sale_price_cents > 0;
//   const price = hasSale
//     ? p.sale_price_cents / 100
//     : (p.price_cents || 0) / 100;
//   const compareAt = hasSale ? (p.price_cents || 0) / 100 : undefined;

//   return {
//     id: p.id,
//     title: p.title,
//     image: primaryImageUrl(p),
//     price,
//     compareAt,
//     city: p.seller_town || "",
//     rating: null,
//     reviews: null,
//     href:
//       p.frontend_url ||
//       (p.slug
//         ? `/${normCc(cc)}/${p.slug}-${(p?.condition?.slug || "brand-new")}-${(p?.seller_town || "accra")
//             .toLowerCase()
//             .replace(/\s+/g, "-")}/`
//         : `/${normCc(cc)}/p/${p.id}`),
//     _raw: p,
//   };
// }

// /* ------------------------ fetchers (via proxy) ------------------------------ */
// async function getJSONViaProxy(pathWithQuery, init = {}) {
//   // Goes through /api proxy → your route injects X-UI-Currency / X-Deliver-CC, auth, tz, etc.
//   return api(pathWithQuery, {
//     ...init,
//     method: init.method || "GET",
//     next: { revalidate: REVALIDATE_SECONDS, ...(init.next || {}) },
//   });
// }

// export async function fetchProducts({ cc, params = {} }) {
//   const ccn = normCc(cc);
//   const qs = new URLSearchParams({ country: ccn, page_size: "24", ...params });
//   const data = await getJSONViaProxy(`products/?${qs.toString()}`).catch(() => null);

//   const results = Array.isArray(data?.results)
//     ? data.results
//     : Array.isArray(data)
//     ? data
//     : [];

//   // 1) hard country lock
//   const locked = results.filter((r) => acceptForCountry(r, ccn));

//   // 2) map + drop no-image
//   return locked
//     .map((p) => mapRailProduct(p, ccn))
//     .filter((p) => !!p.image);
// }

// export async function fetchCategories(cc) {
//   const ccn = normCc(cc);
//   const data = await getJSONViaProxy(`categories/?country=${ccn}&page_size=60`).catch(() => null);
//   const items = Array.isArray(data?.results)
//     ? data.results
//     : Array.isArray(data)
//     ? data
//     : [];
//   return items.map((c) => ({
//     id: c.id,
//     label: c.name || c.title || "Category",
//     href: `/${ccn}/${c.slug || c.id}`,
//     icon:
//       (c.slug || "").includes("hair") || (c.slug || "").includes("beaut")
//         ? "hair"
//         : (c.slug || "").includes("food")
//         ? "food"
//         : (c.slug || "").includes("elect")
//         ? "devices"
//         : (c.slug || "").includes("whole")
//         ? "box"
//         : "home",
//   }));
// }

// // Home “rails”
// export async function getHomeRails(cc) {
//   const ccn = normCc(cc);
//   const [recent, trending, verified] = await Promise.all([
//     fetchProducts({ cc: ccn, params: { ordering: "-created_at", page_size: "18" } }),
//     fetchProducts({ cc: ccn, params: { ordering: "-created_at", page_size: "18" } }),
//     fetchProducts({ cc: ccn, params: { page_size: "18" } }),
//   ]);

//   return [
//     { key: "trending_near_you", title: "Trending Near You", subtitle: "Hot right now in your area", items: trending },
//     { key: "for_you", title: "Just for You", subtitle: "Handpicked picks for you", items: recent },
//     { key: "verified_sellers", title: "From Verified Sellers", subtitle: "Top-rated, trusted shops", items: verified },
//   ].map((r) => ({ ...r, items: r.items.slice(0, 18) }));
// }

// export const COUNTRY_META = {
//   gh: { name: "Ghana", currency: "GHS", currencySymbol: "GH₵", code: "GH",
//         cities: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"],
//         lcpHeadline: "Shop Ghana — Fast Delivery, MoMo & BNPL",
//         lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection" },
//   ng: { name: "Nigeria", currency: "NGN", currencySymbol: "₦", code: "NG",
//         cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"],
//         lcpHeadline: "Shop Nigeria — Fast Delivery & Pay on Delivery",
//         lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection" },
//   uk: { name: "United Kingdom", currency: "GBP", currencySymbol: "£", code: "UK",
//         cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
//         lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
//         lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection" },
// };


// src/lib/home.js
import { api } from "@/lib/api";

export const REVALIDATE_SECONDS = 5;

/* ----------------------- country helpers ----------------------- */
const COUNTRY_ALIAS = { uk: "gb" };
const VALID_CC = new Set(["gh", "ng", "uk", "gb"]); // normalize uk→gb

function normCc(cc) {
  const raw = (cc || "").toString().trim().toLowerCase().slice(0, 2);
  return COUNTRY_ALIAS[raw] || raw || null;
}

/* ------------------------ fetchers (via proxy) ------------------------------ */
async function getJSONViaProxy(pathWithQuery, init = {}) {
  // Goes through /api proxy → your route injects X-UI-Currency / X-Deliver-CC, auth, tz, etc.
  return api(pathWithQuery, {
    ...init,
    method: init.method || "GET",
    next: { revalidate: REVALIDATE_SECONDS, ...(init.next || {}) },
  });
}

/**
 * Return the API payload "as-is" (no extra filters/gates).
 * The rails will normalize each item for display.
 */
export async function fetchProducts({ cc, params = {} }) {
  const ccn = normCc(cc);
  const qs = new URLSearchParams({ country: ccn, page_size: "24", ...params });
  const data = await getJSONViaProxy(`products/?${qs.toString()}`).catch(() => null);

  // Return exactly what the API gave us for this page
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

export async function fetchCategories(cc) {
  const ccn = normCc(cc);
  const data = await getJSONViaProxy(`categories/?country=${ccn}&page_size=60`).catch(() => null);
  const items = Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data)
      ? data
      : [];
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
}

/**
 * Home “rails” — keep the raw lists; do not slice/cap here.
 */
export async function getHomeRails(cc) {
  const ccn = normCc(cc);
  const [recent, trending, verified] = await Promise.all([
    fetchProducts({ cc: ccn, params: { ordering: "-created_at", page_size: "20" } }),
    fetchProducts({ cc: ccn, params: { ordering: "-created_at", page_size: "20" } }),
    fetchProducts({ cc: ccn, params: { page_size: "20" } }),
  ]);

  return [
    { key: "trending_near_you", title: "Trending Near You", subtitle: "Hot right now in your area", items: trending },
    { key: "for_you", title: "Just for You", subtitle: "Handpicked picks for you", items: recent },
    { key: "verified_sellers", title: "From Verified Sellers", subtitle: "Top-rated, trusted shops", items: verified },
  ];
}

export const COUNTRY_META = {
  gh: {
    name: "Ghana", currency: "GHS", currencySymbol: "GH₵", code: "GH",
    cities: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"],
    lcpHeadline: "Shop Ghana — Fast Delivery, MoMo & BNPL",
    lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection"
  },
  ng: {
    name: "Nigeria", currency: "NGN", currencySymbol: "₦", code: "NG",
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"],
    lcpHeadline: "Shop Nigeria — Fast Delivery & Pay on Delivery",
    lcpTagline: "Local sellers • Same-day/Next-day • Buyer Protection"
  },
  uk: {
    name: "United Kingdom", currency: "GBP", currencySymbol: "£", code: "UK",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"],
    lcpHeadline: "Shop African Goods in the UK — Next-Day Delivery",
    lcpTagline: "Verified sellers • Next-day • Diaspora favourites • Buyer Protection"
  },
};
