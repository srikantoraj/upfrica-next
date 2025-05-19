// 'use client';
// import Image from "next/image";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { FaBolt, FaHeart } from "react-icons/fa";
// import Link from "next/link";
// import { convertPrice } from "@/app/utils/utils";
// import { useSelector } from "react-redux";
// import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

// export default function ProductCard({ product }) {
//   // console.log("card product",product);
//   const selectedCountry = useSelector(selectSelectedCountry)
  
//     const {
//       product_images,
//       title,
//       sale_end_date,
//       price_cents,
//       sale_price_cents,
//       price_currency,
//       category,
//       slug,
//       seo_slug,
//       seller_country,
//       seller_town,
//       on_sales
//     } = product;

//     const country = seller_country?.toLowerCase() || 'gh';
//     const town = seller_town?.toLowerCase() || 'accra';
//   const exchangeRates = useSelector((state) => state.exchangeRates.rates);

//     // Convert the regular price to the destination currency (GHS)
//     const convertedPrice = convertPrice(price_cents / 100, price_currency, selectedCountry?.code, exchangeRates);





//     // Determine if the sale is active
//     const isOnSaleActive =
//     (sale_end_date && new Date(sale_end_date) > new Date() && sale_price_cents > 0) ||
//     on_sales;

//     // Calculate the converted sale price if applicable
//     const convertedSalePrice =
//     isOnSaleActive && sale_price_cents
//         ? convertPrice(sale_price_cents / 100, price_currency, selectedCountry?.code, exchangeRates)
//     : null;

//     if (!product_images || product_images.length === 0) return null;

//     return (
//     <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between w-full h-[300px] lg:h-[370px] font-sans">
//       {/* Image Section */}
//       <div className="relative w-full ">
//         {product_images.length > 0 && (
//           <Link href={`/${country}/${seo_slug || slug}/`}>
//             <span className="block relative w-full h-[200px] lg:h-[250px]">
//               <img
//                 src={product_images[0]}
//                 alt={title}
//                 width={230}
//                 height={230}
//                 className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
//               />
//             </span>
//           </Link>
//         )}

//         {/* Favorite Icon */}
//         {/* <div className="absolute top-2 right-2 bg-gray-200 border p-[5px] rounded-full">
//           <FaHeart className="w-4 lg:w-4 h-4 lg:h-4 text-gray-900" />
//         </div> */}

//         {/* Sales Badge - only shown when a sale is active */}
//         {isOnSaleActive && (
//           <div className="absolute bottom-2 left-2">
//             <button className="bg-red-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
//               <FaBolt className="w-4 h-4" />
//               Sales
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Product Details */}
//       <div className="px-2 lg:px-4 py-2 lg:py-3">
//         <h2 className="text-base lg:text-lg font-medium lg:font-semibold text-gray-900 truncate w-full overflow-hidden">
//           {title}
//         </h2>
//         {/* <p className="text-sm text-purple-500">1083+ sold recently</p> */}
//       </div>

//       {/* Price & Cart Section */}
//       <div className="border-t">
//         <div className="flex items-center justify-between px-2 lg:px-4 py-2 lg:py-3">
//           <div className="flex items-center justify-between gap-1  md:gap-2 ">
//             {isOnSaleActive ? (
//               <>
//                 <p className="text-base lg:text-lg font-medium lg:font-bold text-gray-900">
//                   {selectedCountry?.symbol} {convertedSalePrice?.toFixed(2)}
//                 </p>
//                 <p className="text-sm text-gray-500 line-through">
//                   {convertedPrice?.toFixed(2)}
//                 </p>

//               </>
//             ) : (
//               <p className="text-base lg:text-lg font-bold text-gray-900">
//                     {selectedCountry?.symbol}  {convertedPrice?.toFixed(2)}
//               </p>
//             )}
//           </div>
//           <Link href={`/${country}/${category?.slug}/${slug}/`}>
//             <div className="p-1 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
//               <AiOutlineShoppingCart className="w-5 lg:w-6 h-5 lg:h-6 text-purple-500" />
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//     );
// }

'use client';
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";
import Link from "next/link";
import { convertPrice } from "@/app/utils/utils";
import { useSelector } from "react-redux";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

export default function ProductCard({ product }) {
  const selectedCountry = useSelector(selectSelectedCountry);
  const exchangeRates = useSelector((state) => state.exchangeRates.rates);

  const {
    product_images,
    title,
    sale_end_date,
    price_cents,
    sale_price_cents,
    price_currency,
    category,
    slug,
    seo_slug,
    seller_country,
    seller_town,
  } = product;

  if (!product_images || product_images.length === 0) return null;

  const country = seller_country?.toLowerCase() || "gh";
  const town = seller_town?.toLowerCase() || "accra";

  // Convert the regular price
  const convertedPrice = convertPrice(
    price_cents / 100,
    price_currency,
    selectedCountry?.code,
    exchangeRates
  );

  // Only active if sale_end_date is a valid date and in the future
  const isSaleActive =
    sale_end_date &&
    new Date(sale_end_date) > new Date() &&
    sale_price_cents > 0;

  // Convert sale price if active
  const convertedSalePrice = isSaleActive
    ? convertPrice(
      sale_price_cents / 100,
      price_currency,
      selectedCountry?.code,
      exchangeRates
    )
    : null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between w-full h-[300px] lg:h-[370px] font-sans">
      {/* Image Section */}
      <div className="relative w-full ">
        <Link href={`/${country}/${seo_slug || slug}/`}>
          <span className="block relative w-full h-[200px] lg:h-[250px] overflow-hidden">
            <Image
              src={product_images[0]}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </span>
        </Link>

        {/* Sales Badge */}
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
          <Link href={`/${country}/${category?.slug}/${slug}/`}>
            <span className="p-1 ">
              <AiOutlineShoppingCart className="w-5 lg:w-6 h-5 lg:h-6 text-purple-500" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
