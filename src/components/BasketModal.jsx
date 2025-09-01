// "use client";
// import React, { useState } from "react";
// import { HiXMark } from "react-icons/hi2";
// import { HiMiniXMark } from "react-icons/hi2";
// import { FaHeart } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { selectSelectedCountry } from "@/app/store/slices/countrySlice";
// import { useSelector } from "react-redux";

// export default function BasketModal({
//   isModalVisible,
//   handleCloseModal,
//   basket,
//   handleQuantityChange,
//   handleRemoveProduct,
//   saleActive,
//   activePrice,
//   quantity
// }) {

//   // console.log(basket);

//   const router = useRouter();
//   const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
//   const [isViewBasketLoading, setIsViewBasketLoading] = useState(false);

//   // Define the loader component (three bouncing dots)
//   const Loader = (
//     <div className="flex space-x-2 items-center h-6">
//       <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
//       <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
//       <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
//     </div>
//   );

//   // Handler for checkout navigation
//   const handleCheckout = () => {
//     setIsCheckoutLoading(true);
//     router.push("/checkout");
//   };

//   // Handler for view basket navigation
//   const handleViewBasket = () => {
//     setIsViewBasketLoading(true);
//     router.push("/cart");
//   };

//    // কারেন্সি সিম্বল
//   const selectedCountry = useSelector(selectSelectedCountry);
//   const symbol = selectedCountry?.symbol ?? "₵";

//   return (
//     <div
//       className={`
//         fixed inset-0 z-50 flex justify-center items-start
//         bg-black bg-opacity-50 overflow-y-auto
//         transition-opacity duration-300
//         ${isModalVisible ? "opacity-100 visible" : "opacity-0 invisible"}
//       `}
//       onClick={handleCloseModal}
//     >
//       {/* Modal Container */}
//       <div
//         className={`
//           relative bg-white rounded-lg shadow-lg
//           w-full sm:w-2/3 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3
//           max-w-3xl mx-2
//           lg:mx-auto mt-10 p-6 sm:p-8
//           transform transition-transform duration-300
//           ${isModalVisible ? "translate-y-0" : "-translate-y-12"}
//         `}
//         onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
//       >
//         {/* Modal Header */}
//         <div className="flex justify-between items-center pb-4 border-b">
//           <h3 className="text-xl sm:text-2xl font-medium">
//             {basket.length} Items added to basket
//           </h3>
//           <button
//             onClick={handleCloseModal}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <HiXMark className="h-8 w-8" />
//           </button>
//         </div>

//          {/* Body */}
//         <div className="py-2 max-h-[70vh] overflow-y-auto">
//           {basket.length > 0 ? basket.map((product, idx) => {
//             // Sale logic
//             const now = new Date();
//             const saleEnd = product.sale_end_date ? new Date(product.sale_end_date) : null;
//             const isOnSale = saleEnd && saleEnd > now && product.sale_price_cents > 0;

//             // Unit & subtotal 계산
//             const unitCents = isOnSale ? product.sale_price_cents : product.price_cents;
//             const unitPrice = unitCents / 100;
//             const subtotal = (unitPrice * product.quantity).toFixed(2);

//             return (
//               <div key={idx} className="flex items-stretch gap-4 py-4 border-b border-gray-200 last:border-b-0">
//                 {/* Image */}
//                 <div className="w-[100px] h-[100px] flex-shrink-0">
//                   <img
//                     src={product.image?.[0] || "https://via.placeholder.com/150"}
//                     alt={product.title}
//                     className="h-full w-full object-cover rounded-md"
//                   />
//                 </div>

//                 {/* Details */}
//                 <div className="flex flex-col justify-center w-full">
//                   {product.sku && (
//                     <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>
//                   )}
//                   <div className="flex items-center justify-between w-full">
//                     <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
//                       {product.title}
//                     </p>
//                     <select
//                       value={product.quantity}
//                       onChange={e =>
//                         handleQuantityChange(product.id, +e.target.value)
//                       }
//                       className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm"
//                     >
//                       {[...Array(10)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>{i + 1}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Price & Subtotal */}
//                   <div className="flex items-center justify-between pt-2">
//                     {/* Remove */}
//                   <button
//                     onClick={() => handleRemoveProduct(product.id)}
//                     className="mt-2 inline-flex items-center text-xs sm:text-sm text-red-600 hover:underline"
//                   >
//                     <HiMiniXMark className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
//                     Remove
//                   </button>
//                     {/* Subtotal */}
//                     <span className="text-sm font-semibold text-gray-900">
//                       {symbol}{subtotal}
//                     </span>
//                   </div>

//                 </div>
//               </div>
//             );
//           }) : (
//             <p className="text-center text-gray-500">No items in the basket.</p>
//           )}
//         </div>

