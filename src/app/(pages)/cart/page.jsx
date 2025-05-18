"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import {
  setBasket,
  removeFromBasket,
  updateQuantity,
} from "../../store/slices/cartSlice";

const Cart = () => {
  const token = useSelector((state) => state.auth.token);
  const basket = useSelector((state) => state.basket.items);
  const dispatch = useDispatch();
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load basket from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("basket")) || [];
    dispatch(setBasket(stored));
  }, [dispatch]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveProduct = (id) => {
    dispatch(removeFromBasket(id));
  };

  const handleApplyCoupon = () => {
    // Stub: no valid coupons
    setCouponError("No coupon available");
  };

  const handleCheckout = async () => {
    if (!token) {
      router.push("/signin");
      return;
    }
    if (!agreed) return;

    const items = basket.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://media.upfrica.com/api/cart/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ items }),
        }
      );

      if (!response.ok) throw new Error("Failed to add to cart");
      const result = await response.json();
      router.push(`/checkout?cart_id=${result.cart_id}`);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate subtotal
  const subtotal = basket.reduce(
    (sum, item) => sum + (item.price_cents / 100) * item.quantity,
    0
  );

  // Calculate shipping per updated rules:
  // - Group by seller
  // - For each seller group, flatten into individual units
  // - If only one unit, use its primary postage
  // - If multiple units, use the highest-primary for first, then for each extra unit
  //   use its secondary_postage if > 0 (else free)
  const shippingCost = useMemo(() => {
    const bySeller = {};
    basket.forEach((item) => {
      const seller = item.seller || "default";
      bySeller[seller] = bySeller[seller] || [];
      bySeller[seller].push(item);
    });

    let total = 0;
    Object.values(bySeller).forEach((items) => {
      // build a list of units
      const units = [];
      items.forEach(({ postage_fee = 0, secondary_postage_fee = 0, quantity }) => {
        for (let i = 0; i < quantity; i++) {
          units.push({
            postage: postage_fee / 100,
            secondary: secondary_postage_fee / 100,
          });
        }
      });

      if (units.length === 1) {
        total += units[0].postage;
      } else if (units.length > 1) {
        units.sort((a, b) => b.postage - a.postage);
        total += units[0].postage;
        for (let i = 1; i < units.length; i++) {
          total += units[i].secondary > 0 ? units[i].secondary : 0;
        }
      }
    });

    return total;
  }, [basket]);

  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="grid lg:grid-cols-6 gap-5 my-10">
        {/* --- Cart Items --- */}
        <div className="lg:col-span-4 bg-white p-4 lg:p-6 shadow rounded-lg">
          <div className="flex justify-between border-b pb-4">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <h2 className="text-lg font-semibold text-gray-700">
              {basket.length} {basket.length === 1 ? "Item" : "Items"}
            </h2>
          </div>

          {basket.length > 0 ? (
            basket.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 py-4 border-b last:border-b-0"
              >
                <div className="flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28">
                  <img
                    src={product.image?.[0] || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {product.sku || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Postage: ₵{(product.postage_fee / 100).toFixed(2)}
                      </p>
                      {product.quantity > 1 &&
                        product.secondary_postage_fee > 0 && (
                          <p className="text-sm text-gray-500">
                            Secondary Postage: ₵
                            {(product.secondary_postage_fee / 100).toFixed(2)}
                          </p>
                        )}
                    </div>

                    {/* + / – quantity controls */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            product.quantity - 1
                          )
                        }
                        disabled={product.quantity <= 1}
                        className="p-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        <AiOutlineMinus />
                      </button>
                      <span className="px-2">{product.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            product.quantity + 1
                          )
                        }
                        disabled={product.quantity >= 10}
                        className="p-1 border border-gray-300 rounded disabled:opacity-50"
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-500 hover:text-gray-800 text-sm flex items-center">
                        <FaHeart className="mr-1" />
                        Add to Favorites
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <HiMiniXMark className="mr-1" />
                        Remove
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      ₵
                      {(
                        (product.price_cents / 100) *
                        product.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-12">
              Your cart is empty.
            </p>
          )}

          <Link
            href="/"
            className="inline-block mt-6 text-indigo-600 hover:underline text-sm"
          >
            &larr; Continue shopping
          </Link>
        </div>

        {/* --- Order Summary --- */}
        <div className="lg:col-span-2 bg-gray-50 p-6 shadow rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
              Order Summary
            </h2>

            <div className="flex justify-between items-center mt-6">
              <span className="text-lg text-gray-700">
                Items ({basket.length})
              </span>
              <span className="text-lg font-medium text-gray-900">
                ₵{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-6">
              {!showCouponInput ? (
                <button
                  type="button"
                  onClick={() => setShowCouponInput(true)}
                  className="text-sm underline underline-offset-2 text-indigo-600 hover:text-indigo-700"
                >
                  Have a coupon?
                </button>
              ) : (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter your code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="mt-2 w-full py-3 text-sm font-medium uppercase rounded border bg-white"
                  >
                    Apply
                  </button>
                  {couponError && (
                    <p className="mt-1 text-xs text-red-500 underline">
                      {couponError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-lg font-semibold text-gray-700 mt-4">
              <span>Shipping</span>
              <span className="text-gray-900">
                ₵{shippingCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-gray-900 mt-2">
              <span>Total cost</span>
              <span>₵{total.toFixed(2)}</span>
            </div>

            {/* Terms checkbox immediately above the button */}
            <div className="mt-4 flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed((a) => !a)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link href="/terms" className="text-indigo-600 underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-indigo-600 underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={basket.length === 0 || isLoading || !agreed}
              className={`mt-4 w-full justify-center items-center py-3 text-lg font-semibold text-white bg-indigo-600 rounded ${basket.length === 0 || isLoading || !agreed
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
                }`}
            >
              {isLoading ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                </div>
              ) : (
                "Checkout"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Bottom Bar --- */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t py-3 px-6 flex justify-between items-center shadow-md">
        <span className="text-lg font-medium text-gray-900">
          ₵{total.toFixed(2)}
        </span>
        <button
          onClick={handleCheckout}
          disabled={basket.length === 0 || isLoading || !agreed}
          className={`py-3 px-4 text-sm font-semibold text-white bg-indigo-600 rounded ${basket.length === 0 || isLoading || !agreed
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-700"
            }`}
        >
          {isLoading ? (
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
            </div>
          ) : (
            "Checkout"
          )}
        </button>
      </div>
    </div>
  );
};

export default Cart;
