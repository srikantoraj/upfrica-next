// "use client";

// import Image from "next/image";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { FaBolt } from "react-icons/fa";
// import Link from "next/link";
// import { convertPrice } from "@/app/utils/utils";
// import { useSelector } from "react-redux";
// import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

// // If you use a custom placeholder, swap this URL
// const FALLBACK_IMG =
//   "https://d3q0odwafjkyv1.cloudfront.net/assets/placeholders/placeholder-600x600.webp";

// // --- Helpers ---------------------------------------------------------------

// function resolveImageSrc(product) {
//   if (!product) return null;

//   // Prefer explicit CDN fields your API already returns
//   if (product.thumbnail) return product.thumbnail;
//   if (product.product_image_url) return product.product_image_url;

//   const candidates = product.product_images || product.image_objects || [];
//   for (const item of candidates) {
//     if (!item) continue;
//     if (typeof item === "string" && item) return item;             // array of URLs
//     if (typeof item === "object") {
//       if (item.url) return item.url;                                // ActiveStorageAttachment serializer
//       if (item.image_url) return item.image_url;                    // legacy ProductImage serializer
//       if (typeof item.image === "string") return item.image;
//     }
//   }
//   return null;
// }

// function resolveHref(product) {
//   if (!product) return "#";
//   if (product.frontend_url) return product.frontend_url;

//   // fallback: keep your previous path scheme
//   const country = (product.seller_country || "GH").toLowerCase();
//   const conditionSlug = product?.condition?.slug || "brand-new";
//   const citySlug = product?.seller_town
//     ? product.seller_town.trim().toLowerCase().replace(/\s+/g, "-")
//     : "accra";
//   return `/${country}/${product.slug}-${conditionSlug}-${citySlug}/`;
// }

// // --------------------------------------------------------------------------

// export default function ProductCard({ product }) {
//   const selectedCountry = useSelector(selectSelectedCountry);
//   const exchangeRates = useSelector((state) => state.exchangeRates.rates);

//   const {
//     title,
//     sale_end_date,
//     price_cents,
//     sale_price_cents,
//     price_currency,
//   } = product || {};

//   const href = resolveHref(product);
//   const src = resolveImageSrc(product) || FALLBACK_IMG;

//   const basePrice = price_cents ? price_cents / 100 : 0;
//   const salePrice = sale_price_cents ? sale_price_cents / 100 : 0;

//   const convertedPrice = convertPrice(
//     basePrice,
//     price_currency,
//     selectedCountry?.code,
//     exchangeRates
//   );

//   const isSaleActive =
//     sale_end_date && new Date(sale_end_date) > new Date() && salePrice > 0;

//   const convertedSalePrice = isSaleActive
//     ? convertPrice(
//         salePrice,
//         price_currency,
//         selectedCountry?.code,
//         exchangeRates
//       )
//     : null;

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between w-full h-[300px] lg:h-[370px] font-sans">
//       {/* Image Section */}
//       <div className="relative w-full">
//         <Link href={href}>
//           <span className="block relative w-full h-[200px] lg:h-[250px] overflow-hidden">
//             <Image
//               src={src}
//               alt={title || "Product image"}
//               fill
//               sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
//               className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
//               priority={false}
//             />
//           </span>
//         </Link>

//         {isSaleActive && (
//           <div className="absolute bottom-2 left-2">
//             <button className="bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
//               <FaBolt className="w-4 h-4" />
//               Sale
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Product Details */}
//       <div className="px-2 lg:px-4 py-2 lg:py-3">
//         <h2 className="text-base lg:text-lg font-medium lg:font-semibold text-gray-900 truncate">
//           {title}
//         </h2>
//       </div>

//       {/* Price & Cart Section */}
//       <div className="border-t">
//         <div className="flex items-center justify-between px-2 lg:px-4 py-2 lg:py-3">
//           <div className="flex items-baseline gap-2">
//             {isSaleActive ? (
//               <>
//                 <span className="text-base lg:text-lg font-bold text-gray-900">
//                   {selectedCountry?.symbol} {convertedSalePrice?.toFixed(2)}
//                 </span>
//                 <span className="text-sm text-gray-500 line-through">
//                   {convertedPrice?.toFixed(2)}
//                 </span>
//               </>
//             ) : (
//               <span className="text-base lg:text-lg font-bold text-gray-900">
//                 {selectedCountry?.symbol} {convertedPrice?.toFixed(2)}
//               </span>
//             )}
//           </div>
//           <Link href={href}>
//             <span className="p-1">
//               <AiOutlineShoppingCart className="w-5 lg:w-6 h-5 lg:h-6 text-purple-500" />
//             </span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { convertPrice } from "@/app/utils/utils";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

