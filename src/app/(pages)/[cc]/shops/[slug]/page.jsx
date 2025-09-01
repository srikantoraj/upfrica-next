// src/app/(pages)/[region]/shops/[slug]/page.jsx
import ShopPageClient from "./ShopPageClient";
import FaqJsonLd from "./FaqJsonLd";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";

// ✅ centralized SEO builders
import { buildBaseMetadata, buildShopMetadata } from "@/lib/seo/builders";

/* ---------------- data helpers ---------------- */
function getAuthHeaders() {
  const t = cookies().get("auth_token")?.value || cookies().get("token")?.value;
  return t ? { Authorization: `Token ${t}` } : {};
}

async function fetchShopBundle(slug) {
  try {
    const r = await fetch(`${BASE_API_URL}/api/shops/${slug}/products/`, {
      headers: getAuthHeaders(),
      next: { revalidate: 300 },
    });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

/* ---------------- metadata ---------------- */
export async function generateMetadata({ params }) {
  const { region, slug } = params;
  const data = await fetchShopBundle(slug);
  const cc = String(region || "").toLowerCase();

  if (!data) {
    return buildBaseMetadata({
      title: "Shop",
      description: "Explore verified African shops and sellers on Upfrica.",
      canonicalPath: `/${cc}/shops/${slug}`,
      images: [],
      type: "website",
    });
  }

  const shop = data.shop || {};
  const base = buildShopMetadata({
    shop,
    products: data.results,
    region: cc,
    slug,
  });

  // Smart robots: noindex if inactive or 0 listings (unless overridden)
  const shouldNoIndex =
    (shop.is_active === false || (data.count ?? 0) === 0) &&
    !Boolean(shop?.shop_attributes?.seo_index_override);

  return {
    ...base,
    robots: shouldNoIndex
      ? { index: false, follow: true }
      : base.robots ?? { index: true, follow: true },
  };
}

/* ---------------- page ---------------- */
export default async function Page({ params }) {
  const { region, slug } = params;
  const data = await fetchShopBundle(slug);

  // If the shop truly doesn't exist
  if (!data || !data.shop) {
    notFound();
  }

  const shop = data.shop;

  // Normalize to canonical region if we know it
  const cc = shop?.user?.country_code?.toLowerCase();
  if (cc && cc !== String(region).toLowerCase()) {
    redirect(`/${cc}/shops/${slug}`);
  }

  return (
    <>
      {/* Server-rendered JSON-LD for SEO */}
      {shop?.faq_schema && <FaqJsonLd schema={shop.faq_schema} />}

      {/* Pass initial bundle to avoid an extra client fetch */}
      <ShopPageClient
        slug={slug}
        country={region?.toLowerCase()}
        initialBundle={data}   // ← hydrate on the client first
      />
    </>
  );
}