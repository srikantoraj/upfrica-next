"use client";
import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BasketModal({
  isModalVisible,
  handleCloseModal,
  basket,
  handleQuantityChange,
  handleRemoveProduct,
  quantity
}) {

  // console.log(basket);

  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isViewBasketLoading, setIsViewBasketLoading] = useState(false);

  // Define the loader component (three bouncing dots)
  const Loader = (
    <div className="flex space-x-2 items-center h-6">
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
    </div>
  );

  // Handler for checkout navigation
  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    router.push("/checkout");
  };

  // Handler for view basket navigation
  const handleViewBasket = () => {
    setIsViewBasketLoading(true);
    router.push("/cart");
  };

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
      {/* Modal Container */}
      <div
        className={`
          relative bg-white rounded-lg shadow-lg 
          w-full sm:w-2/3 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3
          max-w-3xl mx-2
          lg:mx-auto mt-10 p-6 sm:p-8
          transform transition-transform duration-300
          ${isModalVisible ? "translate-y-0" : "-translate-y-12"}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl sm:text-2xl font-medium">
            {basket.length} Items added to basket
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-600 hover:text-gray-900"
          >
            <HiXMark className="h-8 w-8" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-2 max-h-[70vh] overflow-y-auto">
          {basket.length > 0 ? (
            basket.map((product, index) => (
              <div
                key={index}
                className="flex items-stretch gap-4 py-4 border-b border-gray-200 last:border-b-0"
              >
                {/* Product Image */}
                <div className="w-[100px] h-[100px] flex-shrink-0">
                  <img
                    src={
                      product?.image?.[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
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
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="py-1 px-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-1 focus:ring-indigo-500
                        text-xs sm:text-sm"
                      aria-label="Select quantity"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Favorites / Remove / Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center text-xs sm:text-sm font-medium 
                          text-gray-500 hover:text-gray-900 hover:underline"
                      >
                        <FaHeart className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                        Add to Favorites
                      </button>

                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        type="button"
                        className="inline-flex items-center text-xs sm:text-sm font-medium 
                          text-red-600 hover:underline"
                      >
                        <HiMiniXMark className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                        Remove
                      </button>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
                      {((product.price_cents / 100) * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No items in the basket.
            </p>
          )}
        </div>

        {/* Modal Footer */}
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
              className="px-4 py-2 rounded-3xl border bg-white shadow hover:shadow-md btn-base btn-outline w-full font-bold text-[#8710D8] flex items-center justify-center"
            >
              {isViewBasketLoading ? Loader : "View Basket"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
