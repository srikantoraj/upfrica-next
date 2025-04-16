


// import Link from 'next/link';
// import React from 'react';
// import { IoIosArrowRoundForward } from 'react-icons/io';
// import { FaShoppingCart } from "react-icons/fa";
// import { AiOutlineShoppingCart } from 'react-icons/ai';
// import Image from 'next/image';

// const EarlyDeals = async () => {


//     const res = await fetch("https://media.upfrica.com/api/product-list/2025/", {
//         next: { revalidate: 120 }, // Revalidate every 2 minutes
//     });

//     if (!res.ok) {
//         console.error("HTTP error:", res.status);
//         const errorText = await res.text();
//         console.error("Error details:", errorText);
//         return (
//             <div className="container mx-auto p-4">
//                 <h1 className="text-xl font-bold text-red-600">Error fetching products</h1>
//                 <p className="text-base">Status Code: {res.status}</p>
//                 <pre className="text-sm bg-gray-100 p-2">{errorText}</pre>
//             </div>
//         );
//     }

//     const text = await res.text();

//     let productsData;
//     try {
//         productsData = JSON.parse(text);
//     } catch (error) {
//         console.error("Error parsing JSON:", error);
//         return (
//             <div className="container mx-auto p-4">
//                 <h1 className="text-xl font-bold text-red-600">Error parsing product data</h1>
//                 <p className="text-base">{error.message}</p>
//             </div>
//         );
//     }


//     return (
//         <div className="container bg-white py-5 mb-2 px-5 ">
//             {/* Header */}
//             <div className="flex  gap-4 pb-4">
//                 <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">2025 Deals</h1>
//                 <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
//             </div>

//             {/* Horizontal Scroll Container */}
//             <div className="flex space-x-4 overflow-x-auto pb-4">
//                 {productsData.results.map((product) => (
//                     <div
//                         key={product.id}
//                         className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
//                     >
//                         {/* Product Image */}
//                         <div className="flex-grow overflow-hidden">
//                 <Link
//                     href={`/${(product?.seller_country || 'gh').toLowerCase()}/${product?.seo_slug}/`}
//                     passHref
//                 >
//                     <img
//                     src={product?.product_images?.[0] || "https://via.placeholder.com/150"}
//                     alt={product?.title || 'Product image'}
//                     className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
//                     />
//                 </Link>
//                 </div>
//                 {/* Bottom Section */}
//                 <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
//                     <div className="flex gap-2">
//                         <p className="text-base font-bold text-gray-800 line-through">
//                             {product.price_cents > 0 ? `GHS ${(product.price_cents / 100).toFixed(2)}` : "Contact Seller"}
//                         </p>
//                         { product?.sale_end_date && product.sale_price_cents > 0 && (
//                             <p className="text-base text-gray-500 ">
//                                 {(product.sale_price_cents / 100).toFixed(2)}
//                             </p>
//                         )}
//                     </div>
//                     <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
//                         <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
//                     </button>
//                 </div>
//             </div>
//         ))}
//             </div>

//         </div>
//     );
// };

// export default EarlyDeals;

import Link from 'next/link';
import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const EarlyDeals = async () => {
    const res = await fetch("https://media.upfrica.com/api/product-list/2025/", {
        next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

    if (!res.ok) {
        console.error("HTTP error:", res.status);
        const errorText = await res.text();
        console.error("Error details:", errorText);
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
        console.error("Error parsing JSON:", error);
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-red-600">Error parsing product data</h1>
                <p className="text-base">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="container bg-white py-5 mb-2 px-5 ">
            {/* Header */}
            <div className="flex gap-4 pb-4 items-center justify-between md:justify-start">
                <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">2025 Deals</h1>
                <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {productsData.results.map((product) => {
                    // Check if the product is on sale:
                    const isOnSale =
                        product.sale_end_date &&
                        new Date(product.sale_end_date) > new Date() &&
                        product.sale_price_cents > 0;

                    return (
                        <div
                            key={product.id}
                            className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
                        >
                            {/* Product Image */}
                            <div className="flex-grow overflow-hidden">
                                <Link
                                    href={`/${(product?.seller_country || 'gh').toLowerCase()}/${product?.seo_slug}/`}
                                    passHref
                                >
                                    <img
                                        src={product?.product_images?.[0] || "https://via.placeholder.com/150"}
                                        alt={product?.title || 'Product image'}
                                        className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
                                    />
                                </Link>
                            </div>
                            {/* Bottom Section */}
                            <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                                <div className="flex gap-2">
                                    {isOnSale ? (
                                        <>
                                            <p className="text-base text-gray-800 font-bold">
                                                {`₵ ${(product.sale_price_cents / 100).toFixed(0)}`}
                                            </p>
                                            <p className="text-base  text-gray-500 line-through">
                                                {product.price_cents > 0 ? `₵ ${(product.price_cents / 100).toFixed(0)}` : "Contact Seller"}
                                            </p>
                                            
                                        </>
                                    ) : (
                                        <p className="text-base font-bold text-gray-800">
                                                {product.price_cents > 0 ? `₵ ${(product.price_cents / 100).toFixed(0)}` : "Contact Seller"}
                                        </p>
                                    )}
                                </div>
                                <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
                                    <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EarlyDeals;
