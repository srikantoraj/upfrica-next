// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { FaHeart, FaTimes } from "react-icons/fa";
// import { HiMiniXMark } from 'react-icons/hi2';

// const Cart = () => {
//   const [basket, setBasket] = useState([]);
//   const [promoCode, setPromoCode] = useState('');
//   const [shippingCost] = useState(10); // Fixed shipping cost
//   const router = useRouter();

//   useEffect(() => {
//     const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
//     setBasket(storedBasket);
//   }, []);

//   const handleQuantityChange = (index, newQuantity) => {
//     const newBasket = [...basket];
//     newBasket[index].quantity = Math.max(1, newQuantity);
//     setBasket(newBasket);
//     localStorage.setItem('basket', JSON.stringify(newBasket));
//   };

//   const handleRemoveProduct = (index) => {
//     const newBasket = basket.filter((_, i) => i !== index);
//     setBasket(newBasket);
//     localStorage.setItem('basket', JSON.stringify(newBasket));
//   };

//   const handleCheckout = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     user ? router.push('/checkout') : router.push('/signin');
//   };

//   const subtotal = basket.reduce(
//     (sum, item) => sum + (item.price.cents / 100) * item.quantity,
//     0
//   );
//   const total = subtotal + shippingCost;

//   return (
//     <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
//       <div className="sm:flex shadow-md my-10 bg-gray-100 rounded-lg">
//         {/* Cart Items Section */}
//         <div className="w-full sm:w-3/5 bg-white p-6 sm:p-10 rounded-lg sm:rounded-r-none">
//           <div className="flex justify-between border-b pb-6">
//             <h1 className="font-bold text-3xl">Shopping Cart</h1>
//             <h2 className="font-semibold text-xl text-gray-700">
//               {basket.length} {basket.length === 1 ? 'Item' : 'Items'}
//             </h2>
//           </div>

//           {basket.length > 0 ? (
//             basket.map((product, index) => (
//               <div
//                 key={index}
//                 className="md:flex items-stretch py-6 border-b border-gray-200 last:border-b-0"
//               >
//                 {/* Product Image */}
//                 <div className="md:w-1/6 h-[200px] w-full mb-4 md:mb-0">
//                   <img
//                     src={
//                       product?.image?.[0] || 'https://via.placeholder.com/150'
//                     }
//                     alt={product.title}
//                     className="h-full w-full object-cover rounded-md"
//                   />
//                 </div>
//                 {/* Product Details */}
//                 <div className="md:pl-6 md:w-3/4 w-full flex flex-col justify-center">
//                   <p className="text-sm text-gray-500 mb-1">
//                     SKU: {product.sku || 'N/A'}
//                   </p>
//                   <div className="flex items-center justify-between w-full">
//                     <p className="text-lg font-semibold text-gray-800">
//                       {product.title}
//                     </p>
//                     <select
//                       value={product.quantity}
//                       onChange={(e) =>
//                         handleQuantityChange(index, parseInt(e.target.value))
//                       }
//                       className="py-2 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                       aria-label="Select quantity"
//                     >
//                       {[...Array(10).keys()].map((num) => (
//                         <option key={num + 1} value={num + 1}>
//                           {num + 1}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex items-center justify-between pt-4">
//                     {/* <button
//                       onClick={() => handleRemoveProduct(index)}
//                       className="flex gap-1 items-center text-base  text-red-500 hover:text-red-600 transition-colors"
//                     >
//                       <HiMiniXMark className='h-6 w-6' />
//                       Remove
//                     </button> */}

//                     {/* <div class="flex items-center gap-4">
//                         <button type="button" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
//                           <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
//                           </svg>
//                           Add to Favorites
//                         </button>

//                         <button onClick={() => handleRemoveProduct(index)} type="button" class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500">
//                           <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
//                           </svg>
//                           Remove
//                         </button>
//                       </div> */}

//                     <div className="flex items-center gap-4">
//                       <button
//                         type="button"
//                         className="inline-flex items-center text-sm font-medium 
//                    text-gray-500 hover:text-gray-900 hover:underline"
//                       >
//                         <FaHeart className="mr-1.5 h-5 w-5" />
//                         Add to Favorites
//                       </button>

//                       <button
//                         onClick={() => handleRemoveProduct(index)}
//                         type="button"
//                         className="inline-flex items-center text-sm font-medium 
//                    text-red-600 hover:underline"
//                       >
//                         <HiMiniXMark className="mr-1.5 h-5 w-5" />
//                         Remove
//                       </button>
//                     </div>

//                     <p className="text-lg font-medium text-gray-900">
//                       {product.price.currency_iso}{' '}
//                       {((product.price.cents / 100) * product.quantity).toFixed(
//                         2
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-600 py-8">
//               Your basket is empty.
//             </p>
//           )}

//           <Link
//             href="/"
//             className="inline-flex items-center font-semibold text-indigo-600 text-base mt-6 hover:underline"
//           >
//             <svg
//               className="fill-current mr-2 text-indigo-600 w-4"
//               viewBox="0 0 448 512"
//             >
//               <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
//             </svg>
//             Continue Shopping
//           </Link>
//         </div>

