'use client';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    if (isMobile) {
      if (totalPages <= 2) return [1, ...(totalPages === 2 ? [2] : [])];
      return [1, 2, '...'];
    }

    if (totalPages <= 5) return [...Array(totalPages).keys()].map(i => i + 1);

    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="mt-8 flex justify-center overflow-x-auto">
      <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <AiOutlineLeft className="mr-1" />
          <span>Prev</span>
        </button>

        {getPageNumbers().map((page, i) =>
          typeof page === 'number' ? (
            <button
              key={i}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${
                page === currentPage ? 'bg-violet-700 text-white font-semibold' : ''
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={i} className="px-3 py-1 text-gray-500">...</span>
          )
        )}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <span>Next</span>
          <AiOutlineRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import ShopCard from '@/components/home/ProductList/ShopCard';
import ShopFAQSection from '@/components/ShopFAQSection';
import ProductCardSkeleton from './ProductCardSkeleton';
import SearchResultSkeleton from './SearchResultSkeleton';
import PriceRange from './PriceRange';
import ShopEditModal from './ShopEditModal';
import { FaCheckCircle, FaStar, FaEdit, FaPhoneAlt, FaCommentDots } from 'react-icons/fa';
import { AiOutlineSearch, AiOutlineClose, AiOutlineLeft, AiOutlineRight, AiOutlineFilter } from 'react-icons/ai';
import { HiOutlineCalendar } from 'react-icons/hi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import HeroSectionSkeleton from './HeroSectionSkeleton';
import { notFound } from 'next/navigation';


const PAGE_SIZE = 20;




export default function ShopPageClient({ slug }) {
    const { token, user } = useSelector((state) => state.auth);

    // --- UI state ---
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- Data loading ---
    const [shop, setShop] = useState(null);
    const [mainProducts, setMainProducts] = useState([]);
    const [mainLoading, setMainLoading] = useState(true);
    const [mainError, setMainError] = useState(null);

    const [shopCategories, setShopCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [shopConditions, setShopConditions] = useState([]);
    const [conditionsLoading, setConditionsLoading] = useState(true);

    // --- Filters ---
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
    const [selectedConditionSlug, setSelectedConditionSlug] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(1000);

    const [filterProducts, setFilterProducts] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);

    const shopType = shop?.shoptype?.name || '';

    const sidebarRef = useRef();

    // --- Fetch shop info & products ---
    useEffect(() => {
        const fetchMain = async () => {
            setMainLoading(true);
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/shops/${slug}/products/?page=${currentPage}`
                );
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setMainProducts(data.results || []);
                setShop(data.shop || null);
                setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
            } catch (err) {
                setMainError(err);
            } finally {
                setMainLoading(false);
            }
        };
        fetchMain();
    }, [slug, currentPage]);

    // --- Fetch categories & conditions ---
    useEffect(() => {
        fetch(`https://media.upfrica.com/api/shops/${slug}/categories/`)
            .then((r) => r.json())
            .then(setShopCategories)
            .finally(() => setCategoriesLoading(false));
        fetch(`https://media.upfrica.com/api/shops/${slug}/conditions/`)
            .then((r) => r.json())
            .then(setShopConditions)
            .finally(() => setConditionsLoading(false));
    }, [slug]);

    // --- Search suggestions ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            setSearchLoading(true);
            const res = await fetch(
                `https://media.upfrica.com/api/shops/${slug}/products/filter/?q=${encodeURIComponent(
                    searchQuery
                )}`
            );
            const data = await res.ok ? await res.json() : { results: [] };
            setSearchResults(data.results || []);
            setSearchLoading(false);
        }, 500);
        return () => clearTimeout(t);
    }, [searchQuery, slug]);

    // --- Fetch filtered products on filter change ---
    useEffect(() => {
        const noFilters =
            !selectedCategorySlug &&
            !selectedConditionSlug &&
            !sortOption &&
            priceMin === 0 &&
            priceMax === 1000;
        if (noFilters) {
            setFilterProducts([]);
            setFilterLoading(false);
            return;
        }
        const fetchFiltered = async () => {
            setFilterLoading(true);
            const params = new URLSearchParams({ page: currentPage });
            if (selectedCategorySlug) params.append('category', selectedCategorySlug);
            if (selectedConditionSlug) params.append('condition', selectedConditionSlug);
            if (sortOption) params.append('ordering', sortOption);
            params.append('min_price', priceMin.toString());
            params.append('max_price', priceMax.toString());

            const res = await fetch(
                `https://media.upfrica.com/api/shops/${slug}/products/filter/?${params}`
            );
            const data = await (res.ok ? await res.json() : { results: [], count: 0 });
            setFilterProducts(data.results || []);
            setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
            setFilterLoading(false);
        };
        fetchFiltered();
    }, [
        slug,
        currentPage,
        selectedCategorySlug,
        selectedConditionSlug,
        sortOption,
        priceMin,
        priceMax,
    ]);

    // --- Helpers ---
    const displayProducts =
        filterLoading || filterProducts.length > 0 ? filterProducts : mainProducts;

    const toggleSidebar = () => setIsSidebarOpen((v) => !v);
    const closeSidebar = () => setIsSidebarOpen(false);

    // close sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                isSidebarOpen
            ) {
                closeSidebar();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen]);

    if (mainError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
                <p>Failed to load shop. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900" 
        style={{
            backgroundColor: shop?.bg_color || '#E8EAED',
        }}>
<section className="relative">
  {mainLoading ? (
    <HeroSectionSkeleton />
  ) : (
    <div className="relative">
      <img
        src={shop?.top_banner || 'https://images.pexels.com/photos/34577/pexels-photo.jpg'}
        alt="Shop Banner"
        className="w-full object-cover h-[240px] md:h-[320px]"
      />

      <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4">
        {/* Shop Logo + Info */}
        <div className="flex items-center gap-4 md:gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <img
            src="https://via.placeholder.com/64x64.png?text=Logo"
            alt="Shop Logo"
            className="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-white shadow object-cover"
          />
<div>
  <h1 className="text-2xl md:text-3xl font-bold">{shop?.name}</h1>
  <p className="text-sm text-gray-600">{shopType}</p>

  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
    {shop?.created_at && (
      <span className="flex items-center gap-1">
        <HiOutlineCalendar className="text-gray-500" />
        {new Date(shop.created_at).toLocaleDateString()}
      </span>
    )}
    <span className="flex items-center gap-1">
      <FaCheckCircle className="text-green-500" />
      Verified
    </span>
    {shop?.user?.country && (
      <span className="flex items-center gap-1">
        {shop.user.country === 'GH' && '🇬🇭'} {shop.user.town}, {shop.user.country}
      </span>
    )}
  </div>

  {/* ✅ EDIT BUTTON visible only to the shop owner */}
  {user && (
    <button
      onClick={() => setIsEditOpen(true)}
      className="mt-3 inline-flex items-center gap-2 px-3 py-1 text-sm text-violet-700 border border-violet-700 rounded hover:bg-violet-50"
    >
      <FaEdit className="text-violet-700" />
      Edit Shop
    </button>
  )}
</div>
        </div>

      </div>
    </div>
  )}
</section>

            <ShopEditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                shop={shop}
                onSave={setShop}
            />

{/* TOP NAV */}
<nav className="bg-white border-t border-b shadow-sm">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 md:px-6 py-3">

    {/* Tabs */}
    <ul className="flex flex-wrap gap-4 text-sm font-medium">
      <li className="text-violet-700 border-b-2 border-violet-700 pb-1">All Products</li>
      <li className="hover:text-violet-700 cursor-pointer">Categories</li>
      <li className="hover:text-violet-700 cursor-pointer">About</li>
      <li className="hover:text-violet-700 cursor-pointer">Reviews</li>
    </ul>

    {/* Call / Chat */}
    <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto justify-end">
      {shop?.user?.phone_number && (
        <a
          href={`tel:${shop.user?.phone_number}`}
          className="flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 text-sm w-full md:w-auto"
        >
          <FaPhoneAlt className="text-gray-600" />
          Call
        </a>
      )}
      <button
        onClick={() => setIsChatOpen(true)}
        className="flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 text-sm w-full md:w-auto"
      >
        <FaCommentDots className="text-gray-600" />
        Chat
      </button>
    </div>
  </div>
</nav>

            <main className="mx-auto grid max-w-6xl gap-8 px-2 py-10 md:grid-cols-[240px_1fr]">
                {/* DESKTOP SIDEBAR */}
                <aside className="hidden md:block space-y-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    {/* Category */}
                    <div className="p-5 bg-white border border-[#dee2e6] rounded-t-[5px] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                        <label className="block text-sm font-medium mb-1">Category</label>
                        {categoriesLoading ? (
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <select
                                value={selectedCategorySlug}
                                onChange={(e) => {
                                    setSelectedCategorySlug(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded border px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                {shopCategories.map((c) => (
                                    <option key={c.id} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {/* Condition */}
                    <div className="p-5 m-0 bg-white border border-[#dee2e6] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ margin: '0px' }}>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        {conditionsLoading ? (
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <select
                                value={selectedConditionSlug}
                                onChange={(e) => {
                                    setSelectedConditionSlug(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded border px-3 py-2"
                            >
                                <option value="">All Conditions</option>
                                {shopConditions.map((c) => (
                                    <option key={c.id} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {/* Sort */}
                    <div className="p-5 m-0 bg-white border border-[#dee2e6] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ margin: '0px' }}>
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
  className="m-0 p-5 bg-white border border-[#dee2e6] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
  style={{ margin: '0px' }}
/>
                    {/* Ratings (static) */}
                    <div className="p-5 bg-white border border-[#dee2e6] rounded-b-[5px] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ margin: '0px' }}>
                        <h2 className="mb-2 font-semibold">Ratings</h2>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400" />
                            ))}
                            <span className="ml-2 text-sm">4.5/5</span>
                        </div>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR OVERLAY */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
                )}
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-white p-6 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                   
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>
                        <button
                            onClick={closeSidebar}
                            className="mb-4 inline-flex items-center rounded p-1 hover:bg-gray-100"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                   </div>
                    {/* repeat same filter controls as desktop */}
                    {/* Category */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={selectedCategorySlug}
                            onChange={(e) => {
                                setSelectedCategorySlug(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">All Categories</option>
                            {shopCategories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Condition */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select
                            value={selectedConditionSlug}
                            onChange={(e) => {
                                setSelectedConditionSlug(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">All Conditions</option>
                            {shopConditions.map((c) => (
                                <option key={c.id} value={c.slug}>
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
                    {/* Price */}
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-full border border-gray-700 px-10 py-2 focus:outline-none focus:ring-0"
                        />
                        {/* right icon: filter or clear */}
                        {searchQuery ? (
                            <AiOutlineClose
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
                                onClick={() => setSearchQuery('')}
                            />
                        ) : (
                            <AiOutlineFilter
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700 md:hidden"
                                onClick={toggleSidebar}
                            />
                        )}

                        {/* SEARCH SUGGESTIONS */}
                        {searchQuery && (
                            <div className="absolute left-0 right-0 z-20 mt-2 rounded bg-white shadow">
                                {searchLoading
                                    ? [...Array(3)].map((_, i) => <SearchResultSkeleton key={i} />)
                                    : searchResults.slice(0, 5).map((p) => (
                                        <Link key={p.id} href={`/${p.seller_country}/${p.seo_slug}`}>
                                            <span className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-gray-50">
                                                <img
                                                    src={p.product_images[0]}
                                                    alt={p.title}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{p.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        ₵{(p.price_cents / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            </span>
                                        </Link>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
  {(mainLoading || filterLoading) ? (
    [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
  ) : (
    displayProducts.map((p) => <ShopCard key={p.id} product={p} />)
  )}
</div>

{/* PAGINATION */}
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

<ShopFAQSection shop={shop} />

                </section>
            </main>
        </div>
    );
}
