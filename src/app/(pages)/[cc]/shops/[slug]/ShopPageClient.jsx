// app/(pages)/[region]/shops/[slug]/ShopPageClient.jsx
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";

import { pickProductImage, fixImageUrl, FALLBACK_IMAGE } from '@/lib/image';

import Link from "next/link";
import { useSelector } from "react-redux";
import qs from "query-string";

import { API_BASE, SITE_BASE_URL, BASE_API_URL } from "@/app/constants";
const IMAGE_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || SITE_BASE_URL || BASE_API_URL;

import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineFilter,
} from "react-icons/ai";
import { FaStar, FaPhoneAlt, FaCommentDots } from "react-icons/fa";

import ShopBadges from "../ShopBadges";

import ShopCard from "@/components/home/ProductList/ShopCard";
import ShopFAQSection from "@/components/ShopFAQSection";
import ProductCardSkeleton from "./ProductCardSkeleton";
import SearchResultSkeleton from "./SearchResultSkeleton";
import PriceRange from "./PriceRange";
import ShopEditModal from "./ShopEditModal";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
import ShopProfileCard from "./ShopProfileCard";
import DirectBuyPopup from "@/components/DirectBuyPopup";

import ShopRichArticle from "@/components/ShopRichArticle";

// ⬇️ Reusable contact sheet + PDP-aligned gating helpers
import ContactSheet from "@/components/ContactSheet";
import { canDisplaySellerContact, pickShopPhone } from "@/lib/seller-contact";

const PAGE_SIZE = 20;

/* ───────────────────────────── helpers ───────────────────────────── */
const mapSort = (val) => {
  if (val === "price") return "price_cents";
  if (val === "-price") return "-price_cents";
  return val;
};

const absolutize = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  const base = (IMAGE_BASE || "").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

const pickResultImage = (p) =>
  p?.thumbnail ||
  p?.image_objects?.[0]?.image_url ||
  p?.image_objects?.[0]?.url ||
  (Array.isArray(p?.product_images) && p.product_images[0]) ||
  (Array.isArray(p?.ordered_product_images) && p.ordered_product_images[0]) ||
  (Array.isArray(p?.images) && p.images[0]) ||
  null;


// Make sure every product carries a ready-to-use image in the places most cards look.
const hydrateCardImage = (p) => {
  const url = pickProductImage(p); // already runs through fixImageUrl + fallback
  if (!url) return p;
  return {
    ...p,
    // single-field styles
    thumbnail: url,
    image_url: url,
    image: url,
    main_image: url,
    product_image_url: url,
    // array styles
    product_images: Array.isArray(p.product_images) && p.product_images.length
      ? p.product_images
      : [url],
    images: Array.isArray(p.images) && p.images.length ? p.images : [url],
    image_objects: Array.isArray(p.image_objects) && p.image_objects.length
      ? p.image_objects
      : [{ url }],
  };
};


/* ─────────────────────────── event helpers ─────────────────────────── */
const hasFiredShopContactFor = (slug) => {
  try {
    return sessionStorage.getItem(`scf:${slug}`) === "1";
  } catch {
    return false;
  }
};
const markFiredShopContactFor = (slug) => {
  try {
    sessionStorage.setItem(`scf:${slug}`, "1");
  } catch {}
};
const getOrCreateSessionId = () => {
  try {
    const k = "upfrica_sid";
    let id = localStorage.getItem(k);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(k, id);
    }
    return id;
  } catch {
    return "";
  }
};
const postShopContactClick = async (slug, source = "shop") => {
  const url = `${API_BASE}/shops/${slug}/event/`;
  const payload = JSON.stringify({
    event: "contact_click",
    session_id: getOrCreateSessionId(),
    source,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
  } catch {
    // fall-through to fetch
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: payload,
    });
  } catch {
    // silent fail – UI should not block on analytics
  }
};

