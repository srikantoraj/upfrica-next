"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


const Categories = () => {
    const [categories, setCategories] = useState([])
  

    useEffect(() => {
        const Categories = async () => {
            const res = await fetch('https://upfrica-staging.herokuapp.com/api/v1/categories', {
            });

            if (!res.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await res.json();
            setCategories(data.categories);

            if (!categories || categories.length === 0) {
                return <p className="text-center">No categories available.</p>;
            }
        }
        Categories()
    }, [])

    return (
        <div className='bg-gray-100'>
            <div className="flex flex-col items-center justify-center   py-20">
                {/* Heading */}
                <h1 className="text-4xl font-bold mb-6">Shop by Categories</h1>

                {/* Search Input Field */}
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="border border-gray-300 p-3 rounded-full w-80 shadow-md focus:outline-none focus:border-purple-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 container mx-auto">
                {categories.map((product) => (
                    <Link href={`/categories/${product.slug}`} key={product.id}>
                        <div  className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 h-full flex flex-col items-center">
                            {/* Image Section */}

                            <img
                                src={product.image}
                                alt={product.slug}
                                className="w-[200px] h-[200px] object-cover rounded-full mb-4 shadow-md"
                            />

                            {/* Name Section */}
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default Categories;