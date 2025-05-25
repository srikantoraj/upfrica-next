// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useSelector } from 'react-redux';
// import { convertPrice } from '@/app/utils/utils';
// import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

// export default function ShopCard({ product }) {
//     const {
//         product_images,
//         title,
//         price_cents,
//         price_currency,
//         seller_country,
//         seo_slug,
//     } = product;

//     const [imageOk, setImageOk] = useState(true);
//     const country = seller_country?.toLowerCase() || 'gh';
//     const exchangeRates = useSelector((state) => state.exchangeRates.rates);

//     const convertedPrice = convertPrice(price_cents / 100, price_currency, 'GHS', exchangeRates);
//     const imageUrl = imageOk ? product_images?.[0] : '/placeholder.png'; // fallback if broken image

//     if (!imageUrl) return null;

//     return (
//         <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-2 flex flex-col">
//             {/* Product Image */}
//             <Link href={`/${country}/${seo_slug}`} target="_blank" className="relative group">
//                 <img
//                     src={imageUrl}
//                     alt={title}
//                     onError={() => setImageOk(false)}
//                     className="rounded-md w-full h-60 object-cover bg-gray-50 group-hover:scale-105 transition-transform"
//                 />

//                 {/* Like Button */}
//                 <Link href="/login" className="absolute top-2 right-2">
//                     <span className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
//                         <AiOutlineHeart className="text-gray-700" />
//                     </span>
//                 </Link>
//             </Link>

//             {/* Product Info */}
//             <div className="flex-1 mt-3 px-1">
//                 <h5 className="text-sm font-semibold leading-tight line-clamp-2">
//                     <Link href={`/${country}/${seo_slug}`} target="_blank">
//                         {title}
//                     </Link>
//                 </h5>
//             </div>

//             {/* Price + Buy Button */}
//             <div className="mt-3 flex items-center justify-between px-1 pb-2">
//                 <div className="text-gray-900 font-semibold text-sm">
//                     GHS {convertedPrice?.toFixed(2)}
//                 </div>
//                 <button
//                     title="Buy Now"
//                     className="flex items-center gap-1 text-sm text-white bg-violet-600 hover:bg-violet-700 px-3 py-1 rounded-full transition"
//                 >
//                     <AiOutlineShoppingCart className="text-base" />
//                     Buy
//                 </button>
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '@/app/utils/utils';
import { addToBasket } from '@/app/store/slices/cartSlice';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

export default function ShopCard({ product }) {
    const {
        id,
        product_images,
        title,
        price_cents,
        sale_price_cents,
        sale_end_date,
        price_currency,
        postage_fee_cents,
        secondary_postage_fee_cents,
        seller_country,
        seo_slug,
    } = product;

    const dispatch = useDispatch();
    const router = useRouter();
    const { token } = useSelector((state) => state.auth);
    const exchangeRates = useSelector((state) => state.exchangeRates.rates);
    const selectedCountry = useSelector((state) => state.selectedCountry);
    const currencyCode = selectedCountry?.code ?? 'GHS';
    const symbol = selectedCountry?.symbol ?? '₵';

    // Determine if a sale is active
    const { activeCents, originalCents, saleActive } = useMemo(() => {
        const now = Date.now();
        const saleEnd = sale_end_date ? new Date(sale_end_date).getTime() : 0;
        const isActive = sale_price_cents > 0 && saleEnd > now;
        const base = isActive ? sale_price_cents : price_cents;
        return {
            saleActive: isActive,
            activeCents: base,
            originalCents: isActive ? price_cents : null,
        };
    }, [price_cents, sale_price_cents, sale_end_date]);

    // Convert into display strings
    const displayPrice = useMemo(
        () => convertPrice(activeCents / 100, price_currency, currencyCode, exchangeRates).toFixed(2),
        [activeCents, price_currency, currencyCode, exchangeRates]
    );
    const displayOriginal = useMemo(
        () => originalCents
            ? convertPrice(originalCents / 100, price_currency, currencyCode, exchangeRates).toFixed(2)
            : null,
        [originalCents, price_currency, currencyCode, exchangeRates]
    );

    const handleBuyNow = () => {
        if (!token) {
            // not signed in → send to signin and come back
            router.push(`/signin?next=${encodeURIComponent(window.location.pathname)}`);
            return;
        }
        // add 1 to cart
        dispatch(addToBasket({
            id,
            title,
            price_cents: activeCents,
            quantity: 1,
            image: product_images,
            postage_fee: postage_fee_cents || 0,
            secondary_postage_fee: secondary_postage_fee_cents || 0,
            variants: {},
            sku: `SKU-${id}`,
        }));
        // go straight to checkout
        router.push('/checkout');
    };

    const country = (seller_country || 'gh').toLowerCase();
    const imageUrl = product_images?.[0] || '/placeholder.png';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-2 flex flex-col">
            {/* Product Image */}
            <Link href={`/${country}/${seo_slug}`} target="_blank" className="relative group">
                <img
                    src={imageUrl}
                    alt={title}
                    className="rounded-md w-full h-60 object-cover bg-gray-50 group-hover:scale-105 transition-transform"
                />
                <Link href="/login" className="absolute top-2 right-2">
                    <span className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
                        <AiOutlineHeart className="text-gray-700" />
                    </span>
                </Link>
            </Link>

            {/* Title */}
            <div className="flex-1 mt-3 px-1">
                <h5 className="text-sm font-semibold leading-tight line-clamp-2">
                    <Link href={`/${country}/${seo_slug}`} target="_blank">
                        {title}
                    </Link>
                </h5>
            </div>

            {/* Price & Buy */}
            <div className="mt-3 flex items-center justify-between px-1 pb-2">
                <div className="text-gray-900 font-semibold text-sm">
                    {symbol}{displayPrice}
                    {saleActive && (
                        <del className="text-gray-400 text-xs ml-1">
                            {symbol}{displayOriginal}
                        </del>
                    )}
                </div>
                <button
                    onClick={handleBuyNow}
                    title="Buy Now"
                    className="flex items-center gap-1 text-sm text-white bg-violet-600 hover:bg-violet-700 px-3 py-1 rounded-full transition"
                >
                    <AiOutlineShoppingCart className="text-base" />
                    Buy
                </button>
            </div>
        </div>
    );
}
