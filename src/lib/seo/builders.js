// src/lib/seo/builders.js
import { absUrl, stripHtml, truncate, SITE_BASE } from "./helpers";

/** ---------- Generic base builder ---------- */
export function buildBaseMetadata({
  title,
  description,
  canonicalPath,
  images,
  type = "website",
  imageAlt = "Upfrica",
  robots = { index: true, follow: true },
}) {
  const canonical = canonicalPath?.startsWith?.("http")
    ? canonicalPath
    : `${SITE_BASE}/${String(canonicalPath || "").replace(/^\//, "")}`;

  const imageList = (images || [])
    .filter(Boolean)
    .map((url) => ({ url, width: 1200, height: 630, alt: imageAlt }));

  return {
    title, // layout applies `%s | Upfrica`
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      images: imageList.length
        ? imageList
        : [{ url: `${SITE_BASE}/default-og-banner.jpg`, width: 1200, height: 630, alt: imageAlt }],
      siteName: "Upfrica",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageList.length ? imageList.map((i) => i.url) : [`${SITE_BASE}/default-og-banner.jpg`],
    },
    robots,
  };
}

/** ---------- Shared helpers ---------- */
export function pickOgImage({ shop, products }) {
  const prod = products?.[0] || products?.at?.(-1);
  const fromProd =
    prod?.thumbnail ||
    prod?.image_objects?.[0]?.image_url ||
    prod?.image_objects?.[0]?.url ||
    prod?.ordered_product_images?.[0];

  return (
    absUrl(shop?.top_banner) ||
    absUrl(shop?.shop_logo) ||
    absUrl(fromProd) ||
    `${SITE_BASE}/default-og-banner.jpg`
  );
}

export function pickShopSpecialty(shop) {
  return (
    (shop?.seo_specialty && String(shop.seo_specialty).trim()) ||
    (shop?.shop_attributes?.seo_specialty && String(shop.shop_attributes.seo_specialty).trim()) ||
    (shop?.shoptype?.name && String(shop.shoptype.name).trim()) ||
    "Shop"
  );
}

/** Build a stable, SEO-friendly description for shop pages */
function buildShopDescription({ shop, specialty, town, countryName, productsCount }) {
  const shopName = shop?.name || "Shop";
  const specialtyLower = String(specialty || "shop").toLowerCase();
  const loc = town || countryName || "your area";
  const count =
    Number.isFinite(productsCount) && productsCount > 0
      ? productsCount
      : (Number(shop?.active_listings) || 0);

  const tail = count ? ` Browse ${count}+ items.` : "";
  const desc = `${shopName} — verified ${specialtyLower}. Fast delivery in ${loc}, buyer protection, warranty options.${tail}`;
  return desc;
}

/** ---------- Shop page metadata ---------- */
export function buildShopMetadata({ shop, products, region, slug, productsCount, robots }) {
  const shopName = (shop?.name || "Shop").slice(0, 60);
  const specialty = pickShopSpecialty(shop);
  const town = shop?.user?.town || "";
  const countryName = shop?.user?.country_name || shop?.user?.country || "";

  // Title: "Shop {Specialty} in {City}, {Country} – {ShopName}"
  const loc = [town, countryName].filter(Boolean).join(", ");
  const baseTitle = loc ? `Shop ${specialty} in ${loc} – ${shopName}` : `Shop ${specialty} – ${shopName}`;
  const title = truncate(baseTitle, 60);

  // Description: prefer explicit custom meta if present, else our structured line
  const customMeta =
    shop?.seo_meta_description ||
    shop?.shop_attributes?.seo_meta_description ||
    null;

  const structured = buildShopDescription({
    shop,
    specialty,
    town,
    countryName,
    productsCount,
  });

  // If you *really* want to fall back to rich content when everything else is empty, add:
  const fallback = stripHtml(shop?.seo_content || "") || `${shopName}: Online shopping with buyer protection on Upfrica.`;

  const description = truncate(customMeta || structured || fallback, 155);

  const canonicalPath = `/${String(region || "").toLowerCase()}/shops/${slug}`;
  const ogImage = pickOgImage({ shop, products });

  return buildBaseMetadata({
    title,
    description,
    canonicalPath,
    images: [ogImage],
    imageAlt: `${shopName} – ${specialty}${loc ? ` in ${loc}` : ""}`,
    robots,
  });
}

/** ---------- Product page metadata (unchanged) ---------- */
export function buildProductMetadata({ product, region, robots }) {
  const title = truncate(product?.title || "Product", 60);
  const description = truncate(
    stripHtml(product?.description || product?.seo_html || "") || "Buy on Upfrica.",
    155
  );
  const image =
    product?.thumbnail ||
    product?.image_objects?.[0]?.image_url ||
    product?.image_objects?.[0]?.url ||
    product?.ordered_product_images?.[0];

  const canonicalPath = `/${String(region || "").toLowerCase()}/${product?.seo_slug || product?.slug}`;
  return buildBaseMetadata({
    title,
    description,
    canonicalPath,
    images: [absUrl(image)],
    imageAlt: product?.title || "Product image",
    robots,
  });
}


/** ---------- Shop types page metadata (unchanged) ---------- */
export function buildShopTypeMetadata({ type, region, slug }) {
  const typeName = (type?.name || "Shops").toString();
  const cc = String(region || "").toUpperCase();

  // Title uses layout’s "%s | Upfrica" template
  const title = `Shop ${typeName} in ${cc}`;

  // Prefer curated fields from API; else fallback
  const description =
    (type?.final_seo_description && String(type.final_seo_description)) ||
    `Explore verified ${typeName.toLowerCase()} across ${cc}. Fast delivery and buyer protection.`;

  const banner = type?.banner_image_url;
  const canonicalPath = `/${String(region || "").toLowerCase()}/shoptypes/${slug}`;

  return buildBaseMetadata({
    title,
    description,
    canonicalPath,
    images: banner ? [banner] : [],
    type: "website",
  });
}