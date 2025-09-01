// src/app/(pages)/[region]/shops/page.jsx
import { cookies } from "next/headers";
import { BASE_API_URL } from "@/app/constants";
import ShopsPageClient from "./ShopsPageClient";

/* ---------------- utils ---------------- */
function authHeaders() {
  const t = cookies().get("auth_token")?.value || cookies().get("token")?.value;
  return t ? { Authorization: `Token ${t}` } : {};
}

async function getJSON(url) {
  try {
    const r = await fetch(url, { headers: authHeaders(), next: { revalidate: 300 } });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/**
 * Featured/sponsored shops.
 * Tries a few sensible endpoints; returns [] on failure.
 */
async function fetchFeatured(page = 1) {
  const candidates = [
    `${BASE_API_URL}/api/shops/search/?featured=1&page=${page}`,
    `${BASE_API_URL}/api/shops/featured/?page=${page}`,
    `${BASE_API_URL}/api/shops/search/?sponsored=1&page=${page}`,
  ];
  for (const u of candidates) {
    const data = await getJSON(u);
    if (data && (data.results || data.shops)) return data;
  }
  return { results: [] };
}

/**
 * Active (entitled) shops with at least one published product.
 * Falls back to a broader list if your bespoke endpoint is unavailable.
 */
async function fetchActive(page = 1) {
  const candidates = [
    `${BASE_API_URL}/api/shops/search/?entitled=1&page=${page}`,
    `${BASE_API_URL}/api/shops/?page=${page}`, // fallback
  ];
  for (const u of candidates) {
    const data = await getJSON(u);
    if (data && (data.results || data.shops)) return data;
  }
  return { results: [] };
}

export default async function Page({ params, searchParams }) {
  const region = String(params?.region || "").toLowerCase();
  const page = Number(searchParams?.page || 1);

  const [featured, active] = await Promise.all([
    fetchFeatured(1),
    fetchActive(page),
  ]);

  return (
    <ShopsPageClient
      region={region}
      initialFeatured={featured}
      initialShops={active}
    />
  );
}