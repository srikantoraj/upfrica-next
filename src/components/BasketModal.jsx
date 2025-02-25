import React from "react";
import { HiXMark } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
// import Link from "next/link" // or your own routing library

export default function BasketModal({
  isModalVisible,
  handleCloseModal,
  basket,
  handleQuantityChange,
  handleRemoveProduct,
}) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 px-5 z-50 overflow-y-auto
        ${isModalVisible ? "opacity-100 visible" : "opacity-0 invisible"}
        transition-opacity duration-300`}
      onClick={handleCloseModal}
    >
      <div
        className={`
          bg-white rounded-lg shadow-lg
          w-full sm:w-2/3 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3
          max-w-3xl
          p-6 sm:p-8
          mx-auto mt-10
          transform
          ${isModalVisible ? "translate-y-0" : "-translate-y-full"}
          transition-transform duration-300
        `}
        onClick={(e) => e.stopPropagation()} // stop click from closing modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-2xl sm:text-3xl font-medium">
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
        <div className="py-2">
          {basket.length > 0 ? (
            basket.map((product, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-stretch py-4 border-b border-gray-200 last:border-b-0 gap-4"
              >
                {/* Product Image */}
                <div className="w-full md:w-1/6 h-[100px] mb-2 md:mb-0">
                  <img
                    src={product?.image?.[0] || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="md:pl-6 md:w-5/6 w-full flex flex-col justify-center">
                  {product.sku && (
                    <p className="text-sm text-gray-500 mb-1">
                      SKU: {product.sku}
                    </p>
                  )}

                  {/* Title & Quantity Selector */}
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {product.title}
                    </p>
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
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
                    {/* Buttons: Favorites & Remove */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium 
                          text-gray-500 hover:text-gray-900 hover:underline"
                      >
                        <FaHeart className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                        Add to Favorites
                      </button>

                      <button
                        onClick={() => handleRemoveProduct(index)}
                        type="button"
                        className="inline-flex items-center text-sm font-medium 
                          text-red-600 hover:underline"
                      >
                        <HiMiniXMark className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                        Remove
                      </button>
                    </div>

                    <p className="text-base sm:text-lg font-medium text-gray-900">
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
            <p className="text-center text-gray-500">
              No items in the basket.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className=" pt-4 space-y-3">
          <button className="bg-[#8710D8] text-white rounded-3xl hover:bg-purple-700 w-full p-2 font-bold">
            Checkout
          </button>
          <button className="px-4 py-2 rounded-3xl border bg-white shadow hover:shadow-md border-[#f7c32e] w-full font-bold">
            <Link href="/cart">View Basket</Link>
            {/* View Basket */}
          </button>
        </div>
      </div>
    </div>
  );
}
