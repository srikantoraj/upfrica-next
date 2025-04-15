'use client';
import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Link from "next/link";
import { convertPrice } from "@/app/utils/utils";
import { useSelector } from "react-redux";

export default function ShopCard({ product }) {
    const {
        product_images,
        title,
        price_cents,
        price_currency,
        category,
        slug,
        seo_slug,
        seller_country,
        seller_town
    } = product;

    // State to track image load errors
    const [imageOk, setImageOk] = useState(true);

    // Determine country code (defaulting to 'gh' if missing)
    const country = seller_country?.toLowerCase() || 'gh';

    // Get exchange rates from the Redux store and convert price to GHS
    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const convertedPrice = convertPrice(price_cents / 100, price_currency, 'GHS', exchangeRates);

    // Early return if no images exist
    if (!product_images) return null;

    // Use the first product image
    const imageUrl = product_images[0];

    return (
        <div className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md border-b border-gray-200">
            {imageOk && imageUrl ? (
                // Optionally wrap with a link for accessibility/navigation
                <Link href={`/${country}/${seo_slug}/`}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className="mx-auto h-36 w-36 rounded"
                        onError={() => setImageOk(false)}
                    />
                </Link>
            ) : (
                // Fallback when image fails to load
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded bg-gray-50">
                    <span className="text-xs text-gray-400">Image unavailable</span>
                </div>
            )}

            <h3 className="mt-4 text-sm font-medium line-clamp-1">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">GHS {convertedPrice?.toFixed(2)}</p>

            
        </div>
    );
}
