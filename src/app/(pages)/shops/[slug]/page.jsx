

'use client';

import React, { useEffect, useState } from 'react';
import ShopCard from '@/components/home/ProductList/ShopCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import SearchResultSkeleton from './SearchResultSkeleton';
import PriceRange from './PriceRange';
import ShopEditModal from './ShopEditModal';
import { FaCheckCircle, FaStar, FaEdit } from 'react-icons/fa';
import { AiOutlineSearch, AiOutlineClose, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { HiOutlineCalendar, HiOutlineTag } from 'react-icons/hi';
import HeroSectionSkeleton from './HeroSectionSkeleton';

// Sample categories array used for the top nav dropdown.
const navCategories = ["Electronics", "Fashion", "Homeware"];

// Determine product category based on product name.
function getCategory(productName) {
    if (["Smartphone", "Smartwatch", "Headphones", "Laptop"].includes(productName))
        return "Electronics";
    if (["Sneakers"].includes(productName))
        return "Fashion";
    return "Homeware";
}

// Hero skeleton for loading state
const HeroSkeleton = () => (
    <div className="h-[300px] w-full bg-gray-200 animate-pulse" />
);

// Component for rendering a single search result item.
const SearchResultItem = ({ product }) => (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50">
        <img
            src={product.product_images[0]}
            alt={product.title}
            className="w-12 h-12 rounded object-cover"
        />
        <div className="ml-4">
            <p className="text-sm font-medium">{product.title}</p>
            <p className="text-xs text-gray-500">
                ₵{(product.price_cents / 100).toFixed(2)}
            </p>
        </div>
    </div>
);

// Custom Pagination component.
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center space-x-2">
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
                        className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 ${page === currentPage ? 'bg-violet-700 text-white' : ''}`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={i} className="px-3 py-1">{page}</span>
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
    );
};

export default function Shops({ params }) {
    const { slug } = params;
    const { token, user } = useSelector((state) => state.auth);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // callback to receive updated shop from modal
    const handleShopSave = (newShop) => {
        setShop(newShop);
    };

    // Pagination state
    const PAGE_SIZE = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Hero & main products fetch state
    const [shop, setShop] = useState(null);
    const [mainProducts, setMainProducts] = useState([]);
    const [mainLoading, setMainLoading] = useState(true);
    const [mainError, setMainError] = useState(null);

    // Search suggestion products state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchActive, setSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Top-nav categories dropdown
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Price & rating filters
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(1000);
    const [reviewRating, setReviewRating] = useState("");

    // Dynamic shop categories (for sidebar)
    const [shopCategories, setShopCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState("");

    // Dynamic shop conditions (for sidebar)
    const [shopConditions, setShopConditions] = useState([]);
    const [conditionsLoading, setConditionsLoading] = useState(true);
    const [conditionsError, setConditionsError] = useState(null);
    const [selectedConditionSlug, setSelectedConditionSlug] = useState("");

    // Toggle top-nav category
    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown(prev => !prev);
    };

    // Fetch main products & shop info
    useEffect(() => {
        const fetchMainProducts = async () => {
            setMainLoading(true);
            setMainError(null);
            try {
                const resp = await fetch(`https://media.upfrica.com/api/shops/${slug}/products/?page=${currentPage}`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                setMainProducts(data.results || []);
                setShop(data.shop || null);
                if (data.count) {
                    setTotalPages(Math.ceil(data.count / PAGE_SIZE));
                }
            } catch (err) {
                console.error(err);
                setMainError(err);
            } finally {
                setMainLoading(false);
            }
        };
        fetchMainProducts();
    }, [slug, currentPage]);

    // Fetch search suggestions
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        const timer = setTimeout(() => {
            const fetchSearch = async () => {
                setSearchLoading(true);
                try {
                    const resp = await fetch(
                        `https://media.upfrica.com/api/shops/${slug}/products/filter/?q=${encodeURIComponent(searchQuery)}`
                    );
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const data = await resp.json();
                    setSearchResults(data.results || []);
                } catch (err) {
                    console.error(err);
                } finally {
                    setSearchLoading(false);
                }
            };
            fetchSearch();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, slug]);

    // Fetch dynamic categories & conditions
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);
            try {
                const resp = await fetch(`https://media.upfrica.com/api/shops/${slug}/categories/`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                setShopCategories(data);
            } catch (err) {
                console.error(err);
                setCategoriesError(err);
            } finally {
                setCategoriesLoading(false);
            }
        };
        const fetchConditions = async () => {
            setConditionsLoading(true);
            setConditionsError(null);
            try {
                const resp = await fetch(`https://media.upfrica.com/api/shops/${slug}/conditions/`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                setShopConditions(data);
            } catch (err) {
                console.error(err);
                setConditionsError(err);
            } finally {
                setConditionsLoading(false);
            }
        };
        fetchCategories();
        fetchConditions();
    }, [slug]);

    // Apply local filters (category slug & condition slug not applied to filtering yet)
    const filteredProducts = mainProducts.filter(p => {
        let ok = true;
        if (selectedCategories.length > 0) {
            const cat = getCategory(p.title);
            if (!selectedCategories.includes(cat)) ok = false;
        }
        const price = p.price_cents / 100;
        if (price < priceMin || price > priceMax) ok = false;
        if (reviewRating && p.rating !== undefined && p.rating < reviewRating) ok = false;
        return ok;
    });

    if (mainError) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
                <p className="text-center py-10">
                    There was a problem loading the products. Please try again later.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* HERO SECTION */}
            <section className="relative">
                {mainLoading ? (
                    <HeroSectionSkeleton />
                ) : (
                    <>
                        {shop?.top_banner ? (
                            <img
                                src={shop.top_banner}
                                alt="Shop top banner"
                                className="h-[300px] w-full object-cover"
                            />
                        ) : shop?.bg_color ? (
                            <div
                                className="h-[300px] w-full"
                                style={{ backgroundColor: shop.bg_color }}
                            />
                        ) : (
                            <img
                                src="https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="Shops hero"
                                className="h-[300px] w-full object-cover"
                            />
                        )}

                        <div className="absolute bottom-0 left-10 bg-white backdrop-blur p-6 rounded-tl-lg rounded-tr-lg">
                            <h1 className="text-3xl font-bold">{shop?.name || 'N/A'}</h1>

                            <div className="mt-2 flex items-center gap-8 text-sm my-2">
                                <span className="flex items-center gap-1">
                                    <FaCheckCircle className="bg-violet-700 h-4 w-4 text-white rounded-full" />
                                    <span>Verified</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    {shop?.user?.country === 'GH' && (
                                        <span role="img" aria-label="Ghana flag">🇬🇭</span>
                                    )}
                                    {shop?.user?.local_area && <span>{shop.user.local_area},</span>}
                                    {shop?.user?.town && <span>{shop.user.town},</span>}
                                    <span>{shop?.user?.country}</span>
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-gray-600 max-w-[400px]">
                                {shop?.description || 'No details available.'}
                            </p>
                                <p className=" text-sm mt-2 text-gray-600 max-w-[400px] flex items-center">
                                    <HiOutlineCalendar className="mr-2" size={16} />
                                    {shop?.created_at
                                        ? `${new Date(shop.created_at).toLocaleDateString()}`
                                        : 'N/A'}
                                </p>

                               

                            {user && (
                                    <div
                                        className="flex items-center gap-2 mt-2 cursor-pointer"
                                        onClick={() => setIsEditOpen(true)}
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                    <FaEdit
                                        
                                        title="Edit Shop"
                                        
                                    />
                                    <span className="font-semibold">Edit</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </section>
               <ShopEditModal
                  isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                shop={shop}
                setShop={setShop}
                  onSave={handleShopSave}
                />

            {/* TOP NAVIGATION */}
            <nav className="border-b bg-white">
                <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm font-medium items-center">
                    <li className="cursor-pointer hover:underline border-b-2 border-violet-700">
                        All Products
                    </li>
                    <li onClick={toggleCategoryDropdown} className="cursor-pointer hover:underline hover:text-violet-700 relative">
                        Categories
                        <div>{selectedCategories.join(", ")}</div>
                        {showCategoryDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow p-2 z-20 w-[120px]">
                                {navCategories.map(cat => (
                                    <label key={cat} className="block text-sm">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        )}
                    </li>
                    <li className="cursor-pointer hover:underline hover:text-violet-700">About</li>
                    <li className="cursor-pointer hover:underline hover:text-violet-700">Reviews</li>
                    <li className="ml-auto">
                        <button
                            className="rounded border px-4 py-2 hover:bg-gray-100"
                            onClick={() => setSearchActive(prev => !prev)}
                        >
                            {searchActive ? shop?.user?.phone_number || "No Contact Info" : "Contact Seller"}
                        </button>
                    </li>
                </ul>
            </nav>

            {/* MAIN CONTENT */}
            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
                {/* LEFT SIDEBAR FILTERS */}
                <aside className="space-y-6">
                    <h2 className="text-xl font-semibold">Filters</h2>

                    {/* Dynamic Categories Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Categories</label>
                        {categoriesLoading ? (
                            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={selectedCategorySlug}
                                onChange={e => setSelectedCategorySlug(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {shopCategories.map(cat => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Dynamic Condition Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        {conditionsLoading ? (
                            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={selectedConditionSlug}
                                onChange={e => setSelectedConditionSlug(e.target.value)}
                            >
                                <option value="">Select Condition</option>
                                {shopConditions.map(cond => (
                                    <option key={cond.id} value={cond.slug}>
                                        {cond.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Sort By Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Sort By</label>
                        <select className="w-full rounded border px-3 py-2">
                            <option value="">Sort by</option>
                            <option value="priceLowHigh">Price (low → high)</option>
                            <option value="priceHighLow">Price (high → low)</option>
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <PriceRange
                        min={priceMin}
                        max={priceMax}
                        onChangeMin={setPriceMin}
                        onChangeMax={setPriceMax}
                    />

                    {/* Ratings Filter */}
                    <div>
                        <h2 className="mb-2 font-semibold">Ratings</h2>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400" />
                            ))}
                            <span className="ml-2 text-sm">5</span>
                        </div>
                        <p className="text-xs text-gray-500">Rating: 4.5/10</p>
                    </div>

                    {/* About the Shop */}
                    <div>
                        <label className="block font-medium mb-1">About the Shop</label>
                        <p className="text-sm text-gray-600">
                            {shop?.description || "No information available."}
                        </p>
                    </div>
                </aside>

                {/* RIGHT SIDE - MAIN CONTENT */}
                <section className="relative">
                    {/* Search Input */}
                    <div className="mb-6 relative">
                        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-xl" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-800"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchActive(true)}
                            onBlur={() => setTimeout(() => setSearchActive(false), 100)}
                        />
                        {searchQuery && (
                            <AiOutlineClose
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
                                onClick={() => setSearchQuery('')}
                            />
                        )}

                        {/* Search Dropdown */}
                        {searchActive && searchQuery && (
                            <div className="absolute left-0 right-0 mt-2 z-20 bg-white shadow border border-gray-200">
                                {searchLoading ? (
                                    <>
                                        <SearchResultSkeleton />
                                        <SearchResultSkeleton />
                                        <SearchResultSkeleton />
                                    </>
                                ) : (
                                    searchResults.slice(0, 5).map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/${product?.seller_country?.toLowerCase() || 'gh'}/${product?.seo_slug || ''}`}
                                            onMouseDown={e => e.preventDefault()}
                                        >
                                            <SearchResultItem product={product} />
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {mainLoading
                            ? [...Array(6)].map((_, idx) => <ProductCardSkeleton key={idx} />)
                            : filteredProducts.map(product => (
                                <ShopCard key={product.id} product={product} />
                            ))
                        }
                    </div>

                    {/* Custom Pagination */}
                    <div className="flex justify-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