//         {/* Order Summary Section */}
//         <div
//           id="summary"
//           className="w-full sm:w-2/5 p-6 sm:p-10 bg-gray-50 rounded-lg sm:rounded-l-none"
//         >
//           <h1 className="font-bold text-2xl border-b pb-4 text-gray-800">
//             Order Summary
//           </h1>
//           <div className="flex justify-between mt-6 mb-6">
//             <span className="font-medium text-base text-gray-700">
//               Items ({basket.length})
//             </span>
//             <span className="font-medium text-base text-gray-900">
//               ${subtotal.toFixed(2)}
//             </span>
//           </div>
//           <div className="mb-6">
//             <label className="font-medium text-base text-gray-700 block mb-2">
//               Shipping
//             </label>
//             <select className="block p-3 w-full text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
//               <option>Standard shipping - $10.00</option>
//             </select>
//           </div>
//           <div className="mb-6">
//             <label
//               htmlFor="promo"
//               className="font-medium text-base text-gray-700 block mb-2"
//             >
//               Promo Code
//             </label>
//             <input
//               type="text"
//               id="promo"
//               placeholder="Enter your code"
//               value={promoCode}
//               onChange={(e) => setPromoCode(e.target.value)}
//               className="p-3 w-full text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             />
//           </div>
//           <button className=" transition-colors px-6 py-3 text-base font-medium  uppercase rounded-md w-full border bg-white">
//             Apply
//           </button>
//           <div className="border-t mt-6 pt-6">
//             <div className="flex font-semibold justify-between text-base text-gray-700 mb-4">
//               <span>Total cost</span>
//               <span className="text-gray-900">${total.toFixed(2)}</span>
//             </div>
//             <button
//               onClick={handleCheckout}
//               className={`bg-yellow-300 py-3 text-base font-semibold text-white uppercase w-full rounded-md ${basket.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               disabled={basket.length === 0}
//             >
//               Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";

const Cart = () => {
  const [basket, setBasket] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [shippingCost] = useState(10); // Fixed shipping cost
  const router = useRouter();

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(storedBasket);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const newBasket = [...basket];
    newBasket[index].quantity = Math.max(1, newQuantity);
    setBasket(newBasket);
    localStorage.setItem("basket", JSON.stringify(newBasket));
  };

  const handleRemoveProduct = (index) => {
    const newBasket = basket.filter((_, i) => i !== index);
    setBasket(newBasket);
    localStorage.setItem("basket", JSON.stringify(newBasket));
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    user ? router.push("/checkout") : router.push("/signin");
  };

  const subtotal = basket.reduce(
    (sum, item) => sum + (item.price.cents / 100) * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto mt-12 ">
      {/* Outer container: Switches to flex row at sm: */}
      <div className="sm:flex flex-col sm:flex-row lg:shadow-md my-10 bg-gray-100 rounded-lg overflow-hidden">
        {/* Left side (Cart Items) */}
        <div className="w-full sm:w-3/5 bg-white p-0 lg:p-6 sm:p-10">
          <div className="flex justify-between border-b pb-6">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
              Shopping Cart
            </h1>
            <h2 className="font-semibold text-base sm:text-lg md:text-xl text-gray-700">
              {basket.length} {basket.length === 1 ? "Item" : "Items"}
            </h2>
          </div>

          {/* Cart Items */}
          {basket.length > 0 ? (
            basket.map((product, index) => (
              <div
                key={index}
                className="md:flex items-stretch py-6 border-b border-gray-200 last:border-b-0"
              >
                {/* Product Image */}
                <div className="md:w-1/6 h-[200px] w-full mb-4 md:mb-0">
                  <img
                    src={product?.image?.[0] || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="md:pl-6 md:w-3/4 w-full flex flex-col justify-center">
                  {/* SKU */}
                  <p className="text-sm text-gray-500 mb-1">
                    SKU: {product.sku || "N/A"}
                  </p>
                  {/* Title & Quantity */}
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                      {product.title}
                    </p>
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-label="Select quantity"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    {/* Buttons: Favorites & Remove */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium 
                          text-gray-500 hover:text-gray-900 hover:underline"
                      >
                        <FaHeart className="mr-1.5 h-5 w-5" />
                        Add to Favorites
                      </button>

                      <button
                        onClick={() => handleRemoveProduct(index)}
                        type="button"
                        className="inline-flex items-center text-sm font-medium 
                          text-red-600 hover:underline"
                      >
                        <HiMiniXMark className="mr-1.5 h-5 w-5" />
                        Remove
                      </button>
                    </div>

                    {/* Price */}
                    <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                      {product.price.currency_iso}{" "}
                      {(
                        (product.price.cents / 100) *
                        product.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">
              Your basket is empty.
            </p>
          )}

          {/* Continue Shopping Link */}
          <Link
            href="/"
            className="inline-flex items-center font-semibold text-indigo-600 text-sm sm:text-base mt-6 hover:underline"
          >
            <svg
              className="fill-current mr-2 text-indigo-600 w-4"
              viewBox="0 0 448 512"
            >
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Right side (Order Summary) */}
        <div className="w-full sm:w-2/5 p-6 sm:p-10 bg-gray-50">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl border-b pb-4 text-gray-800">
            Order Summary
          </h1>
          <div className="flex justify-between mt-6 mb-6">
            <span className="font-medium text-base sm:text-lg text-gray-700">
              Items ({basket.length})
            </span>
            <span className="font-medium text-base sm:text-lg text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="mb-6">
            <label className="font-medium text-base sm:text-lg text-gray-700 block mb-2">
              Shipping
            </label>
            <select className="block p-3 w-full text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option>Standard shipping - $10.00</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="promo"
              className="font-medium text-base sm:text-lg text-gray-700 block mb-2"
            >
              Promo Code
            </label>
            <input
              type="text"
              id="promo"
              placeholder="Enter your code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="p-3 w-full text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button className="transition-colors px-6 py-3 text-base sm:text-lg font-medium uppercase rounded-md w-full border bg-white">
            Apply
          </button>

          <div className="border-t mt-6 pt-6">
            <div className="flex font-semibold justify-between text-base sm:text-lg text-gray-700 mb-4">
              <span>Total cost</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className={`bg-[#8710D8] py-3 text-base sm:text-lg font-semibold text-white uppercase w-full rounded-md
                ${basket.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={basket.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

