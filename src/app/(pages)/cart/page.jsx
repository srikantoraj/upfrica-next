'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Cart = () => {
  const [basket, setBasket] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [shippingCost] = useState(10); // Fixed shipping cost
  const router = useRouter();

  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasket(storedBasket);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const newBasket = [...basket];
    newBasket[index].quantity = Math.max(1, newQuantity);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  const handleRemoveProduct = (index) => {
    const newBasket = basket.filter((_, i) => i !== index);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    user ? router.push('/checkout') : router.push('/signin');
  };

  const subtotal = basket.reduce(
    (sum, item) => sum + (item.price.cents / 100) * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex shadow-md my-10 bg-gray-100 rounded-lg">
        {/* Cart Items Section */}
        <div className="w-full sm:w-3/5 bg-white p-6 sm:p-10 rounded-lg sm:rounded-r-none">
          <div className="flex justify-between border-b pb-6">
            <h1 className="font-bold text-3xl">Shopping Cart</h1>
            <h2 className="font-semibold text-xl text-gray-700">
              {basket.length} {basket.length === 1 ? 'Item' : 'Items'}
            </h2>
          </div>

          {basket.length > 0 ? (
            basket.map((product, index) => (
              <div
                key={index}
                className="md:flex items-stretch py-6 border-b border-gray-200 last:border-b-0"
              >
                {/* Product Image */}
                <div className="md:w-1/4 w-full mb-4 md:mb-0">
                  <img
                    src={
                      product?.image?.[0] || 'https://via.placeholder.com/150'
                    }
                    alt={product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                {/* Product Details */}
                <div className="md:pl-6 md:w-3/4 w-full flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-1">
                    SKU: {product.sku || 'N/A'}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-lg font-semibold text-gray-800">
                      {product.title}
                    </p>
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="py-2 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-base underline text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                    <p className="text-lg font-medium text-gray-900">
                      {product.price.currency_iso}{' '}
                      {((product.price.cents / 100) * product.quantity).toFixed(
                        2
                      )}
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

          <Link
            href="/"
            className="inline-flex items-center font-semibold text-indigo-600 text-base mt-6 hover:underline"
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

        {/* Order Summary Section */}
        <div
          id="summary"
          className="w-full sm:w-2/5 p-6 sm:p-10 bg-gray-50 rounded-lg sm:rounded-l-none"
        >
          <h1 className="font-bold text-2xl border-b pb-4 text-gray-800">
            Order Summary
          </h1>
          <div className="flex justify-between mt-6 mb-6">
            <span className="font-medium text-base text-gray-700">
              Items ({basket.length})
            </span>
            <span className="font-medium text-base text-gray-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="mb-6">
            <label className="font-medium text-base text-gray-700 block mb-2">
              Shipping
            </label>
            <select className="block p-3 w-full text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option>Standard shipping - $10.00</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="promo"
              className="font-medium text-base text-gray-700 block mb-2"
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
          <button className=" transition-colors px-6 py-3 text-base font-medium  uppercase rounded-md w-full border bg-white">
            Apply
          </button>
          <div className="border-t mt-6 pt-6">
            <div className="flex font-semibold justify-between text-base text-gray-700 mb-4">
              <span>Total cost</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className={`bg-yellow-300 py-3 text-base font-semibold text-white uppercase w-full rounded-md ${
                basket.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
