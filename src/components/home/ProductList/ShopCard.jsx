'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { convertPrice } from '@/app/utils/utils';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

export default function ShopCard({ product }) {
  if (!product) return null; // important guard!

  const {
    product_images = [],
    title = '',
    price_cents = 0,
    price_currency = 'GHS',
    seller_country = 'gh',
    seo_slug = '',
  } = product;

  const [imageOk, setImageOk] = useState(true);
  const exchangeRates = useSelector((state) => state.exchangeRates.rates);

  const convertedPrice = convertPrice(price_cents / 100, price_currency, 'GHS', exchangeRates);
  const country = seller_country.toLowerCase();
  const imageUrl = imageOk && product_images.length > 0 ? product_images[0] : '/placeholder.png';

  return (
   
    <div className="bg-white border rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition duration-300 p-2 flex flex-col">
      {/* Product Image */}
      <div className="relative">
        <Link href={`/${country}/${seo_slug}`} target="_blank" className="block">
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageOk(false)}
            className="w-full h-48 object-cover bg-gray-50"
          />
        </Link>

        {/* Like Icon */}
        <Link href="/login" className="absolute top-2 right-2">
          <div className="bg-white rounded-full p-1.5 shadow hover:bg-gray-100">
            <AiOutlineHeart className="text-gray-700 text-lg" />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-3 flex-1">
        <Link href={`/${country}/${seo_slug}`} target="_blank">
          <h5 className="text-sm font-semibold leading-snug line-clamp-2 mb-2">{title}</h5>
        </Link>

        <div className="mt-auto">
        <div className="text-purpleBrand font-semibold text-sm">
                    GHS {convertedPrice?.toFixed(2)}
                </div>

          <button
            title="Buy Now"
            className="w-full flex justify-center items-center gap-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition"
          >
            <AiOutlineShoppingCart className="text-base" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}