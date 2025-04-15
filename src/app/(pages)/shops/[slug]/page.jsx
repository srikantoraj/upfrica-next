// 'use client';
// import React, { useEffect, useState } from 'react';
// import ShopCard from '@/components/home/ProductList/ShopCard'; // Ensure this reflects the updated design below.
// import ProductCardSkeleton from './ProductCardSkeleton';
// import { FaCheckCircle, FaStar } from 'react-icons/fa';






// const categories = ["Electronics", "Fashion", "Homeware"];

// // Naive mapping for demonstration purposes
// function getCategory(productName) {
//     if (["Smartphone", "Smartwatch", "Headphones", "Laptop"].includes(productName))
//         return "Electronics";
//     if (["Sneakers"].includes(productName)) return "Fashion";
//     return "Homeware";
// }

// export default function Shops({ params }) {
//     const { slug } = params;
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);

//     // Toggle the category selection
//     const toggleCategory = (cat) =>
//         setSelectedCategories((prev) =>
//             prev.includes(cat)
//                 ? prev.filter((c) => c !== cat)
//                 : [...prev, cat]
//         );

//     // Filter products based on the selected categories if any
//     const filteredProducts =
//         selectedCategories.length === 0
//             ? products
//             : products.filter((p) => selectedCategories.includes(getCategory(p.name)));

//     // Fetch products from the API endpoint
//     useEffect(() => {
//         const fetchProducts = async () => {
//             const requestOptions = {
//                 method: 'GET',
//                 redirect: 'follow'
//             };

//             try {
//                 const response = await fetch(
//                     `https://media.upfrica.com/api/shops/${slug}/products/`,
//                     requestOptions
//                 );
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setProducts(data?.results || []);
//             } catch (err) {
//                 console.error('Failed to fetch products:', err);
//                 setError(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [slug]);

//     // Render a set of skeleton cards during loading with a sidebar filter for consistency.
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 text-gray-900">
//                 <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
//                     <aside className="space-y-8">
//                         <div>
//                             <h2 className="mb-2 font-semibold">Categories</h2>
//                             {categories.map((cat) => (
//                                 <label key={cat} className="mb-1 flex items-center gap-2 text-sm">
//                                     <input type="checkbox" className="rounded border" onChange={() => toggleCategory(cat)} />
//                                     {cat}
//                                 </label>
//                             ))}
//                         </div>
//                     </aside>
//                     <section>
//                         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//                             {[...Array(6)].map((_, index) => (
//                                 <ProductCardSkeleton key={index} />
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         );
//     }

//     // Render error state if needed.
//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
//                 <p className="text-center py-10">There was a problem loading the products. Please try again later.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 text-gray-900">
//             {/* Hero Section */}
//             <section className="relative">
//                 <img
//                     src="https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
//                     alt="Shops hero"
//                     className="h-[300px] w-full object-cover"
//                 />
//                 <div className="absolute bottom-0 left-10 bg-white backdrop-blur p-6 rounded-tl-lg rounded-tr-lg">
//                     <h1 className="text-3xl font-bold">Upfrica Shops</h1>
//                     <div className="mt-2 flex items-center gap-8 text-sm my-2">
//                         <span className="flex items-center gap-1">
//                             <FaCheckCircle className="bg-violet-700 h-4 w-4 text-white rounded-full" />
//                             <span>Verified</span>
//                         </span>
//                         <span role="img" aria-label="Ghana flag">
//                             🇬🇭 Ghana
//                         </span>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-600">
//                         Great deals on a variety of products from shops across Ghana and Nigeria!
//                     </p>
//                 </div>
//             </section>

//             {/* Navigation with Dropdown for All Products */}
//             <nav className="border-b bg-white">
//                 <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm font-medium items-center relative">
//                     <li className="relative">
//                         <button
//                             onClick={() => setShowDropdown(prev => !prev)}
//                             className="cursor-pointer hover:text-violet-700 focus:outline-none"
//                         >
//                             All Products
//                         </button>
//                         {showDropdown && (
//                             <ul className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
//                                 {categories.map((cat) => (
//                                     <li
//                                         key={cat}
//                                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => {
//                                             toggleCategory(cat);
//                                             setShowDropdown(false);
//                                         }}
//                                     >
//                                         {cat}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </li>
//                     <li className="cursor-pointer hover:text-violet-700">Categories</li>
//                     <li className="cursor-pointer hover:text-violet-700">About</li>
//                     <li className="cursor-pointer hover:text-violet-700">Reviews</li>
//                     <li className="ml-auto">
//                         <button className="rounded border px-4 py-2 hover:bg-gray-100">
//                             Contact Seller
//                         </button>
//                     </li>
//                 </ul>
//             </nav>

