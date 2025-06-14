// components/NewArrivals.jsx
import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { FaShoppingCart } from 'react-icons/fa'

// only the price widget runs in the browser
const Price = dynamic(() => import('../../Price'), { ssr: false })

export default async function NewArrivals({ title }) {
    const res = await fetch(
        //'https://media.upfrica.com/api/product-list/recent/',
        'https://media.upfrica.com/api/product-list/recent/',
        { next: { revalidate: 120 } }
    )

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`)
    }

    const { results: products } = await res.json()

    return (
        <div className="container mx-auto bg-white shadow-md py-10 mb-2 p-5 rounded-lg">
            {/* Header */}
            <div className="flex gap-4 pb-4 items-center justify-between md:justify-start">
                <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">
                    {title}
                </h1>
                <IoIosArrowRoundForward className="h-8 w-8 text-gray-700" />
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
