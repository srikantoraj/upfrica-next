"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import { setBasket, removeFromBasket, updateQuantity } from "../../store/slices/cartSlice";

const Cart = () => {
  const token = useSelector((state) => state.auth.token);
  const basket = useSelector((state) => state.basket.items);
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");
  const [shippingCost] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("basket")) || [];
    dispatch(setBasket(stored));
  }, []);


  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveProduct = (id) => {
    dispatch(removeFromBasket(id));
  };

  const handleCheckout = async () => {

    if (!token) {
      router.push("/signin");
    } else {
      const items = basket.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      setIsLoading(true);
      try {
        const response = await fetch("https://media.upfrica.com/api/cart/add/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
          body: JSON.stringify({ items }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }

        const result = await response.json();
        router.push(`/checkout?cart_id=${result?.cart_id}`);
      } catch (error) {
        console.error("Checkout error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const subtotal = basket.reduce(
    (sum, item) => sum + (item.price_cents / 100) * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="container mt-12">
      <div className="grid lg:grid-cols-5 gap-5 my-10  rounded-lg overflow-hidden">
        <div className="w-full lg:col-span-3 bg-white p-0 lg:p-6 sm:p-10">
          <div className="flex justify-between border-b pb-6">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Shopping Cart</h1>
            <h2 className="font-semibold text-base sm:text-lg md:text-xl text-gray-700">
              {basket.length} {basket.length === 1 ? "Item" : "Items"}
            </h2>
          </div>

          {basket.length > 0 ? (
            basket.map((product) => (
              <div
                key={product.id}
                className="flex items-stretch gap-2 lg:gap-4 py-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="w-[120px] lg:w-2/6 h-[100px] lg:h-[200px]  mb-4 md:mb-0">
                  <img
                    src={product?.image?.[0] || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                <div className="md:pl-6 md:w-3/4 w-full flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-1">SKU: {product.sku || "N/A"}</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                      {product.title}
                    </p>
                    <select
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 items-center justify-between pt-4">
                    <div className="md:flex items-center gap-2 lg:gap-4">
                      <button className="flex gap-4 items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline">
                        <FaHeart className="lg:mr-1.5 h-5 w-5" />
                        <span>Add to Favorites</span>
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline pt-4 md:pt-0"
                      >
                        <HiMiniXMark className="mr-1.5 h-5 w-5" />
                        Remove
                      </button>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                      ₵{((product.price_cents / 100) * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">Your basket is empty.</p>
          )}

          <Link
            href="/"
            className="inline-flex items-center font-semibold text-indigo-600 text-sm sm:text-base mt-6 hover:underline"
          >
            <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div className="w-full lg:col-span-2 p-6 sm:p-10 bg-gray-50">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl border-b pb-4 text-gray-800">
            Order Summary
          </h1>

          <div className="flex justify-between mt-6 mb-6">
            <span className="font-medium text-base sm:text-lg text-gray-700">Items ({basket.length})</span>
            <span className="font-medium text-base sm:text-lg text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <label className="font-medium text-base sm:text-lg text-gray-700 block mb-2">Shipping</label>
            <select className="block p-3 w-full text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option>Standard shipping - $10.00</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="promo" className="font-medium text-base sm:text-lg text-gray-700 block mb-2">
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

          <div className="border-t mt-6 py-4">
            <div className="flex font-semibold justify-between text-base sm:text-lg text-gray-700 mb-4">
              <span>Total cost</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className={`bg-[#8710D8] hidden sm:flex justify-center items-center py-3 text-base sm:text-lg font-semibold text-white w-full rounded-md ${basket.length === 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={basket.length === 0 || isLoading}
            >
              {isLoading ? (
                <div className="flex space-x-2 justify-center items-center h-6">
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                </div>
              ) : (
                "Checkout"
              )}
            </button>

            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white z-50">
              <button
                onClick={handleCheckout}
                className={`bg-[#8710D8] flex justify-center items-center py-3 text-base font-semibold text-white w-full rounded-md ${basket.length === 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={basket.length === 0 || isLoading}
              >
                {isLoading ? (
                  <div className="flex space-x-2 items-center h-6">
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                  </div>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