//         {/* Modal Footer */}
//         {basket.length > 0 && (
//           <div className="pt-4 space-y-3">
//             <button
//               onClick={handleCheckout}
//               className="bg-[#8710D8] text-white rounded-3xl hover:bg-purple-700 w-full p-2 font-bold flex items-center justify-center"
//             >
//               {isCheckoutLoading ? Loader : "Checkout"}
//             </button>
//             <button
//               onClick={handleViewBasket}
//               className="px-4 py-2 rounded-3xl border bg-white shadow hover:shadow-md btn-base btn-outline w-full font-bold text-[#8710D8] flex items-center justify-center"
//             >
//               {isViewBasketLoading ? Loader : "View Basket"}
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { HiXMark, HiMiniXMark, HiPlus, HiMinus } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectSelectedCountry } from "@/app/store/slices/countrySlice";

export default function BasketModal({
  isModalVisible,
  handleCloseModal,
  basket,
  handleQuantityChange,
  handleRemoveProduct,
  saleActive,
  activePrice,
  quantity,
}) {
  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isViewBasketLoading, setIsViewBasketLoading] = useState(false);

  const Loader = (
    <div className="flex space-x-2 items-center h-6">
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
    </div>
  );

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    router.push("/checkout");
  };

  const handleViewBasket = () => {
    setIsViewBasketLoading(true);
    router.push("/cart");
  };

  const selectedCountry = useSelector(selectSelectedCountry);
  const symbol = selectedCountry?.symbol ?? "₵";

  return (
    <div
      className={`
        fixed inset-0 z-50 flex justify-center items-start 
        bg-black bg-opacity-50 overflow-y-auto 
        transition-opacity duration-300
        ${isModalVisible ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      onClick={handleCloseModal}
    >
      <div
        className={`
          relative bg-white rounded-lg shadow-lg 
          w-full sm:w-2/3 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3
          max-w-3xl mx-2 lg:mx-auto mt-10 p-6 sm:p-8
          transform transition-transform duration-300
          ${isModalVisible ? "translate-y-0" : "-translate-y-12"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b-2">
          <h3 className="text-xl sm:text-2xl font-medium">
            {basket.length} Item{basket.length !== 1 && "s"} in your basket
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-600 hover:text-gray-900"
          >
            <HiXMark className="h-8 w-8" />
          </button>
        </div>

        {/* Body */}
        <div className="py-2 max-h-[70vh] overflow-y-auto">
          {basket.length > 0 ? (
            basket.map((product, idx) => {
              const now = new Date();
              const saleEnd = product.sale_end_date
                ? new Date(product.sale_end_date)
                : null;
              const isOnSale =
                saleEnd && saleEnd > now && product.sale_price_cents > 0;

              const unitCents = isOnSale
                ? product.sale_price_cents
                : product.price_cents;
              const unitPrice = unitCents / 100;
              const subtotal = (unitPrice * product.quantity).toFixed(2);

              return (
                <div
                  key={idx}
                  className="flex items-stretch gap-4 py-4 border-b-2 border-gray-200 last:border-b-0"
                >
                  {/* Image */}
                  <div className="w-[100px] h-[100px] flex-shrink-0">
                    <img
                      src={
                        product.image?.[0]?.image_url ||
                  product.image?.[0]?.url ||
                  "/placeholder.png"
                      }
                      alt={product.title}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center w-full">
                    {product.sku && (
                      <p className="text-xs text-gray-500 mb-1">
                        SKU: {product.sku}
                      </p>
                    )}

                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                        {product.title}
                      </p>

                      {/* Quantity control with bolder borders */}
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 border-2 border-gray-400 rounded-md disabled:opacity-50"
                          onClick={() => {
                            if (product.quantity > 1) {
                              handleQuantityChange(
                                product.id,
                                product.quantity - 1,
                              );
                            }
                          }}
                          disabled={product.quantity <= 1}
                        >
                          <HiMinus className="h-4 w-4 text-gray-700" />
                        </button>

                        <span className="w-6 text-center text-sm font-medium">
                          {product.quantity}
                        </span>

                        <button
                          className="p-1 border-2 border-gray-400 rounded-md"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity + 1,
                            )
                          }
                        >
                          <HiPlus className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Remove & Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="inline-flex items-center text-xs sm:text-sm text-red-600 hover:underline"
                      >
                        <HiMiniXMark className="mr-1.5 h-4 w-4 " />
                        Remove
                      </button>

                      <span className="text-sm font-semibold text-gray-900">
                        {symbol}
                        {subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No items in the basket.</p>
          )}
        </div>

        {/* Footer */}
        {basket.length > 0 && (
          <div className="pt-4 space-y-3">
            <button
              onClick={handleCheckout}
              className="bg-[#8710D8] text-white rounded-3xl hover:bg-purple-700 w-full p-2 font-bold flex items-center justify-center"
            >
              {isCheckoutLoading ? Loader : "Checkout"}
            </button>
            <button
              onClick={handleViewBasket}
              className="px-4 py-2 rounded-3xl border bg-white shadow hover:shadow-md w-full font-bold text-[#8710D8] flex items-center justify-center"
            >
              {isViewBasketLoading ? Loader : "View Basket"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
