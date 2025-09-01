"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiAdjustments, HiChevronRight, HiSearch } from "react-icons/hi";
import { BASE_API_URL } from "@/app/constants";

// ✅ use the robust image helpers you already ship
import { pickProductImage, fixImageUrl, FALLBACK_IMAGE } from "@/lib/image";

/* ---------------- helpers ---------------- */
function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}
function Skeleton({ className = "" }) {
  return (
    <div
      className={cx(
        "animate-pulse bg-gray-200/70 dark:bg-neutral-800 rounded",
        className
      )}
    />
  );
}
function ShopCardSkeleton() {
  return (
    <div className="border rounded-xl p-3 bg-white dark:bg-neutral-900 shadow-sm">
      <Skeleton className="h-28 w-full rounded-lg mb-3" />
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  );
}

/** Product-first hero image for a shop (product → banner → default). */
function pickShopCardImage(shop) {
  // 1) Nested "latest product" shapes we commonly see from APIs
  const nestedCandidates = [
    shop?.latest_product,
    shop?.last_product,
    shop?.latest_listing,
    shop?.last_listing,
    shop?.product, // some feeds use a single nested product
  ];
  for (const obj of nestedCandidates) {
    if (obj && typeof obj === "object") {
      const u = pickProductImage(obj);
      if (u && u !== FALLBACK_IMAGE) return u;
    }
  }

  // 2) Flat fields that often store a product image url directly
  const directKeys = [
    "product_image_url",
    "latest_product_image",
    "last_product_image",
    "featured_product_image",
    "hero_product_image",
    "product_image", // just in case
  ];
  for (const k of directKeys) {
    const v = shop?.[k];
    if (typeof v === "string" && v.trim()) return fixImageUrl(v);
  }

  // 3) Arrays of product-like objects (take the newest/first)
  const arrays = [shop?.recent_products, shop?.products, shop?.listings];
  for (const arr of arrays) {
    if (Array.isArray(arr) && arr.length) {
      const u = pickProductImage(arr[0]);
      if (u && u !== FALLBACK_IMAGE) return u;
    }
  }

  // 4) Fall back to a shop banner/cover/hero/logo
  const bannerKeys = [
    "top_banner",
    "shop_banner",
    "banner",
    "cover_image",
    "hero_image",
    "shop_logo",
  ];
  for (const k of bannerKeys) {
    const v = shop?.[k];
    if (typeof v === "string" && v.trim()) return fixImageUrl(v);
  }

  // 5) Absolute last resort
  return FALLBACK_IMAGE;
}

/* ---------------- cards ---------------- */
function ShopCard({ shop, region, badge }) {
  const hero = pickShopCardImage(shop);
  const logo = shop?.shop_logo ? fixImageUrl(shop.shop_logo) : null;

  return (
    <article className="group border rounded-xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative h-28 w-full">
        <Image
          src={hero}
          alt={`${shop.name} featured product`}
          fill
          sizes="(max-width: 1280px) 100vw, 33vw"
          className="object-cover bg-gray-100 dark:bg-neutral-800"
        />
        {badge ? (
          <div className="absolute left-2 top-2 text-xs px-2 py-1 rounded-full bg-amber-600 text-white shadow">
            {badge}
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-white dark:bg-neutral-900">
            {logo ? (
              <Image
                src={logo}
                alt={`${shop.name} logo`}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 dark:bg-neutral-800" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{shop.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {shop.town}
              {shop.country_name ? `, ${shop.country_name}` : ""}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
          {shop.active_listings}+ items • Fast delivery
        </p>

        <Link
          href={`/${region}/shops/${shop.slug}`}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          View shop <HiChevronRight />
        </Link>
      </div>
    </article>
  );
}

/* ---------------- list header ---------------- */
function FiltersBar({ search, setSearch, sort, setSort, onOpenFilters, total }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops…"
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <option value="featured_first">Featured first</option>
          <option value="listings_desc">Most Listings</option>
          <option value="name_asc">Name A–Z</option>
        </select>
        <button
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <HiAdjustments className="w-4 h-4" />
          Filters
          {typeof total === "number" ? (
            <span className="ml-1 text-xs text-gray-500">({total})</span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

/* ---------------- main ---------------- */
export default function ShopsPageClient({
  region,
  initialFeatured,
  initialShops,
}) {
  const featured = (initialFeatured?.results || initialFeatured?.shops || [])
    .filter(Boolean)
    .map((s) => ({ ...s, __featured: true }));
  const initial = (initialShops?.results || initialShops?.shops || []).filter(
    Boolean
  );

  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(Boolean(initialShops?.next));
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured_first");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // De-dup + prefer featured copy; then filter + sort
  const view = useMemo(() => {
    const merged = [...featured, ...items];
    const byKey = new Map();
    for (const s of merged) {
      const key = String(s?.slug || s?.id || "");
      if (!key) continue;
      const prev = byKey.get(key);
      if (!prev || (s.__featured && !prev.__featured)) {
        byKey.set(key, {
          ...prev,
          ...s,
          __featured: !!(s.__featured || prev?.__featured),
        });
      }
    }
    let v = Array.from(byKey.values());

    if (search.trim()) {
      const q = search.toLowerCase();
      v = v.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          (s.town || "").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "listings_desc":
        v.sort(
          (a, b) => (b.active_listings || 0) - (a.active_listings || 0)
        );
        break;
      case "name_asc":
        v.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      default:
        v.sort(
          (a, b) => (b.__featured ? 1 : 0) - (a.__featured ? 1 : 0)
        );
        break;
    }
    return v;
  }, [items, featured, search, sort]);

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const urls = [
      `${BASE_API_URL}/api/shops/search/?entitled=1&page=${next}`,
      `${BASE_API_URL}/api/shops/?page=${next}`,
    ];
    let data = null;
    for (const u of urls) {
      try {
        const r = await fetch(u, { headers: {}, cache: "no-store" });
        if (r.ok) {
          data = await r.json();
          break;
        }
      } catch {}
    }
    const extra = (data?.results || data?.shops || []).filter(Boolean);
    setItems((prev) => [...prev, ...extra]);
    setPage(next);
    setHasMore(Boolean(data?.next) && extra.length > 0);
    setLoadingMore(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* hero */}
      <header className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="relative h-40 sm:h-56 w-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-neutral-800 dark:to-neutral-700" />
        <div className="p-4 sm:p-6">
          <nav className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            <span className="font-medium">Shops</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-semibold">Discover Shops</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 max-w-3xl">
            Explore active stores from verified sellers on Upfrica. Featured
            shops are promoted by Upfrica or partners.
          </p>
        </div>
      </header>

      {/* controls */}
      <div className="mt-6">
        <FiltersBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
          total={view.length}
        />
      </div>

      {/* grid */}
      <main className="mt-6">
        {view.length === 0 ? (
          <div className="border rounded-xl p-10 text-center bg-white dark:bg-neutral-900">
            <p className="text-gray-700 dark:text-gray-300">
              No shops to show yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {view.map((shop) => (
              <ShopCard
                key={shop.slug || shop.id}
                shop={shop}
                region={region}
                badge={shop.__featured ? "Sponsored" : null}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </main>

      {/* tiny JSON-LD list */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: view.slice(0, 20).map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/${region}/shops/${s.slug}`,
              name: s.name,
            })),
          }),
        }}
      />
    </div>
  );
}