// ✅ app/(pages)/[cc]/[slug]/page.jsx for product detail page
import { notFound, redirect } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/Header";
import RelatedProducts from "@/components/home/ProductList/RealtedProduct";
import ProductDetailSection from "@/components/ProductDetailSection/ProductDetailSection";

// Frontend-only route prefixes that should NOT be treated as product regions
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

// Map region → human country name (fallback used only if product/user don’t provide one)
const REGION_TO_COUNTRY = {
  gh: "Ghana",
  ng: "Nigeria",
  uk: "United Kingdom",
};

/**
 * Fetch product data by slug + region
 */
export async function getProductData(country, slug) {
  if (!slug) throw new Error("❌ No product slug provided");

  // 🚫 Safety: never try to fetch frontend routes as products
  if (FRONTEND_PREFIXES.has(country)) {
    return null;
  }

  const url = `${BASE_API_URL}/api/${country}/${slug}`;
  const res = await fetch(url, { cache: "no-store" });

  console.log(`🌍 Fetching: ${url}`);
  console.log(`🔢 Status: ${res.status}`);

  if (res.status === 301 || res.status === 302) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      // ignore
    }
    if (data.redirect) {
      const canonicalPath = data.redirect.replace("/api/", "/");
      redirect(canonicalPath);
    } else {
      throw new Error(`❌ Redirect status but no redirect key in body`);
    }
  }

  if (res.status === 404) {
    console.warn(`❌ Product not found: ${country}/${slug}`);
    return null;
  }

  if (!res.ok) {
    throw new Error(`❌ Failed to fetch product data (${res.status})`);
  }

  const product = await res.json();
  console.log("✅ Product fetched:", {
    slug: product.slug,
    condition: product.condition?.slug,
    town: product.user?.town,
  });
  return product;
}

/**
 * Fetch related products
 */
async function getRelatedProducts(country, slug) {
  try {
    if (FRONTEND_PREFIXES.has(country)) return [];
    const res = await fetch(`${BASE_API_URL}/api/${country}/${slug}/related/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

/**
 * Dynamic page metadata
 */
export async function generateMetadata({ params: { region, slug } }) {
  // 🚫 Don’t try to build product metadata for frontend routes
  if (FRONTEND_PREFIXES.has(region)) {
    return {
      title: "Upfrica",
      description: "Buy and sell on Upfrica.",
    };
  }

  const product = await getProductData(region, slug);
  if (!product) return notFound();

  const conditionSlug = product.condition?.slug || "brand-new";
  const citySlug =
    product.user?.town?.toLowerCase().replace(/\s+/g, "-") || "accra";

  return {
    title: `${product.title} – ${product.user?.country || "Upfrica"}`,
    description: product.description?.body || "",
    alternates: {
      canonical: `https://www.upfrica.com/${region}/${product.slug}-${conditionSlug}-${citySlug}`,
    },
  };
}

/**
 * Server-rendered Product Page
 */
export default async function ProductPage({ params: { region, slug } }) {
  // ✅ If a frontend route slips in here, bounce to its real page
  if (FRONTEND_PREFIXES.has(region)) {
    redirect(`/${region}/${slug}`);
  }

  const product = await getProductData(region, slug);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(region, slug);

  // 📍 Robust, non-hardcoded location for RelatedProducts
  const regionLower = (region || "").toLowerCase();
  const locationDisplay =
    product.seller_country ||
    product.user?.country ||
    REGION_TO_COUNTRY[regionLower] ||
    "Upfrica";

  return (
    <>
      
      <main className="w-full max-w-[1380px] mx-auto py-8 px-4 sm:px-5 lg:px-8 xl:px-[4rem] 2xl:px-[5rem]">
        <ProductDetailSection
          product={product}
          relatedProducts={relatedProducts}
        />
        <RelatedProducts
          relatedProducts={relatedProducts}
          productSlug={product.slug}
          productTitle={product.title}
          location={locationDisplay}
        />
      </main>
      <Footer />
    </>
  );
}