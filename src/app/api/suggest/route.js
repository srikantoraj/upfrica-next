// src/app/api/suggest/route.js
import { NextResponse } from "next/server";

/** Build absolute URL for internal proxy to Django. */
function abs(req, path) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return `${proto}://${host}${path}`;
}

/** Try multiple upstream paths (works with/without /api and with /b prefix). */
async function fetchUpstream(req, search) {
  const candidates = [
    `/b/api/products/suggest${search}`,
    `/b/products/suggest${search}`,
    `/api/b/api/products/suggest${search}`,
    `/api/b/products/suggest${search}`,
  ];
  for (const p of candidates) {
    try {
      const url = abs(req, p);
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch {
      // try next
    }
  }
  return null;
}

/** Normalize Django payload → UI shape { queries, brands, categories, products } */
function normalizePayload(data) {
  if (!data || typeof data !== "object") {
    return { queries: [], brands: [], categories: [], products: [] };
  }

  // If the backend already returns the UI shape, just pass it through.
  if (
    ("queries" in data || "products" in data || "categories" in data || "brands" in data) &&
    !data.groups
  ) {
    return {
      queries: data.queries || [],
      brands: data.brands || [],
      categories: data.categories || [],
      products: data.products || [],
    };
  }

  // New Django view shape: { items, groups: { categories, products, brands, shortcuts } }
  const groups = data.groups || {};
  const products = Array.isArray(groups.products) ? groups.products : [];

  // Map product fields to what the UI expects.
  const mappedProducts = products.map((p) => ({
    ...p,
    title: p.title || p.label || "",
    thumbnail: p.thumbnail || p.image || p.image_url || null,
    frontend_url: p.frontend_url || p.href || null,
  }));

  return {
    queries: data.queries || [], // usually not provided by Django; keep empty
    brands: groups.brands || [],
    categories: groups.categories || [],
    products: mappedProducts,
  };
}

export async function GET(req) {
  const url = new URL(req.url);
  const { search } = url;

  // 1) Try upstream
  const upstream = await fetchUpstream(req, search);
  if (upstream) {
    const normalized = normalizePayload(upstream);
    const res = NextResponse.json(normalized);
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res;
  }

  // 2) Fallbacks (no backend route or in dev)
  const params = url.searchParams;
  const q = (params.get("q") || "").trim().toLowerCase();

  const fallbackTrending = [
    "phones under GH₵500",
    "shea butter",
    "human hair kumasi",
    "spice grinder",
    "jollof pot",
    "ring light",
  ];

  // When no q (e.g., type=trending), return trending terms.
  if (!q) {
    const res = NextResponse.json({ queries: fallbackTrending, brands: [], categories: [], products: [] });
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res;
  }

  // naive suggest fallback
  const bank = [
    ...fallbackTrending,
    "iphone 12",
    "android charger",
    "gas cooker",
    "ceiling fan",
    "smart tv",
    "power bank",
    "kids bicycle",
  ]
    .filter((s) => s.toLowerCase().includes(q))
    .slice(0, 6);

  const res = NextResponse.json({
    queries: bank,
    brands: [],
    categories: [],
    products: [],
  });
  res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
  return res;
}