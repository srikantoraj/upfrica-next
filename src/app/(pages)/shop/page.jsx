
'use client';
import { useState } from "react";
import { FaCheckCircle, FaStar } from "react-icons/fa";

/** ----------------------------- */
/** Dummy data                    */
/** ----------------------------- */

const products = [
    { id: 1, name: "Smartphone", price: 350, image: "https://d3q0odwafjkyv1.cloudfront.net/direct_uploads/6671a8c7-ebf7-4d33-8b00-0d0c8e094d35" },
    { id: 2, name: "Wooden Dining Chair", price: 120, image: "https://d3q0odwafjkyv1.cloudfront.net/direct_uploads/30866ef6-dcb4-4832-bf03-0718076b5888" },
    { id: 3, name: "Smartwatch", price: 300, image: "https://d3q0odwafjkyv1.cloudfront.net/direct_uploads/6fd37d9f-dee9-4c60-ae12-b0e7c8641f28" },
    { id: 4, name: "Sneakers", price: 150, image: "https://d3q0odwafjkyv1.cloudfront.net/direct_uploads/5e3b8e91-40df-4132-8778-089b9503727d" },
    { id: 5, name: "Headphones", price: 250, image: "https://d3q0odwafjkyv1.cloudfront.net/ye2nq9lc83qxk9oj1wec0bse3rou" },
    { id: 6, name: "Ceramic Vase", price: 50, image: "https://d3q0odwafjkyv1.cloudfront.net/24wbsrkp6up2atri4t5pgwjr06i4" },
    { id: 7, name: "Laptop", price: 3200, image: "https://d3q0odwafjkyv1.cloudfront.net/s12xui1j3y15hwkk7bgmccovocfi" },
    { id: 8, name: "Table Lamp", price: 150, image: "https://d3q0odwafjkyv1.cloudfront.net/direct_uploads/79614e7a-485e-4f4b-bc69-45960fd5ea47" },
];

const categories = ["Electronics", "Fashion", "Homeware"];

/** ----------------------------- */
/** Page component                */
/** ----------------------------- */

export default function Home() {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const toggleCategory = (cat) =>
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );

    const filteredProducts =
        selectedCategories.length === 0
            ? products
            : products.filter((p) => selectedCategories.includes(getCategory(p.name)));

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Hero / shop header */}
            <section className="relative">
                <img
                    src="https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Bedroom hero"
                    className="h-[300px] w-full object-cover"
                />
                <div className="absolute bottom-0 left-10 bg-white backdrop-blur p-6 rounded-tl-lg rounded-tr-lg">
                    <h1 className="text-3xl font-bold">BuyBargains</h1>
                    <div className="mt-2 flex items-center gap-8 text-sm my-2">
                        {/* Replacing the tick mark with a React Icon styled with violet */}
                        <span className="flex items-center gap-1">
                            <FaCheckCircle className="bg-violet-700 h-4 w-4 text-white rounded-full " />
                            <span>Verified</span>
                        </span>
                        <span role="img" aria-label="Ghana flag">
                            🇬🇭 Ghana
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Great deals on electronics, homeware, and more!
                    </p>
                </div>
            </section>

            {/* Nav tabs */}
            <nav className="border-b bg-white">
                <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-4 text-sm font-medium">
                    {["All Products", "Categories", "About", "Reviews"].map((tab) => (
                        <li key={tab} className="cursor-pointer hover:text-violet-700">
                            {tab}
                        </li>
                    ))}
                    <li className="ml-auto">
                        <button className="rounded border px-4 py-2 hover:bg-gray-100">
                            Contact Seller
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main content */}
            <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
                {/* Sidebar filters */}
                <aside className="space-y-8">
                    {/* Category filter */}
                    <div>
                        <h2 className="mb-2 font-semibold">Categories</h2>
                        {categories.map((cat) => (
                            <label
                                key={cat}
                                className="mb-1 flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    // Added rounded border for checkboxes
                                    className="rounded border"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>

                    {/* Ratings (static dummy using React Icons) */}
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

                    {/* About shop (static dummy) */}
                    <div>
                        <h2 className="mb-2 font-semibold">About a Shop</h2>
                        <p className="text-sm text-gray-600">
                            Welcome to BuyBargains! We offer a wide selection of quality
                            products at unbeatable prices.
                        </p>
                    </div>
                </aside>

                {/* Product grid */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        {/* Condition dropdown (placeholder) */}
                        <select className="rounded border px-3 py-2">
                            <option>Condition</option>
                            <option>New</option>
                            <option>Used</option>
                        </select>

                        {/* Sort/filter (placeholder) */}
                        <select className="rounded border px-3 py-2">
                            <option>Sort by</option>
                            <option>Price (low → high)</option>
                            <option>Price (high → low)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

/** ----------------------------- */
/** Helper components / functions */
/** ----------------------------- */

function ProductCard({ product }) {
    const [imageOk, setImageOk] = useState(true);

    return (
        // Added border-b to separate each product visually
        <div className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md border-b border-gray-200">
            {imageOk ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-36 w-36 rounded"
                    onError={() => setImageOk(false)}
                />
            ) : (
                /* Fallback — same footprint & rounded shape, just a subtle gray */
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded bg-gray-50">
                    <span className="text-xs text-gray-400">Image unavailable</span>
                </div>
            )}

            <h3 className="mt-4 text-sm font-medium">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-600">GHS {product.price}</p>
        </div>
    );
}

function getCategory(productName) {
    // Naive mapping just for demo purposes
    if (
        ["Smartphone", "Smartwatch", "Headphones", "Laptop"].includes(productName)
    )
        return "Electronics";
    if (["Sneakers"].includes(productName)) return "Fashion";
    return "Homeware";
}
