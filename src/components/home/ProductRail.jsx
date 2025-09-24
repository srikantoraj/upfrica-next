import Link from "next/link";
import RailCard from "./RailCard";
import { fetchProducts } from "@/lib/home";
import { fixImageUrl as fixDisplayUrl } from "@/lib/image";   // ⬅️ server-safe helper
import { symbolFor } from "@/lib/pricing-mini";

/* ----------------------- small utils ----------------------- */
const MAX_ITEMS_PER_RAIL = 18;

function truthyStr(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function first(vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object" && typeof v.url === "string" && v.url.trim()) return v.url.trim();
  }
  return null;
}
const URLish = (s) =>
  typeof s === "string" &&
  !!s.trim() &&
  (/^https?:\/\//i.test(s) || s.startsWith("/") || /^data:image\//i.test(s));

const isNotImageExt = (s = "") =>
  /\.(mp4|mov|m4v|webm|avi|mkv|mp3|wav|m4a|aac|ogg|flac|pdf|zip|rar|7z|tar|gz|docx?|xlsx?|pptx?)($|[?#])/i.test(s);

const isPlaceholder = (s = "") =>
  /(placeholder|no[-_ ]?image|image[-_ ]?not[-_ ]?available|spacer|blank|dummy|default.*\.(png|jpg|jpeg|gif|svg)|\/x\.svg)($|[?#])/i.test(
    s
  );

/* ----------------------- media / images ----------------------- */
function pickRawImage(r) {
  if (!r || typeof r !== "object") return null;

  const candidates = [];

  // Arrays of media-like objects
  const arrays = [r.image_objects, r.product_images, r.images, r.media].filter(Array.isArray);
  for (const arr of arrays) {
    for (const x of arr) {
      const url = first([x?.image_url, x?.url, x?.image, x?.file, x?.thumbnail]);
      if (url) candidates.push(url);
    }
  }

  // Single fields
  candidates.push(
    r.primary_image?.url,
    r.image,
    r.image_url,
    r.thumbnail,
    r.thumbnail_url,
    r.primary_image_url,
    r.main_image,
    r.photo_url,
    r.product_image_url
  );

  // Normalize, dedupe, and filter to a real image
  const seen = new Set();
  const cleaned = candidates
    .map((u) => (u ? fixDisplayUrl(String(u)) : ""))  // ⬅️ now server-safe
    .filter(Boolean)
    .filter((u) => !seen.has(u) && seen.add(u))
    .filter((u) => URLish(u) && !isNotImageExt(u) && !isPlaceholder(u));

  return cleaned[0] || null;
}

/* ----------------------- price / currency ----------------------- */
function priceFromRaw(r) {
  const saleC = Number.isFinite(r?.sale_price_cents) && r.sale_price_cents > 0 ? r.sale_price_cents : null;
  const baseC = Number.isFinite(r?.price_cents) && r.price_cents > 0 ? r.price_cents : null;
  if (saleC != null) return saleC / 100;
  if (baseC != null) return baseC / 100;
  const sale = Number.isFinite(r?.sale_price) && r.sale_price > 0 ? r.sale_price : null;
  const base = Number.isFinite(r?.price) && r.price > 0 ? r.price : null;
  return sale ?? base ?? null;
}
function compareAtFromRaw(r) {
  if (Number.isFinite(r?.sale_price_cents) && r.sale_price_cents > 0 && Number.isFinite(r?.price_cents) && r.price_cents > 0) {
    return r.price_cents / 100;
  }
  const cents = [r?.compare_at_cents, r?.list_price_cents].find((v) => Number.isFinite(v) && v > 0);
  if (Number.isFinite(cents)) return cents / 100;
  const num = [r?.compare_at, r?.list_price].find((v) => Number.isFinite(v) && v > 0);
  return Number.isFinite(num) ? num : null;
}

const CC_CURRENCY = { gh: "GHS", ng: "NGN", uk: "GBP", gb: "GBP" };
function currencyForCc(cc) {
  return CC_CURRENCY[String(cc || "").toLowerCase()] || "USD";
}
function currencyFromRaw(r, cc) {
  const guesses = [
    r?.currency,
    r?.price_currency,
    r?.sale_price_currency,
    r?.list_currency,
    r?.compare_at_currency,
    r?.ccy,
  ].filter(truthyStr);
  return (guesses[0] || currencyForCc(cc)).toUpperCase();
}

/* ----------------------- links / city ----------------------- */
function normalizeCountryPath(path, cc) {
  if (!path) return null;
  let p = path.replace(/^https?:\/\/[^/]+/i, "");
  if (!p.startsWith("/")) p = `/${p}`;
  return p.replace(/^\/(gh|ng|uk|gb)(?=\/|$)/i, `/${cc}`);
}
function hrefFromRaw(r, cc) {
  const candidate = [r?.href, r?.frontend_url, r?.seo_url, r?.canonical_url].find(truthyStr);
  const normalized = normalizeCountryPath(candidate || "", cc);
  if (normalized) return normalized;
  if (truthyStr(r?.slug)) return `/${cc}/${r.slug}`;
  return `/${cc}/p/${r?.id ?? ""}`;
}
function cityFromRaw(r) {
  return r?.city || r?.seller_city || r?.seller_town || r?.seller_info?.town || r?.cached_town_slug || r?.shipping_from || "";
}

/* ----------------------- normalization ----------------------- */
function normalizeItem(item, cc) {
  if (truthyStr(item?.title) && (truthyStr(item?.image) || "image" in item) && (Number.isFinite(item?.price) || "price" in item)) {
    const href = hrefFromRaw(item, cc);
    const city = cityFromRaw(item);
    const sourceCurrency = item.sourceCurrency || item.currency || currencyFromRaw(item._raw || {}, cc);
    return { ...item, image: fixDisplayUrl(item.image || ""), href, city, sourceCurrency, _raw: item._raw ?? null };
  }

  const img = pickRawImage(item);
  const price = priceFromRaw(item);
  return {
    id: item?.id,
    title: item?.title || item?.name || "",
    image: fixDisplayUrl(img || ""),
    price,
    compareAt: compareAtFromRaw(item),
    city: cityFromRaw(item),
    rating: null,
    reviews: null,
    href: hrefFromRaw(item, cc),
    sourceCurrency: currencyFromRaw(item, cc),
    _raw: item,
  };
}

/* ----------------------- gating / safety ----------------------- */
const STRICT = { requireTitle: false, requireImage: false, requirePrice: false, requireCondition: false, requireCategory: false };

function hasCategoryRaw(r) {
  if (!r || r.category == null) return false;
  const c = r.category;
  if (typeof c === "object") return Boolean(c.id || c.slug || c.name);
  return truthyStr(String(c));
}
function hasConditionRaw(r) { return r && truthyStr(String(r.condition || "")); }
function hasPriceRaw(r) {
  const cents = [r?.sale_price_cents, r?.price_cents, r?.wholesale_price_cents, r?.list_price_cents, r?.compare_at_cents]
    .find((v) => Number.isFinite(v) && v > 0);
  if (Number.isFinite(cents)) return true;
  const nums = [r?.sale_price, r?.price].find((v) => Number.isFinite(v) && v > 0);
  return Number.isFinite(nums);
}
function hasImageRaw(r) { return Boolean(pickRawImage(r)); }

const STRICT_BY_RAIL = {
  featured: { requireImage: true, requirePrice: true },
  trending_near_you: { requireImage: true, requirePrice: true },
  for_you: { requireImage: true },
};

function frontpageReady(n, railKey) {
  const s = { ...STRICT, ...(STRICT_BY_RAIL[railKey] || {}) };
  if (s.requireTitle && !truthyStr(n.title)) return false;
  if (s.requireImage && !truthyStr(n.image)) return false;
  if (s.requirePrice && !(Number.isFinite(n.price) && n.price > 0)) return false;

  const r = n._raw;
  if (!r) return true;
  if (s.requireCondition && !hasConditionRaw(r)) return false;
  if (s.requireCategory && !hasCategoryRaw(r)) return false;
  if (s.requireImage && !hasImageRaw(r)) return false;
  if (s.requirePrice && !hasPriceRaw(r)) return false;
  return true;
}

function dedupeItems(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const key = [it?.id ?? "", it?.href ?? "", it?.image ?? "", it?.title ?? "", it?.price ?? ""].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}
function hasSafeHref(n) { return truthyStr(n.href) && n.href.startsWith("/"); }

function defaultParamsForRail(railKey) {
  switch (railKey) {
    case "trending_near_you": return { ordering: "-created_at", page_size: String(MAX_ITEMS_PER_RAIL) };
    case "for_you":           return { ordering: "-created_at", page_size: String(MAX_ITEMS_PER_RAIL) };
    case "verified_sellers":  return { page_size: String(MAX_ITEMS_PER_RAIL) };
    default:                  return { page_size: String(MAX_ITEMS_PER_RAIL) };
  }
}

function railLink(cc, key) {
  const base = `/${cc}`;
  switch (key) {
    case "featured":         return `${base}/featured`;
    case "same_day":         return `${base}/search?delivery=same-day`;
    case "verified_sellers": return `${base}/search?seller=verified`;
    case "wholesale":        return `${base}/wholesale`;
    case "seasonal":         return `${base}/deals?tag=seasonal`;
    case "for_you":          return `${base}/for-you`;
    case "trending_near_you":
    default:                 return `${base}/search?sort=trending`;
  }
}
function stableKey(n, i) {
  if (n?.id != null) return `p-${n.id}`;
  if (truthyStr(n?.href)) return `h-${n.href}`;
  if (truthyStr(n?.image)) return `i-${n.image}-${i}`;
  return `idx-${i}`;
}

/* ----------------------- component ----------------------- */
export default async function ProductRail({
  railKey,
  cc,
  title,
  subtitle,
  items,
  params = {},
  currency,
  currencySymbol,
}) {
  const provided = Array.isArray(items) ? items : null;
  const shouldFallback = !provided || provided.length === 0;

  const effectiveParams = params && Object.keys(params).length > 0 ? params : defaultParamsForRail(railKey);
  const sourceItems = shouldFallback ? await fetchProducts({ cc, params: effectiveParams }) : provided;

  const normalized = (sourceItems || []).map((it) => normalizeItem(it, cc));
  const gated = normalized.filter((n) => frontpageReady(n, railKey)).filter(hasSafeHref);
  const safeItems = dedupeItems(gated).slice(0, MAX_ITEMS_PER_RAIL);

  if (!safeItems.length) return null;

  const headingId = `rail-${railKey || "default"}-title`;
  const effectiveCurrency = (currency || currencyForCc(cc)).toUpperCase();
  const effectiveSymbol = currencySymbol || symbolFor(effectiveCurrency, "en");

  return (
    <section className="mx-auto max-w-7xl px-4 py-8" data-rail={railKey}>
      <div className="flex items-end justify-between">
        <div>
          <h2 id={headingId} className="text-lg md:text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-[var(--ink-2)] text-sm mt-1">{subtitle}</p>}
        </div>
        <Link href={railLink(cc, railKey)} className="text-[var(--violet-500,#A435F0)] text-sm hover:underline" aria-label={`View all ${title}`} prefetch>
          View all
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto no-scrollbar">
        <ul
          className="flex gap-3 lg:gap-4 snap-x snap-mandatory scroll-p-4 overflow-x-auto no-scrollbar scroll-fade-right"
          role="list"
          aria-roledescription="carousel"
          aria-labelledby={headingId}
          aria-label={!subtitle ? title : undefined}
        >
          {safeItems.map((p, i) => (
            <li key={stableKey(p, i)} className="snap-start" data-pos={i} data-id={p?.id ?? ""}>
              <RailCard
                cc={cc}
                item={p}
                currency={effectiveCurrency}
                currencySymbol={effectiveSymbol}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}