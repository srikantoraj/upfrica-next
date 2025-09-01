"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiAdjustments, HiChevronRight, HiSearch } from "react-icons/hi";
import { BASE_API_URL } from "@/app/constants";

/* -------------------- utils -------------------- */
function cx(...xs) { return xs.filter(Boolean).join(" "); }

function normalizeShop(s, region) {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    town: s.user?.town ?? s.town ?? "",
    country_name: s.user?.country_name ?? s.country_name ?? "",
    active_listings: s.active_listings ?? 0,
    shop_logo: s.shop_logo || null,
    top_banner: s.top_banner || null,
    href: `/${region}/shops/${s.slug}`,
    // keep any additional fields if your API adds later
  };
}

function parseListPayload(payload, region, typeSlug) {
  if (!payload) return { items: [], next: null, count: 0 };

  const results = payload.results ?? payload.shops ?? payload.items ?? payload.data ?? [];
  const next = payload.next ?? null;
  const count = payload.count ?? results.length;

  let items = (results || []).map((s) => normalizeShop(s, region));

  // Fallback filter: if we ended up calling a generic list endpoint
  // and each shop includes its shoptype, filter by slug here.
  if (typeSlug && results?.length && results[0]?.shoptype?.slug) {
    items = items.filter((_, i) => results[i].shoptype?.slug === typeSlug);
  }

  return { items, next, count };
}

/* -------------------- skeletons -------------------- */
function Skeleton({ className = "" }) {
  return <div className={cx("animate-pulse bg-gray-200/70 dark:bg-neutral-800 rounded", className)} />;
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

/* -------------------- small UI atoms -------------------- */
function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "px-3 py-1.5 rounded-full border text-sm transition",
        active
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
      )}
    >
      {children}
    </button>
  );
}

/* -------------------- card -------------------- */
function ShopCard({ shop, region }) {
  return (
    <article className="group border rounded-xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative h-28 w-full bg-gray-100 dark:bg-neutral-800">
        {shop.top_banner ? <Image src={shop.top_banner} alt="" fill className="object-cover" /> : null}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-white dark:bg-neutral-900">
            {shop.shop_logo ? <Image src={shop.shop_logo} alt={`${shop.name} logo`} fill className="object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{shop.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {shop.town}{shop.country_name ? `, ${shop.country_name}` : ""}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
          {shop.active_listings}+ items • Fast delivery
        </p>

        <Link
          href={shop.href || `/${region}/shops/${shop.slug}`}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          View shop <HiChevronRight />
        </Link>
      </div>
    </article>
  );
}

/* -------------------- filters -------------------- */
function FiltersBar({ search, setSearch, sort, setSort, onOpenFilters, total }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops in this category…"
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="listings_desc">Most Listings</option>
          <option value="name_asc">Name A–Z</option>
        </select>

        <button
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <HiAdjustments className="w-4 h-4" />
          Filters {typeof total === "number" ? <span className="ml-1 text-xs text-gray-500">({total})</span> : null}
        </button>
      </div>
    </div>
  );
}

