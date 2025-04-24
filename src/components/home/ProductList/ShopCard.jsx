'use client';
import { useState } from 'react';
import Link from 'next/link';
import { convertPrice } from '@/app/utils/utils';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiOutlineHeart } from 'react-icons/ai';

export default function ShopCard({ product }) {
    const {
        product_images,
        title,
        price_cents,
        price_currency,
        seller_country,
        seller_town,
        seo_slug,
    } = product;

    const [imageOk, setImageOk] = useState(true);
    const country = seller_country?.toLowerCase() || 'gh';

    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const convertedPrice = convertPrice(price_cents / 100, price_currency, 'GHS', exchangeRates);
    const imageUrl = product_images?.[0];

    if (!imageUrl) return null;

    return (
        <div className="mt-4">
            <div className="bg-white shadow p-2 pb-0 h-full rounded-t-md border border-[#dee2e6] drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                <div className="relative">
                    <Link href={`/${country}/${seo_slug}`} target="_blank">
                        <img
                            src={imageUrl}
                            alt={title}
                            onError={() => setImageOk(false)}
                            className="w-full h-[16.6rem] bg-[#F7F8FA] rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    </Link>

                    <Link href="/login">
                        <div className="absolute top-2 right-2 z-10">
                            <span className="inline-flex items-center justify-center bg-white rounded-full p-1 shadow hover:bg-gray-100">
                                <AiOutlineHeart className="text-lg text-gray-700" />
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="px-2 pt-3" style={{ maxHeight: '3.5rem' }}>
                    <h5 className="text-sm font-semibold leading-tight line-clamp-2">
                        <Link href={`/${country}/${seo_slug}`} target="_blank">
                            {title}
                        </Link>
                    </h5>
                </div>

                <div className="border-t mt-2 py-1 px-2">
                    <div className="flex justify-between items-center">
                        <h6 className="text-sm text-gray-900 font-medium">GHS {convertedPrice?.toFixed(2)}</h6>
                        <button
                            title="Add to basket"
                            className="border border-white p-1 rounded hover:bg-gray-100"
                        >
                            <AiOutlineShoppingCart className="text-base text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}