/* ─────────────────────────── pagination ─────────────────────────── */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleClick = (p) => {
    if (p >= 1 && p <= totalPages && p !== currentPage) onPageChange(p);
  };

  const pages = () => {
    if (isMobile)
      return totalPages <= 2 ? [1, ...(totalPages === 2 ? [2] : [])] : [1, 2, "…"];
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "…", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages];
  };

  return (
    <div className="mt-8 flex justify-center overflow-x-auto">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        <AiOutlineLeft className="mr-1" /> Prev
      </button>

      {pages().map((p, i) =>
        p === "…" ? (
          <span key={i} className="px-3 py-1 text-gray-500">…</span>
        ) : (
          <button
            key={i}
            onClick={() => handleClick(p)}
            className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${
              p === currentPage ? "bg-violet-700 text-white font-semibold" : ""
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        Next <AiOutlineRight className="ml-1" />
      </button>
    </div>
  );
};

/* ───────────────────────────── main page ─────────────────────────── */
export default function ShopPageClient({ slug }) {
  // auth
  const { user } = useSelector((s) => s.auth);

  // shop meta
  const [shop, setShop] = useState(null);
  const [mainError, setMainError] = useState(null);

  // products & pagination
  const [mainProducts, setMainProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [mainLoading, setMainLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [shopCategories, setShopCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [shopConditions, setShopConditions] = useState([]);
  const [conditionsLoading, setConditionsLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedConditionId, setSelectedConditionId] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounce = useRef();

  // sidebar & edit
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // direct-buy popup
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);

  // contact sheet open
  const [contactOpen, setContactOpen] = useState(false);

  // mobile flag for bottom bar
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ─────────────── fetch shop + unfiltered products ─────────────── */
  const fetchMain = async (signal) => {
    setMainLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/shops/${slug}/products/?page=${currentPage}`,
        { signal }
      );
      if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
// in fetchMain()
const data = await res.json();
setMainProducts((data.results || []).map(hydrateCardImage));
setShop(data.shop || null);
setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      setMainError(null);
    } catch (err) {
      if (err.name !== "AbortError") setMainError(err);
    } finally {
      setMainLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchMain(ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, currentPage]);

  /* ─────────────── fetch categories & conditions (once) ─────────── */
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      setCategoriesLoading(true);
      try {
        const r = await fetch(`${API_BASE}/shops/${slug}/categories/`, {
          signal: ctrl.signal,
        });
        const data = r.ok ? await r.json() : [];
        setShopCategories(Array.isArray(data) ? data : []);
      } catch {
        setShopCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    })();

    (async () => {
      setConditionsLoading(true);
      try {
        const r = await fetch(`${API_BASE}/shops/${slug}/conditions/`, {
          signal: ctrl.signal,
        });
        const data = r.ok ? await r.json() : [];
        setShopConditions(Array.isArray(data) ? data : []);
      } catch {
        setShopConditions([]);
      } finally {
        setConditionsLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [slug]);

  /* ─────────────── build & fetch filtered products ──────────────── */
  const buildFilterQS = () => {
    const params = {};
    if (selectedCategoryId) params.category = selectedCategoryId;
    if (selectedConditionId) params.condition = selectedConditionId;
    if (priceMin !== 0) params.min_price = priceMin;
    if (priceMax !== 1000) params.max_price = priceMax;
    if (sortOption) params.ordering = mapSort(sortOption);
    if (searchQuery.trim()) params.q = searchQuery.trim();
    params.page = currentPage;
    return qs.stringify(params);
  };

  useEffect(() => {
    const noFilters =
      !selectedCategoryId &&
      !selectedConditionId &&
      priceMin === 0 &&
      priceMax === 1000 &&
      !sortOption &&
      !searchQuery.trim();

    if (noFilters) {
      setFilterProducts([]);
      return;
    }

    const ctrl = new AbortController();
    (async () => {
      setFilterLoading(true);
      try {
        const qsStr = buildFilterQS();
        const res = await fetch(
          `${API_BASE}/shops/${slug}/products/filter/?${qsStr}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error(`Filter failed (HTTP ${res.status})`);
const data = await res.json();
setFilterProducts((data.results || []).map(hydrateCardImage));
setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setFilterLoading(false);
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategoryId,
    selectedConditionId,
    priceMin,
    priceMax,
    sortOption,
    searchQuery,
    currentPage,
    slug,
  ]);

  /* ─────────────── debounced search dropdown ─────────────── */
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    searchDebounce.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const r = await fetch(
          `${API_BASE}/shops/${slug}/products/filter/?q=${encodeURIComponent(
            searchQuery
          )}&page=1`
        );
        const data = r.ok ? await r.json() : { results: [] };
        setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
    return () => clearTimeout(searchDebounce.current);
  }, [searchQuery, slug]);

  /* ─────────────── buy → related popup ─────────────── */
  const handleBuy = async (product) => {
    setCurrentProduct(product);
    setRelatedLoading(true);
    try {
      const slugToUse = product.slug || product.seo_slug;
      const res = await fetch(`${API_BASE}/products/${slugToUse}/related/`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const d = await res.json();
      setRelatedProducts(d.results || []);
      setRelatedError(null);
    } catch (err) {
      setRelatedProducts([]);
      setRelatedError(err);
    } finally {
      setRelatedLoading(false);
      setIsPopupOpen(true);
    }
  };

  const displayProducts = filterProducts.length ? filterProducts : mainProducts;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const closeSidebar = () => setIsSidebarOpen(false);

  /* ─────────────── contact gating (same rules as PDP) ─────────────── */
  const sellerEntitlements = Array.isArray(shop?.entitlements)
    ? shop.entitlements
    : undefined;

  const stateOf = (name) => {
    if (name === "allow_display_seller_contact") return shop?.contact_display_state;
    if (name === "storefront_unlock") return shop?.storefront_state;
    return undefined;
  };

  const gate = canDisplaySellerContact({
    entitlements: sellerEntitlements,
    stateOf,
    fallbackIfUnknown: false,
  });

  const phoneToShow = useMemo(() => {
    if (!gate.allowed) return null;
    if (Array.isArray(shop?.phones) && shop.phones.length) return pickShopPhone(shop.phones);
    const legacy = shop?.seller_contact_number;
    if (legacy) {
      return {
        display: legacy,
        e164: legacy,
        is_verified: !!shop?.seller_contact_verified,
      };
    }
    return null;
  }, [gate.allowed, shop?.phones, shop?.seller_contact_number, shop?.seller_contact_verified]);

  const rawDisplay = phoneToShow?.display || phoneToShow?.e164 || "";
  const e164Digits =
    phoneToShow?.e164 || phoneToShow?.number || rawDisplay.replace(/[^\d+]/g, "");
  const isVerifiedSeller = !!(
    phoneToShow?.is_verified ||
    shop?.seller_contact_verified ||
    shop?.user?.kyc_verified
  );

  /* ─────────────── contact click logging (once per session) ───────── */
  const isOwnerOrStaff = !!(
    (user?.id && shop?.user?.id && user.id === shop.user.id) ||
    user?.admin ||
    user?.is_staff ||
    user?.is_superuser
  );

  const fireShopContactOnce = useCallback(() => {
    if (!slug || isOwnerOrStaff) return;
    if (hasFiredShopContactFor(slug)) return;
    markFiredShopContactFor(slug);
    postShopContactClick(slug, "shop");
  }, [slug, isOwnerOrStaff]);

  // When the sheet opens (from any button), log exactly once per session.
  useEffect(() => {
    if (contactOpen) fireShopContactOnce();
  }, [contactOpen, fireShopContactOnce]);

  const handleContactOpen = useCallback(() => {
    setContactOpen(true);
  }, []);

  /* ───────────────────────────── render ───────────────────────────── */
  if (mainError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        <p>Failed to load shop. Please try again later.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-900"
      style={{ backgroundColor: shop?.bg_color || "#E8EAED" }}
    >
      {/* HERO */}
      <section className="relative flex justify-center items-center">
        {mainLoading || !shop ? (
          <HeroSectionSkeleton />
        ) : (
          <ShopProfileCard shop={shop} user={user} setIsEditOpen={setIsEditOpen} />
        )}
      </section>

      {/* Row container under the hero */}
      <div className="md:sticky md:top-2 z-20" role="region" aria-label="Shop badges and contact">
        <div className="mx-auto max-w-6xl px-3 md:px-4">
          <div className="flex items-center justify-between gap-3 md:gap-4 md:flex-nowrap">
            {/* badges block */}
            <div className="min-w-0 flex-1">
              <ShopBadges
                showContact
                hasContact={!!phoneToShow}
                sticky={false}
                onContactClick={() => {
                  setContactOpen(true); // opening sheet logs via effect
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <ShopEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        shop={shop}
        onSave={setShop}
      />

      <main className="mx-auto max-w-6xl gap-8 px-2 py-10 pb-32 md:grid md:grid-cols-[240px_1fr]">
        {/* DESKTOP FILTERS */}
        <aside className="hidden md:block space-y-6">
          <h2 className="text-xl font-semibold">Filters</h2>

          {/* Category */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Category</label>
            {categoriesLoading ? (
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            ) : (
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Categories</option>
                {shopCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Condition */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Condition</label>
            {conditionsLoading ? (
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            ) : (
              <select
                value={selectedConditionId}
                onChange={(e) => {
                  setSelectedConditionId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Conditions</option>
                {shopConditions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sort */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Sort by</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
            </select>
          </div>

          {/* Price Range */}
          <PriceRange
            min={priceMin}
            max={priceMax}
            onChangeMin={(v) => {
              setPriceMin(v);
              setCurrentPage(1);
            }}
            onChangeMax={(v) => {
              setPriceMax(v);
              setCurrentPage(1);
            }}
            className="p-5 bg-white border rounded drop-shadow"
          />

          {/* Ratings (static) */}
          <div className="p-5 bg-white border rounded drop-shadow">
            <h2 className="mb-2 font-semibold">Ratings</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <span className="ml-2 text-sm">4.5/5</span>
            </div>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-white p-6 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={closeSidebar} className="p-1 hover:bg-gray-100 rounded">
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All Categories</option>
              {shopCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              value={selectedConditionId}
              onChange={(e) => {
                setSelectedConditionId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All Conditions</option>
              {shopConditions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Sort by</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
            </select>
          </div>

          {/* Price Range */}
          <PriceRange
            min={priceMin}
            max={priceMax}
            onChangeMin={(v) => {
              setPriceMin(v);
              setCurrentPage(1);
            }}
            onChangeMax={(v) => {
              setPriceMax(v);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* MAIN CONTENT */}
        <section className="relative">
          {/* SEARCH BAR */}
          <div className="mb-6 relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search products in ${shop?.name || "this shop"}...`}
              className="w-full rounded-full border border-gray-700 px-10 py-2 focus:outline-none"
            />
            {searchQuery ? (
              <AiOutlineClose
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
                onClick={() => setSearchQuery("")}
              />
            ) : (
              <AiOutlineFilter
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700 md:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* live dropdown */}
            {searchQuery && (
              <div className="absolute left-0 right-0 z-20 mt-2 rounded bg-white shadow">
                {searchLoading
                  ? [...Array(3)].map((_, i) => <SearchResultSkeleton key={i} />)
                  : (searchResults || [])
                      .slice(0, 5)
                      .map((p) => {
                        const href =
                          p.frontend_url ||
                          (p.seller_country || p.listing_country_code
                            ? `/${(p.seller_country || p.listing_country_code).toLowerCase()}/${p.seo_slug || p.slug}`
                            : `/${p.seo_slug || p.slug}`);

                        const rawImg = pickResultImage(p);
                        const img = absolutize(rawImg) || "/placeholder.png";
                        const priceCents =
                          typeof p.price_cents === "number" ? p.price_cents : 0;
                        const currency = p.price_currency || "USD";

return (
  <Link key={p.id ?? p.slug} href={href} className="no-underline">
    <div className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50">
      <Image
        src={fixImageUrl(img) || pickProductImage(p) || FALLBACK_IMAGE}
        alt={p.title || "Product image"}
        width={48}
        height={48}
        className="h-12 w-12 rounded object-cover bg-gray-100"
        // optional: if you still get odd hosts during dev, you can bypass optimization:
        // unoptimized
      />
      <div>
        <p className="text-sm font-medium">{p.title}</p>
        <p className="text-xs text-gray-500">
          {currency} {(priceCents / 100).toFixed(2)}
        </p>
      </div>
    </div>
  </Link>
);
                      })}
              </div>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {mainLoading || filterLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : displayProducts.map((p, i) => (
                  <ShopCard
                    key={p.id ?? p.slug ?? `p-${i}`}
                    product={hydrateCardImage(p)}
                    onBuy={() => handleBuy(p)}
                  />
                ))}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Rich SEO Article */}
          <ShopRichArticle html={shop?.seo_content} schema={shop?.article_schema} />

          {/* FAQs */}
          <ShopFAQSection shop={shop} faqs={shop?.faqs} faqSchema={shop?.faq_schema} />
        </section>
      </main>

      {/* MOBILE BOTTOM MENU */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow z-50 md:hidden">
          <button onClick={toggleSidebar} className="flex flex-col items-center text-xs text-gray-700">
            <AiOutlineFilter className="text-2xl" />
            Menu
          </button>

          <button onClick={() => { /* open chat */ }} className="flex flex-col items-center text-xs text-gray-700">
            <FaCommentDots className="text-2xl" />
            Chat
          </button>

          {phoneToShow && (
            <button
              onClick={handleContactOpen}
              className="flex flex-col items-center text-xs text-gray-700"
              aria-haspopup="dialog"
              aria-controls="contact-sheet"
            >
              <FaPhoneAlt className="text-2xl" />
              Contact Seller
            </button>
          )}
        </div>
      )}

      {/* DIRECT BUY POPUP */}
      {currentProduct && (
        <DirectBuyPopup
          product={currentProduct}
          isVisible={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          relatedProducts={relatedProducts}
          isLoading={relatedLoading}
          error={relatedError}
        />
      )}

      {/* CONTACT SHEET */}
      {phoneToShow && (
        <ContactSheet
          id="contact-sheet"
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          shopName={shop?.name || "Seller"}
          phoneDisplay={rawDisplay}
          e164={e164Digits}
          verified={isVerifiedSeller}
          hoursText={shop?.contact_hours || "Available Mon–Sat, 9am–6pm"}
        />
      )}
    </div>
  );
}