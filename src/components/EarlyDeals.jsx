

// import Link from 'next/link';
// import React from 'react';
// import { IoIosArrowRoundForward } from 'react-icons/io';
// import { AiOutlineShoppingCart } from 'react-icons/ai';

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
//             <div className="flex gap-4 pb-4 items-center justify-between md:justify-start">
//                 <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">2025 Deals</h1>
//                 <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
//             </div>

//             {/* Horizontal Scroll Container */}
//             <div className="flex space-x-4 overflow-x-auto pb-4">
//                 {productsData.results.map((product) => {
//                     // Check if the product is on sale:
//                     const isOnSale =
//                         product.sale_end_date &&
//                         new Date(product.sale_end_date) > new Date() &&
//                         product.sale_price_cents > 0;

//                     return (
//                         <div
//                             key={product.id}
//                             className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
//                         >
//                             {/* Product Image */}
//                             <div className="flex-grow overflow-hidden">
//                                 <Link
//                                     href={`/${(product?.seller_country || 'gh').toLowerCase()}/${product?.seo_slug}/`}
//                                     passHref
//                                 >
//                                     <img
//                                         src={product?.product_images?.[0] || "https://via.placeholder.com/150"}
//                                         alt={product?.title || 'Product image'}
//                                         className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
//                                     />
//                                 </Link>
//                             </div>
//                             {/* Bottom Section */}
//                             <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
//                                 <div className="flex gap-2">
//                                     {isOnSale ? (
//                                         <>
//                                             <p className="text-base text-gray-800 font-bold">
//                                                 {`₵ ${(product.sale_price_cents / 100).toFixed(0)}`}
//                                             </p>
//                                             <p className="text-base  text-gray-500 line-through">
//                                                 {product.price_cents > 0 ? `₵ ${(product.price_cents / 100).toFixed(0)}` : "Contact Seller"}
//                                             </p>
                                            
//                                         </>
//                                     ) : (
//                                         <p className="text-base font-bold text-gray-800">
//                                                 {product.price_cents > 0 ? `₵ ${(product.price_cents / 100).toFixed(0)}` : "Contact Seller"}
//                                         </p>
//                                     )}
//                                 </div>
//                                 <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
//                                     <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// components/EarlyDeals.jsx
import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FaBolt } from 'react-icons/fa'

// only the price widget runs on client
const Price = dynamic(() => import('./Price'), { ssr: false })

export default async function EarlyDeals() {
    const res = await fetch(
        //'https://media.upfrica.com/api/product-list/2025/',
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product-list/2025/`,
        { next: { revalidate: 120 } }
    )

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`)
    }

    const { results: products } = await res.json()

    return (
        <div className="container bg-white py-5 mb-2 px-5">
            {/* Header */}
            <div className="flex gap-4 pb-4 items-center justify-between md:justify-start">
                <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">
                    2025 Deals
                </h1>
                <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
            </div>

            {/* Products Carousel */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {products.map((product) => {
                    const {
                        id,
                        product_images,
                        title,
                        sale_end_date,
                        sale_price_cents,
                        on_sales,
                        seller_country,
                        seo_slug,
                        slug,
                        price_cents,
                        price_currency,
                    } = product

                    const isOnSaleActive =
                        sale_end_date &&
                        new Date(sale_end_date) > new Date() &&
                        (sale_price_cents > 0 || on_sales)

                    const countryCode = (seller_country || 'gh').toLowerCase()
                    const slugPath = seo_slug || slug

                    return (
                        <div
                            key={id}
                            className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
                        >
                            {/* Image + Sale Badge */}
                            <div className="relative flex-grow overflow-hidden">
                                {isOnSaleActive && (
                                    <div className="absolute top-4 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                        <FaBolt className="w-3 h-3" />
                                        Sale
                                    </div>
                                )}
                                <Link href={`/${countryCode}/${slugPath}/`}>
                                    <Image
                                        src={product_images?.[0] || '/placeholder.png'}
                                        alt={title || 'Product image'}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
                                    />
                                </Link>
                            </div>

                            {/* Price + Cart */}
                            <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                                <Price
                                    priceCents={price_cents}
                                    salePriceCents={sale_price_cents}
                                    priceCurrency={price_currency}
                                    saleEndDate={sale_end_date}
                                    onSales={on_sales}
                                />
                                <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
                                    <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
                                </button>
                                
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
