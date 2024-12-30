// app/cart/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

// Reusable Quantity Control Component
const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center text-base">
    <button
      onClick={onDecrease}
      className="px-4 py-1 font-extrabold border bg-gray-100 hover:bg-gray-200"
      aria-label="Decrease quantity"
    >
      -
    </button>
    <span className="font-bold bg-white py-1 px-4 border">{quantity}</span>
    <button
      onClick={onIncrease}
      className="px-4 border py-1 font-extrabold bg-gray-100 hover:bg-gray-200"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

const Cart = () => {
  const [basket, setBasket] = useState([]);
  const router = useRouter(); // Initialize useRouter

  // Load basket data from localStorage on component mount
  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasket(storedBasket);
  }, []);

  // Handle quantity changes for products
  const handleQuantityChange = (index, change) => {
    const newBasket = [...basket];
    newBasket[index].quantity = Math.max(1, newBasket[index].quantity + change);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  // Handle removal of products from the basket
  const handleRemoveProduct = (index) => {
    const newBasket = basket.filter((_, i) => i !== index);
    setBasket(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  };

  // Handle navigation to Checkout or Sign-In based on user authentication
  const handleCheckout = () => {
    // Retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      // If user exists, navigate to the Checkout page
      router.push('/checkout');
    } else {
      // If user does not exist, navigate to the Sign-In page
      router.push('/signin');
    }
  };

  return (
    <div className="lg:flex justify-center bg-gray-100 px-4 py-10">
      <div className="w-full lg:w-4/5 2xl:w-1/2 pt-10 space-y-5">
        <h1 className="text-xl xl:text-2xl font-bold tracking-wide p-2 border bg-white shadow-xl text-center">
          Shopping Basket
        </h1>
        {basket.length > 0 ? (
          basket.map((product, index) => (
            <div key={index} className="border-b last:border-none p-4 bg-white">

              {/* Large Device Card */}
              <div className="hidden md:flex  space-x-4 text-base">
                <div className="flex-shrink-0">
                  <img
                    className="h-24 w-24 lg:h-32 lg:w-32 rounded-md object-cover"
                    src={product?.image?.[0] ?? 'https://via.placeholder.com/150'}
                    alt={product.title}
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-lg font-semibold line-clamp-2 text-gray-900 underline">{product.title}</p>
                  <p className="text-base text-gray-600">Variation</p>
                </div>
                <div className="flex  flex-col items-end">
                  <QuantityControl
                    quantity={product.quantity}
                    onDecrease={() => handleQuantityChange(index, -1)}
                    onIncrease={() => handleQuantityChange(index, 1)}
                  />
                  <p className="mt-2 text-xl font-bold">
                    {product.price.currency_iso} {(product.price.cents / 100).toFixed(2)}
                  </p>
                </div>
                <div className=" flex flex-col justify-end">
                  <MdDeleteOutline
                    className="w-8 h-8 text-gray-800 cursor-pointer hover:text-red-500 "
                    onClick={() => handleRemoveProduct(index)}
                    aria-label="Remove product"
                  />
                </div>
              </div>

              {/* Small Device Card */}
              <div className="md:hidden grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <img
                    className="h-20 w-20 rounded-md object-cover"
                    src={product?.image?.[0] ?? 'https://via.placeholder.com/150'}
                    alt={product.title}
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-lg font-semibold line-clamp-2 text-gray-900">{product.title}</p>
                  <p className="text-sm text-gray-600">Variation</p>
                  <div className="flex justify-between items-center mt-2">
                    <QuantityControl
                      quantity={product.quantity}
                      onDecrease={() => handleQuantityChange(index, -1)}
                      onIncrease={() => handleQuantityChange(index, 1)}
                    />
                    <div className="text-sm font-bold">
                      {product.price.currency_iso} {(product.price.cents / 100).toFixed(2)}
                    </div>
                    <MdDeleteOutline
                      className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveProduct(index)}
                      aria-label="Remove product"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))

        ) : (
          <p className="text-center text-gray-600">Your basket is empty.</p>
        )}
        <div className="flex justify-between mt-5">
          <button
            onClick={handleCheckout}
            className={`text-base font-bold ${basket.length > 0 ? 'bg-[#F7C32E] hover:bg-[#e6b42d]' : 'bg-gray-400 cursor-not-allowed'
              } px-4 py-1 rounded-3xl`}
            disabled={basket.length === 0}
          >
            Checkout
          </button>
          <Link href="/">
            <div
              className="text-base font-bold border bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-3xl"
              aria-label="Continue shopping"
            >
              Continue shopping
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;