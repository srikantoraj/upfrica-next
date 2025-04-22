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
        <Link
            href={`/${country}/${seo_slug}`}
            className="group relative block overflow-hidden rounded-lg bg-white aspect-[4/5] transition shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] border border-[#dee2e6] hover:shadow-lg"
        >
            {/* Product Image */}
            {imageOk ? (
                <img
                    src={imageUrl}
                    alt={title}
                    onError={() => setImageOk(false)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs bg-gray-50">
                    No image
                </div>
            )}

            {/* Info Block (bottom, solid background) */}
            <div className="absolute bottom-0 w-full bg-[#ffffffbd] text-white px-4 py-3 transition-all duration-300 group-hover:translate-y-0 translate-y-[10%]">
                <h3 className="text-sm  font-semibold line-clamp-2">{title}</h3>
                <p className="text-base font-bold leading-6 mt-1 text-[#A435F0] ">GHS {convertedPrice?.toFixed(2)}</p>
                {seller_town && <p className="text-xs text-black">{seller_town}</p>}
            </div>

            {/* Hover Icons */}
            <div className="absolute top-2 right-2 flex flex-col items-end space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-white p-1 rounded-full shadow hover:bg-rose-100 cursor-pointer">
                    <AiOutlineHeart className="text-rose-500 text-lg" title="Add to Wishlist" />
                </div>
                <div className="bg-white p-1 rounded-full shadow hover:bg-violet-100 cursor-pointer">
                    <AiOutlineShoppingCart className="text-violet-700 text-xl" title="Add to Cart" />
                </div>
            </div>
        </Link>
    );
}