"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

// A small skeleton loader component
function CategorySkeleton() {
    // Let's display 6 placeholders
    const skeletonArray = [1, 2, 3, 4, 5, 6];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 container mx-auto">
            {skeletonArray.map((num) => (
                <div
                    key={num}
                    className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 h-full flex flex-col items-center
                     animate-pulse"
                >
                    {/* Circle placeholder for the image */}
                    <div className="rounded-full bg-gray-300 w-[200px] h-[200px] mb-4" />
                    {/* Rectangle placeholder for the text */}
                    <div className="h-4 bg-gray-300 w-1/2 rounded" />
                </div>
            ))}
        </div>
    );
}

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // track if data is loading

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://upfrica.com/api/v1/categories", {
                    next: { revalidate: 120 },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }

                let data = await res.json();
                console.log(data);
                data = data.categories.filter((item) => item.image && item.active);
                setCategories(data);
            } catch (error) {
                console.error(error);
            } finally {
                // Whether success or error, stop the loading spinner/skeleton
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-gray-100">
            <div className="flex flex-col items-center justify-center py-6 lg:py-20 p-4">
                {/* Heading */}
                <h1 className="text-2xl lg:text-4xl font-bold mb-6">Shop by Categories</h1>

                {/* Search Input Field */}
                {/* <input
          type="text"
          placeholder="Search categories..."
          className="border border-gray-300 p-3 rounded-full w-2/6 shadow-md
                     focus:outline-none focus:border-purple-500"
        /> */}
                <div className="relative w-full sm:w-3/12">
                    {/* The search input */}
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="border border-gray-300 p-3 rounded-full w-full shadow-md 
                   focus:outline-none focus:border-[#8710D8] pr-10 text-lg ps-4"
                    // pr-10 gives space for the icon on the right
                    />

                    {/* The icon, absolutely positioned to the right */}
                    <FaSearch
                        className="absolute top-1/2 right-4 
                                transform -translate-y-1/2 
                                text-gray-400 hover:text-gray-600 
                                cursor-pointer h-6 w-6"
                        aria-hidden="true"
                    />
                </div>
            </div>

            {loading ? (
                // Render skeleton while loading
                <CategorySkeleton />
            ) : categories.length === 0 ? (
                // If no categories found, show fallback text
                <p className="text-center pb-10">No categories available.</p>
            ) : (
                // Render the real categories
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 container mx-auto">
                    {categories.map((product) => (
                        <Link href={`/categories/${product.slug}`} key={product.id}>
                            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 h-full flex flex-col items-center hover:shadow-md hover:border-gray-300 transition">
                                {/* Image Section */}
                                <img
                                    src={product.image}
                                    alt={product.slug}
                                    className="w-[200px] h-[200px] object-cover rounded-full mb-4 shadow-md"
                                />

                                {/* Name Section */}
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {product.name}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;
