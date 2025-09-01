"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { convertPrice } from "@/app/utils/utils";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

export default function RelatedProductCard({ product }) {
  const selectedCountry = useSelector(selectSelectedCountry);
  const exchangeRates = useSelector((state) => state.exchangeRates.rates);

  const {
    image_url,
    title,
    price_cents,
    price_currency,
    slug,
    seo_slug,
    sale_end_date,
    sale_price_cents,
  } = product;

  if (!image_url) return null;

  // build country‐code for URL and currency settings
  const countryCode = selectedCountry?.code || "GHS";
  const countryPath = selectedCountry?.code?.toLowerCase() || "gh";
  const currencySym = selectedCountry?.symbol || "GHS";

  // convert regular price
  const convertedPrice = convertPrice(
    price_cents / 100,
    price_currency,
    countryCode,
    exchangeRates,
  );

  // is there a valid, ongoing sale?
  const isOnSaleActive =
    sale_end_date &&
    new Date(sale_end_date) > new Date() &&
    sale_price_cents > 0;

  // convert sale price if active
  const convertedSalePrice =
    isOnSaleActive && sale_price_cents
      ? convertPrice(
          sale_price_cents / 100,
          price_currency,
          countryCode,
          exchangeRates,
        )
      : null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[370px] font-sans">
      {/* Image Section */}
      <div className="relative w-full h-[230px]">
        <Link href={`/${countryPath}/${seo_slug || slug}/`}>
          <span className="block relative w-full h-[230px]">
            <img
              src={image_url}
              alt={title}
              width={230}
              height={230}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </span>
        </Link>

        {/* Favorite Icon */}
        <div className="absolute top-2 right-2 bg-gray-100 border p-2 rounded-full">
          <FaHeart className="w-6 h-6 text-gray-600" />
        </div>

        {/* Sales Badge */}
        {isOnSaleActive && (
          <div className="absolute bottom-2 left-2">
            <button className="bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaBolt className="w-4 h-4" />
              Sales
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-4 py-3">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 truncate w-full overflow-hidden">
          {title}
        </h2>
        <p className="text-sm text-gray-500">1083+ sold recently</p>
      </div>

      {/* Price & Cart Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-2 lg:px-4 py-3">
          <div className="flex items-center gap-2">
            {isOnSaleActive ? (
              <>
                <p className="text-base lg:text-lg font-medium text-gray-900">
                  {currencySym} {convertedSalePrice?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 line-through">
                  {convertedPrice?.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-base lg:text-lg font-bold text-gray-900">
                {currencySym} {convertedPrice?.toFixed(2)}
              </p>
            )}
          </div>
          <Link href={`/${countryPath}/${seo_slug || slug}/`}>
            <div className="p-1 border rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors">
              <AiOutlineShoppingCart className="w-5 lg:w-6 h-5 lg:h-6 text-purple-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
