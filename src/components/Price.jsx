// components/Price.jsx
'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedCountry } from '@/app/store/slices/countrySlice'
import { convertPrice } from '@/app/utils/utils'

export default function Price(props) {
    const {
        priceCents,
        salePriceCents,
        priceCurrency,
        saleEndDate,
        onSales,
        isLoading,          // <-- new boolean prop
    } = props

    const selectedCountry = useSelector(selectSelectedCountry)
    const exchangeRates = useSelector((state) => state.exchangeRates.rates)
    // if your slice tracks loading:
    // const isLoading = useSelector((state) => state.exchangeRates.loading)

    // If we’re still fetching rates (or whatever), show skeletons
    if (isLoading) {
        return (
            <div className="flex items-baseline gap-2">
                {/* main price placeholder */}
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                {/* optional sale price placeholder if on sale */}
                {salePriceCents > 0 && (
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                )}
            </div>
        )
    }

    // ——— logic stays the same once loaded ———

    const symbol = selectedCountry?.symbol || ''
    const isOnSaleActive =
        saleEndDate &&
        new Date(saleEndDate) > new Date() &&
        (salePriceCents > 0 || onSales)

    const convertedPrice = convertPrice(
        priceCents / 100,
        priceCurrency,
        selectedCountry?.code,
        exchangeRates
    )

    const convertedSalePrice =
        isOnSaleActive && salePriceCents > 0
            ? convertPrice(
                salePriceCents / 100,
                priceCurrency,
                selectedCountry?.code,
                exchangeRates
            )
            : null

    const displayPrice =
        isOnSaleActive && convertedSalePrice != null
            ? convertedSalePrice.toFixed(2)
            : convertedPrice.toFixed(2)

    return (
        <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-800">
                {symbol} {displayPrice}
            </span>
            {isOnSaleActive && convertedSalePrice != null && (
                <span className="text-sm text-gray-500 line-through">
                    {symbol} {convertedPrice.toFixed(2)}
                </span>
            )}
        </div>
    )
}
