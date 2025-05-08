"use client"
import { useState } from 'react';
import { FaTrash, FaLock } from 'react-icons/fa';

const initialCart = [
  {
    id: 1,
    title: 'Apple MacBook Pro',
    color: 'Dark Red',
    price: 100,
    oldPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Apple MacBook Pro',
    color: 'Dark Red',
    price: 100,
    oldPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224c34d?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
  },
  {
    id: 3,
    title: 'Apple MacBook Pro',
    color: 'Dark Red',
    price: 100,
    oldPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1595950658703-ec8b0c22f5d3?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState('');

  const updateQuantity = (id, type) => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              type === 'inc'
                ? item.quantity + 1
                : Math.max(0, item.quantity - 1),
          }
        : item
    );
    setCart(updated);
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-[#f9fbfd] min-h-screen">
      {/* Top Nav */}
      <div className="flex gap-10 text-sm font-medium mb-6 border-b pb-2">
        <span className="text-blue-500 border-b-2 border-blue-500">Cart Details</span>
        <span className="text-gray-400">Shipping Information</span>
        <span className="text-gray-400">Payment</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-4">
            Cart Item <span className="text-sm text-gray-400">({cart.length})</span>
          </h3>
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500 text-left">
              <tr>
                <th className="py-2">Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 flex items-center gap-3">
                    <img src={item.image} className="w-14 h-14 rounded object-cover" />
                    <div>
                      <p>{item.title}</p>
                      <p className="text-xs text-gray-400">{item.color}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      ${item.price.toFixed(2)}
                      <br />
                      <span className="text-xs line-through text-gray-400">${item.oldPrice}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center border rounded w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, 'dec')}
                        className="px-2"
                      >
                        −
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 'inc')}
                        className="px-2"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-blue-500 cursor-pointer">
            &larr; Back to Shopping
          </div>
        </div>

        {/* Right: Summary & Coupon */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Coupon Code */}
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm font-medium mb-2">Have a coupon code?</p>
            <div className="flex">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Discount Coupon"
                className="flex-1 border px-3 py-2 rounded-l text-sm"
              />
              <button className="px-4 bg-gray-100 border border-l-0 rounded-r text-sm">
                Apply
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-4 rounded shadow text-sm">
            <p className="font-medium mb-2">Order Summary</p>
            <div className="flex justify-between mb-1">
              <span>Sub Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Estimated Delivery</span>
              <span>-</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Voucher</span>
              <span>-</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-base mt-2">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white p-4 rounded shadow flex items-center gap-2 text-xs text-gray-500">
            <FaLock className="text-blue-500" />
            Safe & Secure Payment. Easy returns. 100% Authentic products.
          </div>

          {/* Place Order Button */}
          <button className="w-full bg-blue-500 text-white py-3 text-sm rounded hover:bg-blue-600 transition">
            Place an Order
          </button>
        </div>
      </div>
    </div>
  );
}
