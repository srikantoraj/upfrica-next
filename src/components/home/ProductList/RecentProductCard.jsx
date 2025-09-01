"use client";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt, FaHeart } from "react-icons/fa";
import Link from "next/link";
import { convertPrice } from "@/app/utils/utils";
import { useSelector } from "react-redux";

export default function RecentProductCard({ product }) {
  const {
    product_images,
    title,
    price_cents,
    price_currency,
    category,
    slug,
    seo_slug,
    seller_country,
    condition,
    seller_town,
  } = product;
  const country = seller_country?.toLowerCase() || "gh";
  const town = seller_town?.toLowerCase() || "accra";
  const exchangeRates = useSelector((state) => state.exchangeRates.rates);
  const convertedPrice = convertPrice(
    price_cents / 100,
    price_currency,
    "GHS",
    exchangeRates,
  );
  // console.log('Converted Price:', convertedPrice);

  if (!product_images) return null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[270px] font-sans">
      {/* Image Section */}
      <div className="relative w-full h-[160px]">
        {product_images.length > 0 && (
          <Link href={`/${country}/${seo_slug}/`}>
            {/* Wrapping with an anchor tag for accessibility */}
            <span className="block relative w-[160px] h-[160px]">
              <img
                src={product_images[0]}
                alt={title}
                width={160}
                height={160}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </span>
          </Link>
        )}

        {/* Favorite Icon */}
        <div className="absolute top-2 right-2 bg-gray-100 border p-2 rounded-full">
          <FaHeart className="w-6 h-6 text-gray-600" />
        </div>
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900 truncate w-full overflow-hidden">
            {title}
          </h2>
        </div>
      </div>

      {/* Price & Cart Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {/* <p className="text-lg font-bold text-gray-900">
              {price_currency}{parseInt(price_cents) / 100}
            </p> */}
            <p className="text-lg font-bold text-gray-900">
              GHS {convertedPrice?.toFixed(2)}
            </p>
            {/* <p className="text-sm text-gray-500 line-through">
              {"GHS"}{"0.00"}
            </p> */}
          </div>
          <Link href={`/${country}/${category?.slug}/${slug}/`}>
            <div className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