// If you use a custom placeholder, swap this URL (and allow it in next.config.js)
const FALLBACK_IMG =
  "https://d3q0odwafjkyv1.cloudfront.net/assets/placeholders/placeholder-600x600.webp";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function resolveImageSrc(product) {
  if (!product) return null;

  // New API: single string URL returned as `image`
  if (typeof product.image === "string" && product.image) return product.image;

  // Back-compat fallbacks your API might still return
  if (product.thumbnail) return product.thumbnail;
  if (product.product_image_url) return product.product_image_url;

  // Older shapes: arrays or objects
  const candidates = product.product_images || product.image_objects || [];
  for (const item of candidates) {
    if (!item) continue;
    if (typeof item === "string" && item) return item; // array of URLs
    if (typeof item === "object") {
      if (item.url) return item.url;               // { url: "..." }
      if (item.image_url) return item.image_url;   // legacy field
      if (typeof item.image === "string") return item.image;
    }
  }
  return null;
}

function resolveHref(product) {
  if (!product) return "#";
  if (product.frontend_url) return product.frontend_url;

  // Fallback route scheme (adjust to your routing if needed)
  const country = (product.seller_country || "GH").toLowerCase();
  const conditionSlug = product?.condition?.slug || "brand-new";
  const citySlug = product?.seller_town
    ? product.seller_town.trim().toLowerCase().replace(/\s+/g, "-")
    : "accra";
  return `/${country}/${product.slug}-${conditionSlug}-${citySlug}/`;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProductCard({ product }) {
  const selectedCountry = useSelector(selectSelectedCountry);
  const exchangeRates = useSelector((state) => state.exchangeRates.rates);

  const {
    title,
    sale_end_date,
    price_cents,
    sale_price_cents,
    price_currency,
  } = product || {};

  const href = resolveHref(product);
  const src = resolveImageSrc(product) || FALLBACK_IMG;

  const basePrice = price_cents ? price_cents / 100 : 0;
  const salePrice = sale_price_cents ? sale_price_cents / 100 : 0;

  const convertedPrice = convertPrice(
    basePrice,
    price_currency,
    selectedCountry?.code,
    exchangeRates
  );

  const isSaleActive =
    sale_end_date && new Date(sale_end_date) > new Date() && salePrice > 0;

  const convertedSalePrice = isSaleActive
    ? convertPrice(
      salePrice,
      price_currency,
      selectedCountry?.code,
      exchangeRates
    )
    : null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between w-full h-[300px] lg:h-[370px] font-sans">
      {/* Image Section */}
      <div className="relative w-full">
        <Link href={href}>
          <span className="block relative w-full h-[200px] lg:h-[250px] overflow-hidden">
            <Image
              src={src}
              alt={title || "Product image"}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              priority={false}
              onError={(e) => {
                // Defensive fallback if a bad URL slips through
                try {
                  e.currentTarget.src = FALLBACK_IMG;
                } catch { }
              }}
            />
          </span>
        </Link>

        {isSaleActive && (
          <div className="absolute bottom-2 left-2">
            <button className="bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaBolt className="w-4 h-4" />
              Sale
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-2 lg:px-4 py-2 lg:py-3">
        <h2 className="text-base lg:text-lg font-medium lg:font-semibold text-gray-900 truncate">
          {title}
        </h2>
      </div>

      {/* Price & Cart Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2 lg:py-3">
          <div className="flex items-baseline gap-2">
            {isSaleActive ? (
              <>
                <span className="text-base lg:text-lg font-bold text-gray-900">
                  {selectedCountry?.symbol} {convertedSalePrice?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {convertedPrice?.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base lg:text-lg font-bold text-gray-900">
                {selectedCountry?.symbol} {convertedPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <Link href={href}>
            <span className="p-1">
              <AiOutlineShoppingCart className="w-5 lg:w-6 h-5 lg:h-6 text-purple-500" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
