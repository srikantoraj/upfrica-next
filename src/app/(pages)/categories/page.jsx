"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


const Categories = () => {
    const [categories, setCategories] = useState([])
    // const products = [
    //     { id: 1, name: "Product 1", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBemNHQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c7b6801b31bb18ffcffd43fb5da3ca3e26c90a24/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-08-23%20at%2007.41.24.png" },
    //     { id: 2, name: "Product 2", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcTUxIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--0422d37dfb7d0b07a4e036f7e02419f967abc6f0/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202023-09-15%20at%2011.16.50.png" },
    //     { id: 3, name: "Product 3", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb2MyIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1e0006fdbf091c7fcc69637a1678e7bb344316e2/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/cera.png" },
    //     { id: 4, name: "Product 4", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNW9EQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--f95e74253c8e5b1e014d9324409db1e56f725cb3/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/IMG_4602.jpeg" },
    //     { id: 5, name: "Product 5", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVFWIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2a72948914f09307c6150e4b0cd38aa17328e45a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/ah-hwtr_.jpg" },
    //     { id: 6, name: "Product 6", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBa2Y5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--bcb910e2f71337895e4a7d9cadc18da20a2e489f/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/IMG_4480.jpeg" },
    //     { id: 7, name: "Product 7", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBakZxIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1d61421dc07586a0d8101767baca8f7263593cf1/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfd187e6ae7698456a1e9d0d803437d89557e4a7/fdssk.webp" },
    //     { id: 8, name: "Product 8", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbUoyIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--eb587ccee4c641cdc584dbd6ab49028536bfb5d2/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfd187e6ae7698456a1e9d0d803437d89557e4a7/lam.webp" },
    //     { id: 9, name: "Product 9", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbUoyIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--eb587ccee4c641cdc584dbd6ab49028536bfb5d2/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfd187e6ae7698456a1e9d0d803437d89557e4a7/lam.webp" },
    //     { id: 10, name: "Product 10", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbDQwIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--37afe0e5a915b09f1a342c41c7426f75d2a686a4/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/709D5A32-B0C5-42BA-8CF1-59CBE2D5EF39.jpeg" },
    //     { id: 11, name: "Product 11", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNXNFQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--a5c8231c4a2a55343a020e89f3661048785112a4/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/Hb39ad58bc56748e0a986f924cab3ac8cO.jpg" },
    //     { id: 12, name: "Product 12", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaTFlIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d4c77d0a1880945a9d05f5b4eb72b4bbba648d3a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/e49ba540-ba5b-4564-9b65-2afc9ec2b4e4.jpg" },
    //     { id: 13, name: "Product 13", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazFNIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a6b849b8a503bb4539982c384098c399a5099b7c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/m367.jpg" },
    //     { id: 14, name: "Product 14", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdnB1IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--60b9f08d0c8b8897598578d128bf6d5f64aa4b36/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfd187e6ae7698456a1e9d0d803437d89557e4a7/c-m-b.webp" },
    //     { id: 15, name: "Product 15", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOTBIQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--a15e7935b6a62f9d33e9e0d44881e4b5539e6c96/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/upfricatricycle.jpg" },
    //     { id: 16, name: "Product 15", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaWYzIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6d377ed6bd59256315488890448a376f8a2c9be8/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/l100s.jpg" },
    //     { id: 17, name: "Product 15", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcXNVIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--df1d44d4e3a4cd870544e32058401630cfccb349/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/ac-welther1_.jpg" },
    //     { id: 18, name: "Product 15", image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalY5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3c404aba0eadccc764ed9ec48ebfff146c4caca2/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/TREtE.jpg" },
    // ];


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