'use client'

import React from 'react'
import Link from 'next/link'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FaBolt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectSelectedCountry } from '@/app/store/slices/countrySlice'
import { convertPrice } from '@/app/utils/utils'

export default function EarlyDealsClient({ products }) {
    const selectedCountry = useSelector(selectSelectedCountry)
    const exchangeRates = useSelector((state) => state.exchangeRates.rates)
    const symbol = selectedCountry?.symbol || ''

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
                        price_cents,
                        sale_price_cents,
                        price_currency,
                        sale_end_date,
                        on_sales,
                        seller_country,
                        seo_slug,
                        slug,
                    } = product

                    // Sale is active only if there's a future end date AND (a sale price or on_sales flag)
                    const isOnSaleActive =
                        sale_end_date &&
                        new Date(sale_end_date) > new Date() &&
                        (sale_price_cents > 0 || on_sales)

                    // Convert prices (divide by 100 to get major units)
                    const convertedPrice = convertPrice(
                        price_cents / 100,
                        price_currency,
                        selectedCountry?.code,
                        exchangeRates
                    )
                    const convertedSalePrice =
                        isOnSaleActive && sale_price_cents > 0
                            ? convertPrice(
                                sale_price_cents / 100,
                                price_currency,
                                selectedCountry?.code,
                                exchangeRates
                            )
                            : null

                    // Format display
                    const displayPrice =
                        isOnSaleActive && convertedSalePrice != null
                            ? convertedSalePrice.toFixed(2)
                            : convertedPrice.toFixed(2)
                    const originalPriceStr = isOnSaleActive
                        ? `${symbol} ${convertedPrice.toFixed(2)}`
                        : null

                    // Build URL
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
                                    <img
                                        src={product_images?.[0] || 'https://via.placeholder.com/150'}
                                        alt={title || 'Product image'}
                                        className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
                                    />
                                </Link>
                            </div>

                            {/* Price + Cart */}
                            <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-base font-bold text-gray-800">
                                            {symbol} {displayPrice}
                                        </p>
                                        {isOnSaleActive && originalPriceStr && (
                                            <p className="text-sm text-gray-500 line-through">
                                                {originalPriceStr}
                                            </p>
                                        )}
                                    </div>
                                </div>
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