function DesktopFilters({ cities, city, setCity }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-4 space-y-6">
        <div>
          <h4 className="font-semibold mb-2">City</h4>
          <div className="flex flex-wrap gap-2">
            <Chip active={city === ""} onClick={() => setCity("")}>All</Chip>
            {cities.map((c) => (
              <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileFiltersSheet({ open, onClose, cities, city, setCity }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-2xl p-4 shadow-xl">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={onClose} className="text-sm underline">Done</button>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">City</h4>
              <div className="flex flex-wrap gap-2">
                <Chip active={city === ""} onClick={() => setCity("")}>All</Chip>
                {cities.map((c) => (
                  <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- hero -------------------- */
function TypeHero({ type, region }) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="relative h-40 sm:h-56 w-full">
        {type?.banner_image_url ? (
          <Image src={type.banner_image_url} alt="" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-neutral-800 dark:to-neutral-700" />
        )}
      </div>
      <div className="p-4 sm:p-6">
        <nav className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          <Link href={`/${region}/shoptypes`} className="hover:underline">Shop Types</Link>
          <span className="mx-1.5">/</span>
          <span className="font-medium">{type?.name || "Category"}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-semibold">{type?.name || "Shop Type"}</h1>
        {type?.final_seo_description ? (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 max-w-3xl">
            {type.final_seo_description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

/* -------------------- main -------------------- */
export default function ShopTypePageClient({ slug, region, initialType, initialShops }) {
  const [type, setType] = useState(initialType || null);
  const [loadingType, setLoadingType] = useState(!initialType);
  const [error, setError] = useState("");

  const first = useMemo(() => parseListPayload(initialShops, region, slug), [initialShops, region, slug]);
  const [items, setItems] = useState(first.items);
  const [nextUrl, setNextUrl] = useState(first.next);
  const [count, setCount] = useState(first.count);
  const [loadingList, setLoadingList] = useState(!initialShops);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [city, setCity] = useState("");

  const cities = useMemo(
    () => Array.from(new Set(items.map((s) => s.town).filter(Boolean))).slice(0, 12),
    [items]
  );

  const view = useMemo(() => {
    let v = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      v = v.filter((s) => s.name.toLowerCase().includes(q) || (s.town || "").toLowerCase().includes(q));
    }
    if (city) v = v.filter((s) => s.town === city);
    switch (sort) {
      case "listings_desc":
        v.sort((a, b) => (b.active_listings || 0) - (a.active_listings || 0));
        break;
      case "name_asc":
        v.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      default:
        break;
    }
    return v;
  }, [items, search, city, sort]);

  const fetchJSON = useCallback(async (url) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }, []);

  // Client-side fetchers (used when SSR didn't preload)
  const fetchType = useCallback(async () => {
    setLoadingType(true);
    try {
      const t = await fetchJSON(`${BASE_API_URL}/api/shoptypes/slug/${slug}/`);
      setType(t);
    } catch (e) {
      setError("Could not load category.");
    } finally {
      setLoadingType(false);
    }
  }, [slug, fetchJSON]);

  const fetchFirstPage = useCallback(async () => {
    setLoadingList(true);
    setError("");
    const candidates = [
      `${BASE_API_URL}/api/shoptypes/${slug}/shops/?page=1`,                                 // future-friendly
      `${BASE_API_URL}/api/shops/search/?shoptype=${encodeURIComponent(slug)}&page=1`,       // if your search supports it
      `${BASE_API_URL}/api/shops/?page=1`,                                                   // fallback: client-filter by shoptype.slug
    ];
    for (const u of candidates) {
      try {
        const data = await fetchJSON(u);
        const parsed = parseListPayload(data, region, slug);
        setItems(parsed.items);
        setNextUrl(parsed.next);
        setCount(parsed.count);
        setLoadingList(false);
        return;
      } catch {}
    }
    setLoadingList(false);
    setError("No shops found for this category.");
  }, [slug, region, fetchJSON]);

  const loadMore = useCallback(async () => {
    if (!nextUrl) return;
    setLoadingMore(true);
    try {
      const data = await fetchJSON(nextUrl);
      const parsed = parseListPayload(data, region, slug);
      setItems((prev) => [...prev, ...parsed.items]);
      setNextUrl(parsed.next);
      setCount(parsed.count || count);
    } catch {}
    setLoadingMore(false);
  }, [nextUrl, fetchJSON, region, slug, count]);

  useEffect(() => {
    if (!initialType) fetchType();
    if (!initialShops) fetchFirstPage();
  }, [initialType, initialShops, fetchType, fetchFirstPage]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <TypeHero type={type} region={region} />

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

      <div className="mt-6 flex gap-6">
        <DesktopFilters cities={cities} city={city} setCity={setCity} />

        <main className="flex-1 min-w-0">
          {error ? (
            <div className="border rounded-xl p-10 text-center bg-white dark:bg-neutral-900">
              <p className="text-gray-700 dark:text-gray-300">{error}</p>
            </div>
          ) : null}

          {(loadingType || (loadingList && items.length === 0)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <ShopCardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {count} shop{count === 1 ? "" : "s"} • showing {view.length}
                </p>
              </div>

              {items.length === 0 ? (
                <div className="border rounded-xl p-10 text-center bg-white dark:bg-neutral-900">
                  <p className="text-gray-700 dark:text-gray-300">No shops yet in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {view.map((shop) => (
                    <ShopCard key={shop.slug || shop.id} shop={shop} region={region} />
                  ))}
                </div>
              )}

              {nextUrl ? (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </main>
      </div>

      <MobileFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        cities={cities}
        city={city}
        setCity={setCity}
      />

      {/* Minimal ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: view.slice(0, 20).map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: s.href,
              name: s.name,
            })),
          }),
        }}
      />
    </div>
  );
}