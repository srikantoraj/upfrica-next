// app/shops/[slug]/ShopCard.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { convertPrice } from "@/app/utils/utils";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { SITE_BASE_URL, BASE_API_URL } from "@/app/constants";

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL // e.g. https://api.upfrica.com
  || SITE_BASE_URL                       // e.g. https://www.upfrica.com
  || BASE_API_URL;                       // e.g. http://127.0.0.1:8000

function absolutize(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;    // already absolute
  if (url.startsWith("//")) return `https:${url}`;
  const base = IMAGE_BASE.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function pickFirstImage(p) {
  if (p?.thumbnail) return p.thumbnail;
  if (p?.image_objects?.[0]?.image_url) return p.image_objects[0].image_url;
  if (p?.image_objects?.[0]?.url) return p.image_objects[0].url;
  if (Array.isArray(p?.product_images) && p.product_images[0]) return p.product_images[0];
  if (Array.isArray(p?.ordered_product_images) && p.ordered_product_images[0]) return p.ordered_product_images[0];
  if (Array.isArray(p?.images) && p.images[0]) return p.images[0];
  return null;
}

export default function ShopCard({ product, onBuy }) {
  const title = product?.title || product?.name || "Product";
  const priceCents = typeof product?.price_cents === "number" ? product.price_cents : 0;
  const priceCurrency = product?.price_currency || "USD";
  const country = (product?.seller_country || product?.listing_country_code || "gh").toLowerCase();
  const slug = product?.seo_slug || product?.slug || "";
  const href = product?.frontend_url || (slug ? `/${country}/${slug}` : "#");

  const exchangeRates = useSelector((s) => s.exchangeRates.rates);
  const convertedPrice =
    convertPrice(priceCents / 100, priceCurrency, "GHS", exchangeRates) ??
    priceCents / 100;

  const [src, setSrc] = useState("/placeholder.png");

  // compute image src when product changes
  useEffect(() => {
    const raw = pickFirstImage(product);
    const abs = absolutize(raw);
    setSrc(abs || "/placeholder.png");
  }, [product]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-2 flex flex-col">
      {/* Product Image */}
      <Link href={href} target="_blank" className="relative group">
        <img
          src={src}
          alt={title}
          onError={() => setSrc("/placeholder.png")}
          className="rounded-md w-full h-60 object-cover bg-gray-50 group-hover:scale-105 transition-transform"
        />
        <span className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100">
          <AiOutlineHeart className="text-gray-700" />
        </span>
      </Link>

      {/* Product Info */}
      <div className="flex-1 mt-3 px-1">
        <h5 className="text-sm font-semibold leading-tight line-clamp-2">
          <Link href={href} target="_blank">{title}</Link>
        </h5>
      </div>

      {/* Price + Buy Button */}
      <div className="mt-3 flex items-center justify-between px-1 pb-2">
        <div className="text-gray-900 font-semibold text-sm">
          GHS {convertedPrice.toFixed(2)}
        </div>
        <button
          onClick={onBuy}
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