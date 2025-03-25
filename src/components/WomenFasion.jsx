import Link from 'next/link';
import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { FaShoppingCart } from "react-icons/fa";

const WomenFasion = async ({ title }) => {
    // const products = [
    //     {
    //         id: 1,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBenNmQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--68d9ccfdcdc581f65ba7564f466b9861010994b5/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/ladies-hand-bag-luxury-.jpg",
    //         oldPrice: 1200,
    //         newPrice: 1000,
    //     },
    //     {
    //         id: 2,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMEVrQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--6ff5abb94e944fa9581c7119e4a51b1894696dea/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/african-matching-shoes-purse-and-hand-bag-set-for-ladies.jpg",
    //         oldPrice: 2000,
    //         newPrice: 1800,
    //     },
    //     {
    //         id: 3,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBM2dRQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--21dad026c7787be8e23216097649d7a72ae3c268/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/womens-bodycon-dress-print-party-casual-and-club-dress-for-girls.jpg",
    //         oldPrice: 1500,
    //         newPrice: 1300,
    //     },
    //     {
    //         id: 4,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBL1ZMQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--37636d50d0511136c8583974e586df55dba04226/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--cfd187e6ae7698456a1e9d0d803437d89557e4a7/wmd-1.webp",
    //         oldPrice: 800,
    //         newPrice: 700,
    //     },
    //     {
    //         id: 5,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNTFNQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1563ec72e46a8aaeb7faecec8e8413b55bba1caf/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-11-18%20at%2017.50.56.png",
    //         oldPrice: 2200,
    //         newPrice: 2000,
    //     },
    //     {
    //         id: 6,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeFFwQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--3fa200c05fd49757cadb43c5be07aef2f424ddac/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/-manual-filling-machine-with-scale-for-creampasteliquid-a03-liquid-filling.webp",
    //         oldPrice: 1800,
    //         newPrice: 1600,
    //     },
    //     {
    //         id: 7,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK3hKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--f16a3e5d8f33ca8ab0f9649dd764a084534f1e64/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/iRG7He6b67426514c4bc4a895d5446b83b13eW.jpg",
    //         oldPrice: 3000,
    //         newPrice: 2700,
    //     },
    //     {
    //         id: 8,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNk1nQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1da211ec66631088c52c8a123e42bfdc5653d0d8/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/school-bag-multi-layer-large-capacity-student-shoulder-bag-teenage.webp",
    //         oldPrice: 900,
    //         newPrice: 850,
    //     },
    //     {
    //         id: 9,
    //         image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMWtrQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--62594c4a70b9b809e4c8abed6c714a8a19f0cca0/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/blood-pressure-bp-monitor-digital-arm-portable-intelligent-detection-digital-sphygmomanometer-led-display-usb-charging.webp",
    //         oldPrice: 1700,
    //         newPrice: 1500,
    //     },
    // ];

    const res = await fetch("https://media.upfrica.com/api/product-list/women/", {
        next: { revalidate: 120 },
    });

    if (!res.ok) {
        const errorText = await res.text();
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-red-600">Error fetching products</h1>
                <p className="text-base">Status Code: {res.status}</p>
                <pre className="text-sm bg-gray-100 p-2">{errorText}</pre>
            </div>
        );
    }

    const text = await res.text();

    let productsData;
    try {
        productsData = JSON.parse(text);
    } catch (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-red-600">Error parsing product data</h1>
                <p className="text-base">{error.message}</p>
            </div>
        );
    }

    const products = productsData.results || [];


    return (
        <div className="container mx-auto bg-white shadow-md py-10 mb-2 p-5 rounded-lg">
            {/* Header */}
            <div className="text-xl md:text-3xl font-extrabold tracking-wide pb-4">
                <h1>{title}</h1>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border shadow-lg rounded-lg overflow-hidden flex flex-col min-w-[200px] h-[220px]"
                        >
                            {/* Product Image */}
                            <div className="flex-grow overflow-hidden">
                                {(() => {
                                    const country = product.seller_country?.toLowerCase() || 'gh';
                                    const categorySlug = product.category?.slug || 'category';
                                    const slug = product.slug || 'product';

                                    return (
                                        <Link href={`/${country}/${categorySlug}/${slug}/`}>
                                            <img
                                                src={product.product_images?.[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover transform transition-all duration-1000 ease-in-out hover:scale-110 hover:-translate-y-2"
                                            />
                                        </Link>
                                    );
                                })()}
                            </div>

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                                <div className="flex gap-2">
                                    <p className="text-base font-bold text-gray-800">
                                        GHS{(product.sale_price_cents ?? product.price_cents) / 100}
                                    </p>
                                    <p className="text-base text-gray-500 line-through">
                                        GHS{product.price_cents / 100}
                                    </p>
                                </div>
                                <button className="p-1 border-2 border-black rounded">
                                    <FaShoppingCart className="text-purple-500" size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
        // <div className="container mx-auto p-4">
        //     <h1 className="text-2xl font-bold mb-4">Trending Products</h1>
        //     <div className="flex overflow-x-auto space-x-4">
        //         {products.map((product) => (
        //             <div key={product.id} className="min-w-[200px] border rounded shadow p-2">
        //                 <img
        //                     src={product.product_images?.[0]}
        //                     alt={product.title}
        //                     className="w-full h-40 object-cover"
        //                 />
        //                 <h2 className="text-sm font-semibold mt-2">{product.title}</h2>
        //                 <p className="text-gray-700 font-bold mt-1">
        //                     {(product.sale_price_cents ?? product.price_cents) / 100} GHS
        //                 </p>
        //                 {product.sale_price_cents > 0 && (
        //                     <p className="text-sm line-through text-gray-400">
        //                         {product.price_cents / 100} GHS
        //                     </p>
        //                 )}
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
};

export default WomenFasion;