//             {/* Main Content */}
//             <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
//                 {/* Sidebar Filters */}
//                 <aside className="space-y-8">
//                     <div>
//                         <h2 className="mb-2 font-semibold">Categories</h2>
//                         {categories.map((cat) => (
//                             <label key={cat} className="mb-1 flex items-center gap-2 text-sm">
//                                 <input
//                                     type="checkbox"
//                                     className="rounded border"
//                                     checked={selectedCategories.includes(cat)}
//                                     onChange={() => toggleCategory(cat)}
//                                 />
//                                 {cat}
//                             </label>
//                         ))}
//                     </div>

//                     <div>
//                         <h2 className="mb-2 font-semibold">Ratings</h2>
//                         <div className="flex items-center">
//                             {[...Array(5)].map((_, i) => (
//                                 <FaStar key={i} className="text-yellow-400" />
//                             ))}
//                             <span className="ml-2 text-sm">5</span>
//                         </div>
//                         <p className="text-xs text-gray-500">Rating: 4.5/10</p>
//                     </div>

//                     <div>
//                         <h2 className="mb-2 font-semibold">About the Shop</h2>
//                         <p className="text-sm text-gray-600">
//                             Discover top-quality products and amazing deals at our verified shop.
//                         </p>
//                     </div>
//                 </aside>

//                 {/* Product Grid Section */}
//                 <section>
//                     <div className="mb-6 flex items-center justify-between">
//                         <select className="rounded border px-3 py-2">
//                             <option>Condition</option>
//                             <option>New</option>
//                             <option>Used</option>
//                         </select>
//                         <select className="rounded border px-3 py-2">
//                             <option>Sort by</option>
//                             <option>Price (low → high)</option>
//                             <option>Price (high → low)</option>
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//                         {filteredProducts.map((product) => (
//                             <ShopCard key={product.id} product={product} />
//                         ))}
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// }
'use client';
import React, { useEffect, useState } from 'react';
import ShopCard from '@/components/home/ProductList/ShopCard'; // Ensure this reflects the updated design below.
import ProductCardSkeleton from './ProductCardSkeleton';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

const categories = ["Electronics", "Fashion", "Homeware"];

// Naive mapping for demonstration purposes
function getCategory(productName) {
    if (["Smartphone", "Smartwatch", "Headphones", "Laptop"].includes(productName))
        return "Electronics";
    if (["Sneakers"].includes(productName)) return "Fashion";
    return "Homeware";
}

export default function Shops({ params }) {
    const { slug } = params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Toggle the category selection
    const toggleCategory = (cat) =>
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );

    // Filter products based on the selected categories if any
    const filteredProducts =
        selectedCategories.length === 0
            ? products
            : products.filter((p) => selectedCategories.includes(getCategory(p.name)));

    // Fetch products from the API endpoint
    useEffect(() => {
        const fetchProducts = async () => {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

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

    // Render error state if needed.
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
            {/* Hero Section */}
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
                        <span role="img" aria-label="Ghana flag">
                            🇬🇭 Ghana
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Great deals on a variety of products from shops across Ghana and Nigeria!
                    </p>
                </div>
            </section>

            {/* Navigation with Dropdown for All Products */}
            <nav className="border-b bg-white">
                <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm font-medium items-center relative">
                    <li className="relative">
                        <button
                            onClick={() => setShowDropdown(prev => !prev)}
                            className="cursor-pointer hover:text-violet-700 focus:outline-none"
                        >
                            All Products
                        </button>
                        {showDropdown && (
                            <ul className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                                {categories.map((cat) => (
                                    <li
                                        key={cat}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            toggleCategory(cat);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <li className="cursor-pointer hover:text-violet-700">Categories</li>
                    <li className="cursor-pointer hover:text-violet-700">About</li>
                    <li className="cursor-pointer hover:text-violet-700">Reviews</li>
                    <li className="ml-auto">
                        <button className="rounded border px-4 py-2 hover:bg-gray-100">
                            Contact Seller
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
                {/* Sidebar Filters */}
                <aside className="space-y-8">
                    <div>
                        <h2 className="mb-2 font-semibold">Categories</h2>
                        {categories.map((cat) => (
                            <label key={cat} className="mb-1 flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    className="rounded border"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>

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

                    <div>
                        <h2 className="mb-2 font-semibold">About the Shop</h2>
                        <p className="text-sm text-gray-600">
                            Discover top-quality products and amazing deals at our verified shop.
                        </p>
                    </div>
                </aside>

                {/* Product Grid Section */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <select className="rounded border px-3 py-2">
                            <option>Condition</option>
                            <option>New</option>
                            <option>Used</option>
                        </select>
                        <select className="rounded border px-3 py-2">
                            <option>Sort by</option>
                            <option>Price (low → high)</option>
                            <option>Price (high → low)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {loading
                            ? [...Array(6)].map((_, index) => <ProductCardSkeleton key={index} />)
                            : filteredProducts.map((product) => <ShopCard key={product.id} product={product} />)}
                    </div>
                </section>
            </main>
        </div>
    );
}
