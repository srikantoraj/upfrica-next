// src/app/api/suggest/route.js
import { NextResponse } from "next/server";

/** Build absolute URL against current host (works on Vercel/Node runtimes). */
function abs(req, path) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return `${proto}://${host}${path}`;
}

/** Hit Django via our unified proxy (/api/...); proxy takes care of DRF slashes. */
async function fetchUpstream(req, search) {
  const url = abs(req, `/api/products/suggest${search || ""}`);
  const res = await fetch(url, { cache: "no-store" });
  if (res.ok) return res.json();
  return null;
}

/** Normalize Django payload → UI shape { queries, brands, categories, products } */
function normalizePayload(data) {
  if (!data || typeof data !== "object") {
    return { queries: [], brands: [], categories: [], products: [] };
  }

  // If already in UI shape, pass through.
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

  // Newer backend shape: { groups: { categories, products, brands, ... } }
  const groups = data.groups || {};
  const products = Array.isArray(groups.products) ? groups.products : [];

  const mappedProducts = products.map((p) => ({
    ...p,
    title: p.title || p.label || "",
    thumbnail: p.thumbnail || p.image || p.image_url || null,
    frontend_url: p.frontend_url || p.href || null,
  }));

  return {
    queries: data.queries || [],
    brands: groups.brands || [],
    categories: groups.categories || [],
    products: mappedProducts,
  };
}

export async function GET(req) {
  const url = new URL(req.url);
  const { search } = url;

  // 1) Try upstream via unified proxy
  const upstream = await fetchUpstream(req, search);
  if (upstream) {
    const normalized = normalizePayload(upstream);
    const res = NextResponse.json(normalized);
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res;
  }

  // 2) Fallback (dev or backend missing)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();

  const fallbackTrending = [
    "phones under GH₵500",
    "shea butter",
    "human hair kumasi",
    "spice grinder",
    "jollof pot",
    "ring light",
  ];

  if (!q) {
    const res = NextResponse.json({
      queries: fallbackTrending,
      brands: [],
      categories: [],
      products: [],
    });
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res;
  }

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

  const res = NextResponse.json({ queries: bank, brands: [], categories: [], products: [] });
  res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
  return res;
}