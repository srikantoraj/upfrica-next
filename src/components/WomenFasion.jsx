// import Link from 'next/link';
// import React from 'react';
// import { IoIosArrowRoundForward } from 'react-icons/io';
// import { FaShoppingCart } from "react-icons/fa";

// const WomenFasion = async ({ title }) => {


//     const res = await fetch("https://media.upfrica.com/api/product-list/women/", {
//         next: { revalidate: 120 },
//     });

//     if (!res.ok) {
//         const errorText = await res.text();
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
//         return (
//             <div className="container mx-auto p-4">
//                 <h1 className="text-xl font-bold text-red-600">Error parsing product data</h1>
//                 <p className="text-base">{error.message}</p>
//             </div>
//         );
//     }

//     const products = productsData.results || [];


//     return (
//         <div className="container mx-auto bg-white shadow-md py-10 mb-2 p-5 rounded-lg">
//             {/* Header */}
//             <div className="text-xl md:text-3xl font-extrabold tracking-wide pb-4">
//                 <h1>{title}</h1>
//             </div>

//             {/* Horizontal Scroll Container */}
//             <div className="overflow-x-auto pb-4">
//                 <div className="flex space-x-4">
//                     {products.map((product) => (
//                         <div
//                             key={product.id}
//                             className="border shadow-lg rounded-lg overflow-hidden flex flex-col min-w-[200px] h-[220px]"
//                         >
//                             {/* Product Image */}
//                             <div className="flex-grow overflow-hidden">
//                                 {(() => {
//                                     const country = product.seller_country?.toLowerCase() || 'gh';
//                                     const town = product.seller_town?.toLowerCase() || 'a';
//                                     const condition = product.condition?.slug || 'new';
//                                     const seo_slug = product.seo_slug || 'product';

//                                     return (
//                                         <Link
//                                             href={`/${country}/${seo_slug}/`}
//                                         >
//                                             <img
//                                                 src={product.product_images?.[0]}
//                                                 alt={product.title}
//                                                 className="w-full h-full object-cover transform transition-all duration-1000 ease-in-out hover:scale-110 hover:-translate-y-2"
//                                             />
//                                         </Link>
//                                     );
//                                 })()}
//                             </div>

//                             {/* Bottom Section */}
//                             <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
//                                 <div className="flex gap-2">
//                                     <p className="text-base font-bold text-gray-800">
//                                         GHS{(product.sale_price_cents ?? product.price_cents) / 100}
//                                     </p>
//                                     <p className="text-base text-gray-500 line-through">
//                                         GHS{product.price_cents / 100}
//                                     </p>
//                                 </div>
//                                 <button className="p-1 border-2 border-black rounded">
//                                     <FaShoppingCart className="text-purple-500" size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//             </div>
//         </div>
   
//     );
// };

// export default WomenFasion;



// components/WomenFashion.jsx
import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FaShoppingCart } from 'react-icons/fa'

// only the price widget runs on the client
const Price = dynamic(() => import('./Price'), { ssr: false })

export default async function WomenFashion({ title }) {
    const res = await fetch(
        'https://media.upfrica.com/api/product-list/women/',
        { next: { revalidate: 120 } }
    )

    if (!res.ok) {
        // You can render your error UI here
        throw new Error(`Failed to fetch products: ${res.status}`)
    }

    const { results: products } = await res.json()

    return (
        <div className="container mx-auto bg-white shadow-md py-10 mb-2 p-5 rounded-lg">
            {/* Header */}
            <div className="text-xl md:text-3xl font-extrabold tracking-wide pb-4">
                <h1>{title}</h1>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4">
                    {products.map((product) => {
                        const {
                            id,
                            title: prodTitle,
                            product_images,
                            seller_country,
                            seo_slug,
                            slug,
                            price_cents,
                            sale_price_cents,
                            price_currency,
                            sale_end_date,
                            on_sales,
                        } = product

                        const countryCode = (seller_country || 'gh').toLowerCase()
                        const pathSlug = seo_slug || slug

                        return (
                            <div
                                key={id}
                                className="border shadow-lg rounded-lg overflow-hidden flex flex-col min-w-[200px] h-[220px]"
                            >
                                {/* Image */}
                                <div className="flex-grow overflow-hidden">
                                    <Link href={`/${countryCode}/${pathSlug}/`}>
                                        <Image
                                            src={product_images?.[0] || '/placeholder.png'}
                                            alt={prodTitle}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transform transition-all duration-1000 ease-in-out hover:scale-110 hover:-translate-y-2"
                                        />
                                    </Link>
                                </div>

                                {/* Price + Cart (client) */}
                                <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                                    <Price
                                        priceCents={price_cents}
                                        salePriceCents={sale_price_cents}
                                        priceCurrency={price_currency}
                                        saleEndDate={sale_end_date}
                                        onSales={on_sales}
                                    />
                                    <button className="p-1 border-2 border-black rounded">
                                        <FaShoppingCart className="text-purple-500" size={20} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
