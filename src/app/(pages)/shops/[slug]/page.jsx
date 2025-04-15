'use client';
import React, { useEffect, useState } from 'react';
import ShopCard from '@/components/home/ProductList/ShopCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import SearchResultSkeleton from './SearchResultSkeleton';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import PriceRange from './PriceRange';

const categories = ["Electronics", "Fashion", "Homeware"];

// Naive mapping for demonstration purposes.
function getCategory(productName) {
    if (["Smartphone", "Smartwatch", "Headphones", "Laptop"].includes(productName))
        return "Electronics";
    if (["Sneakers"].includes(productName))
        return "Fashion";
    return "Homeware";
}

export default function Shops({ params }) {
    const { slug } = params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Left sidebar filter states.
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(1000);
    const [reviewRating, setReviewRating] = useState("");

    // Search states.
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchActive, setSearchActive] = useState(false);

    // Toggle category selection.
    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    // Toggle the left sidebar categories dropdown.
    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown((prev) => !prev);
    };

    // Debounce search input and simulate a dummy API call.
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim() !== "") {
                setSearchLoading(true);
                // Simulate an API call delay.
                setTimeout(() => {
                    setSearchLoading(false);
                    // (Here you would update search results if needed.)
                }, 1000);
            } else {
                setSearchLoading(false);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch products from the API.
    useEffect(() => {
        const fetchProducts = async () => {
            const requestOptions = { method: 'GET', redirect: 'follow' };
            try {
                const response = await fetch(
                    `https://media.upfrica.com/api/shops/${slug}/products/`,
                    requestOptions
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data?.results || []);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug]);

    // Filter products based on selected filters.
    const filteredProducts = products.filter((p) => {
        let include = true;

        // Category filter.
        if (selectedCategories.length > 0) {
            const cat = getCategory(p.name);
            if (!selectedCategories.includes(cat)) include = false;
        }

        // Price range filter (assume price is in GHS as p.price_cents/100).
        const price = p.price_cents / 100;
        if (price < priceMin || price > priceMax) include = false;

        // Reviews filter.
        if (reviewRating !== "" && p.rating !== undefined) {
            if (p.rating < reviewRating) include = false;
        }

        return include;
    });

    if (error) {
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
                <img
                    src="https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Shops hero"
                    className="h-[300px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-10 bg-white backdrop-blur p-6 rounded-tl-lg rounded-tr-lg">
                    <h1 className="text-3xl font-bold">Upfrica Shops</h1>
                    <div className="mt-2 flex items-center gap-8 text-sm my-2">
                        <span className="flex items-center gap-1">
                            <FaCheckCircle className="bg-violet-700 h-4 w-4 text-white rounded-full" />
                            <span>Verified</span>
                        </span>
                        <span role="img" aria-label="Ghana flag">🇬🇭 Ghana</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Great deals on a variety of products from shops across Ghana and Nigeria!
                    </p>
                </div>
            </section>

            {/* TOP NAVIGATION */}
            <nav className="border-b bg-white">
                <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm font-medium items-center">
                    <li className="cursor-pointer hover:underline border-b-2 border-violet-700">
                        All Products
                    </li>
                    <li
                        onClick={toggleCategoryDropdown}
                        className="cursor-pointer hover:underline hover:text-violet-700"
                    >
                        Categories

                        {/* Categories Filter (styled like a select) */}
                        <div className="relative">
                            <div
                                
                                
                            >
                                {selectedCategories.length > 0
                                    ? selectedCategories.join(", ")
                                    : ""}
                            </div>
                            {showCategoryDropdown && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow p-2 z-20 w-[120px]">
                                    {categories.map((cat) => (
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
                        </div>
                    </li>
                    <li className="cursor-pointer hover:underline hover:text-violet-700">About</li>
                    <li className="cursor-pointer hover:underline hover:text-violet-700">Reviews</li>
                    <li className="ml-auto">
                        <button className="rounded border px-4 py-2 hover:bg-gray-100">
                            Contact Seller
                        </button>
                    </li>
                </ul>
            </nav>

            {/* MAIN CONTENT */}
            <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
                {/* LEFT SIDEBAR FILTERS */}
                <aside className="space-y-6">
                    <h2 className="text-xl font-semibold">Filters</h2>

                    

                    {/* Categories Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Categories</label>
                        <select className="w-full rounded border px-3 py-2">
                            <option value="">Select Categories</option>
                            <option value="laptop">Laptop</option>
                            <option value="mobile">Mobile</option>
                        </select>
                    </div>
                    {/* Condition Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select className="w-full rounded border px-3 py-2">
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>

                    {/* Sort By Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Sort By</label>
                        <select className="w-full rounded border px-3 py-2">
                            <option value="">Sort by</option>
                            <option value="priceLowHigh">Price (low → high)</option>
                            <option value="priceHighLow">Price (high → low)</option>
                        </select>
                    </div>

                    {/* Price Range Filter (Dual Range Inputs) */}
                    <PriceRange />

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

                    {/* About Section */}
                    <div className="mb-4">
                        <label className="block  font-medium">About the Shop</label>
                        <p className="text-sm text-gray-600">
                            Discover top-quality products and amazing deals from verified shops.
                        </p>
                    </div>
                </aside>

                {/* RIGHT SIDE - MAIN CONTENT */}
                <section>
                    {/* Search Input */}
                    <div className="mb-6">
                        <div className="relative">
                            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-xl font-bold" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchActive(true)}
                                onBlur={() => setSearchActive(false)}
                            />
                            {searchQuery && (
                                <AiOutlineClose
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer font-bold"
                                    onClick={() => setSearchQuery('')}
                                />
                            )}
                            {searchLoading && (
                                <div className="absolute left-0 right-0 mt-2 z-20 bg-white">
                                    <SearchResultSkeleton />
                                    <SearchResultSkeleton />
                                    <SearchResultSkeleton />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {loading
                            ? [...Array(6)].map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))
                            : filteredProducts.map((product) => (
                                <ShopCard key={product.id} product={product} />
                            ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
