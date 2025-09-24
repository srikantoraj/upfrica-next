// src/components/home/ProductList/RecentProductCard.jsx
"use client";

import React from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useLocalization } from "@/contexts/LocalizationProvider";
import { symbolFor } from "@/lib/pricing-mini";
import { fixImageUrl, FALLBACK_IMAGE, pickProductImage } from "@/lib/image";

/* ---------- robust image resolver ---------- */
function resolveImage(p) {
  const isStr = (v) => typeof v === "string" && v.trim();
  const firstFrom = (arr) => {
    for (const it of arr || []) {
      if (!it) continue;
      if (isStr(it)) return it;
      const u = it.image_url || it.url || it.secure_url || it.src || it.thumbnail || it.path || it.image;
      if (isStr(u)) return u;
    }
    return "";
  };

  const candidates = [
    p?.__resolved_image,
    p?.card_image,
    p?.card_image_url,
    p?.thumbnail,
    p?.image_url,
    isStr(p?.image) ? p.image : "",
    p?.main_image,
    p?.product_image,
    p?.product_image_url,
    firstFrom(p?.product_images),
    firstFrom(p?.image_objects || p?.imageObjects),
    firstFrom(p?.images || p?.gallery || p?.photos || p?.media || p?.assets || p?.thumbnails),
    typeof pickProductImage === "function" ? pickProductImage(p) : "",
  ].filter(Boolean);

  const raw = candidates.find(isStr) || FALLBACK_IMAGE;
  return fixImageUrl(raw);
}

/* ---------- FX helpers (same pattern as Basket/DirectBuy) ---------- */
const currencyOf = (p) =>
  String(
    p?.price_currency ??
      p?.currency ??
      p?.seller_currency ??
      p?.sellerCurrency ??
      "USD"
  ).toUpperCase();

const convMajorSafe = (major, fromCcy, convert, toCcy) => {
  const n = Number(major || 0);
  const src = String(fromCcy || "USD").toUpperCase();
  const dst = String(toCcy || src).toUpperCase();
  if (!convert || src === dst) return n;
  const out = Number(convert(n, src, dst));
  return Number.isFinite(out) && out >= 0 ? out : n;
};

const amountOnly = (n, currency, locale = "en") => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).formatToParts(Number(n || 0));
    return parts.filter((p) => p.type !== "currency").map((p) => p.value).join("").trim();
  } catch {
    return Number(n || 0).toFixed(2);
  }
};

export default function RecentProductCard({ product }) {
  const {
    title,
    price_cents,
    price_currency,
    slug,
    seo_slug,
    category,
  } = product || {};

  // Deliver-to context
  const { country: uiCountry, currency: uiCurrency, convert, resolvedLanguage } = useLocalization() || {};
  const cc = String(uiCountry || "gh").toLowerCase();
  const symbol = symbolFor(uiCurrency || "USD", resolvedLanguage || "en") || "₵";

  // seller → UI currency
  const sellerCcy = currencyOf(product);
  const cents =
    typeof price_cents === "number"
      ? price_cents
      : Math.round(Number(product?.price_major || 0) * 100);

  const unitMajorUI = convMajorSafe((cents || 0) / 100, sellerCcy, convert, uiCurrency);

  // image
  const [imgSrc, setImgSrc] = React.useState(() => resolveImage(product));
  React.useEffect(() => setImgSrc(resolveImage(product)), [product]);

  const href = `/${cc}/${seo_slug || slug || `${category?.slug ?? "product"}/${slug || ""}`}/`;

  const priceBlock =
    Number.isFinite(unitMajorUI) && unitMajorUI > 0 ? (
      <p className="text-lg font-bold text-gray-900">
        {symbol}
        {amountOnly(unitMajorUI, uiCurrency, resolvedLanguage)}
      </p>
    ) : (
      <p className="text-sm text-gray-500">Ask for price</p>
    );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[270px] font-sans">
      {/* Image */}
      <div className="relative w-full h-[160px]">
        <Link href={href} aria-label={title || "View product"}>
          <span className="block relative w-full h-[160px]">
            <img
              src={imgSrc}
              alt={title || "Product image"}
              width={320}
              height={160}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </span>
        </Link>

        {/* Wishlist (cosmetic) */}
        <div className="absolute top-2 right-2 bg-gray-100 border p-2 rounded-full">
          <FaHeart className="w-5 h-5 text-gray-600" aria-hidden />
        </div>

        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900 truncate w-full overflow-hidden">
            {title}
          </h2>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {priceBlock}
          </div>
          <Link href={href} aria-label={`Open ${title || "product"}`}>
            <div className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}