// src/components/home/ProductList/RelatedProductCard.jsx
"use client";

import React from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "@/app/utils/utils";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
import { fixImageUrl, FALLBACK_IMAGE, pickProductImage } from "@/lib/image";

/* ---------- image resolver ---------- */
function resolveCardImage(p) {
  const pickOne = (o) =>
    (o &&
      (o.image_url || o.url || o.secure_url || o.src || o.thumbnail || o.path)) ||
    "";

  const candidates = [
    p?.__resolved_image,
    p?.image_url,
    p?.product_image_url,
    p?.thumbnail,
    Array.isArray(p?.product_images) && pickOne(p.product_images[0]),
    Array.isArray(p?.image_objects) && pickOne(p.image_objects[0]),
    Array.isArray(p?.image) && pickOne(p.image[0]),
    typeof pickProductImage === "function" ? pickProductImage(p) : "",
  ].filter(Boolean);

  const first = candidates.find((s) => typeof s === "string" && s.trim());
  return fixImageUrl(first || FALLBACK_IMAGE);
}

const fmt2 = (n) =>
  Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function RelatedProductCard({ product }) {
  const dispatch = useDispatch();
  const selectedCountry = useSelector(selectSelectedCountry);
  const exchangeRates = useSelector((s) => s.exchangeRates.rates);

  const {
    id,
    title,
    price_cents,
    price_currency,
    slug,
    seo_slug,
    sale_end_date,
    sale_price_cents,
    sku,
  } = product || {};

  // URL + currency context
  const countryPath = (
    selectedCountry?.cc ||
    selectedCountry?.country_code ||
    selectedCountry?.countryCode ||
    "gh"
  )
    .toString()
    .toLowerCase();

  const currencyCode = selectedCountry?.currency || selectedCountry?.code || "GHS";
  const currencySym = selectedCountry?.symbol || "₵";

  // prices (display)
  const baseMajor = typeof price_cents === "number" ? price_cents / 100 : undefined;
  const convertedPrice =
    baseMajor != null ? convertPrice(baseMajor, price_currency, currencyCode, exchangeRates) : null;

  const saleActive =
    sale_end_date && new Date(sale_end_date) > new Date() && Number(sale_price_cents) > 0;

  const convertedSale =
    saleActive && sale_price_cents
      ? convertPrice(sale_price_cents / 100, price_currency, currencyCode, exchangeRates)
      : null;

  // image
  const [imgSrc, setImgSrc] = React.useState(() => resolveCardImage(product));
  React.useEffect(() => setImgSrc(resolveCardImage(product)), [product]);

  const [wish, setWish] = React.useState(false);
  const [adding, setAdding] = React.useState(false);

  /* ---------- add to basket + open sheet signal ---------- */
  const handleAddToBasket = async () => {
    if (adding) return;
    setAdding(true);

    // Always use server-side cents for basket if available
    const cents =
      saleActive && typeof sale_price_cents === "number"
        ? sale_price_cents
        : typeof price_cents === "number"
        ? price_cents
        : Math.round(Number(product?.price_major || 0) * 100);

    dispatch({
      type: "basket/addToBasket",
      payload: {
        id,
        title,
        price_cents: cents,
        quantity: 1,
        sku,
        __resolved_image: imgSrc,           // BasketSheet reads this first
        image: [{ image_url: imgSrc }],     // legacy shape still supported
      },
    });

    // Nudge PDP to open its BasketSheet (listener added there)
    try {
      window.dispatchEvent(new CustomEvent("open-basket-sheet"));
    } catch {}

    setTimeout(() => setAdding(false), 400);
  };

  return (
    <article
      data-card
      className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[370px] hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-violet-300"
    >
      {/* image / link */}
      <Link
        prefetch={false}
        href={`/${countryPath}/${seo_slug || slug}/`}
        className="relative block w-full h-[230px]"
        aria-label={title || "View product"}
      >
        <img
          src={imgSrc}
          alt={title || "Product image"}
          width={460}
          height={230}
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[1.03]"
          sizes="(max-width: 640px) 66vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* wishlist toggle (cosmetic) */}
        <button
          type="button"
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wish}
          onClick={(e) => {
            e.preventDefault();
            setWish((v) => !v);
          }}
          className="absolute top-2 right-2 bg-white/90 dark:bg-black/40 border border-gray-200 dark:border-gray-700 p-2 rounded-full shadow-upfrica"
        >
          <FaHeart
            className={`w-4 h-4 ${
              wish ? "text-[var(--violet-600,#7C3AED)]" : "text-gray-600 dark:text-gray-300"
            }`}
            aria-hidden
          />
        </button>

        {saleActive && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
            <FaBolt className="w-4 h-4" aria-hidden />
            Sale
          </span>
        )}
      </Link>

      {/* text */}
      <div className="px-3 pt-3 pb-2 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">1083+ sold recently</p>
      </div>

      {/* price & CTA */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-baseline gap-2">
            {saleActive && convertedSale != null ? (
              <>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {currencySym} {fmt2(convertedSale)}
                </span>
                {convertedPrice != null && (
                  <span className="text-xs text-gray-500 line-through">
                    {fmt2(convertedPrice)}
                  </span>
                )}
              </>
            ) : convertedPrice != null ? (
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {currencySym} {fmt2(convertedPrice)}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Ask for price</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToBasket}
            disabled={adding}
            className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
            aria-label={`Add ${title} to basket`}
          >
            <AiOutlineShoppingCart className="w-5 h-5 text-[var(--violet-600,#7C3AED)]" />
          </button>
        </div>
      </div>
    </article>
  );
}