import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import { buildBaseMetadata, buildShopTypeMetadata } from "@/lib/seo/builders";
import ShopTypePageClient from "./ShopTypePageClient";

function getAuthHeaders() {
  const t = cookies().get("auth_token")?.value || cookies().get("token")?.value;
  return t ? { Authorization: `Token ${t}` } : {};
}

async function fetchShopType(slug) {
  try {
    // ✅ use explicit slug route you added
    const r = await fetch(`${BASE_API_URL}/api/shoptypes/slug/${slug}/`, {
      headers: getAuthHeaders(),
      next: { revalidate: 300 },
    });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

async function fetchTypeShops(slug, page = 1, typeId = null) {
  const headers = getAuthHeaders();
  const urls = [
    // if you create this endpoint later, it will be used automatically
    `${BASE_API_URL}/api/shoptypes/${slug}/shops/?page=${page}`,
    // current search endpoint with a shoptype slug param
    `${BASE_API_URL}/api/shops/search/?shoptype=${encodeURIComponent(slug)}&page=${page}`,
  ];
  // optional: if you decide to support id filtering
  if (typeId) {
    urls.push(`${BASE_API_URL}/api/shops/search/?shoptype_id=${typeId}&page=${page}`);
    urls.push(`${BASE_API_URL}/api/shops/?shoptype=${typeId}&page=${page}`);
  }
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers, next: { revalidate: 120 } });
      if (r.ok) return await r.json();
    } catch {}
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { region, slug } = params;
  const cc = String(region || "").toLowerCase();
  const type = await fetchShopType(slug);

  if (!type) {
    return buildBaseMetadata({
      title: "Shop Types",
      description: "Browse categories and discover verified shops on Upfrica.",
      canonicalPath: `/${cc}/shoptypes/${slug}`,
      images: [],
      type: "website",
    });
  }
  return buildShopTypeMetadata({ type, region: cc, slug });
}

export default async function Page({ params, searchParams }) {
  const { region, slug } = params;
  const type = await fetchShopType(slug); // may be null; client can still fetch
  const initialShops = await fetchTypeShops(slug, Number(searchParams?.page || 1), type?.id || null);

  return (
    <ShopTypePageClient
      slug={slug}
      region={String(region || "").toLowerCase()}
      initialType={type}
      initialShops={initialShops}
    />
  );
}