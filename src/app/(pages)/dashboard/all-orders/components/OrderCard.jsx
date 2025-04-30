"use client";

import { useState, useRef, useEffect } from "react";

const OrderCard = ({
  status = "Processing",
  date = "1 Dec 2024",
  total = "GHS 4000",
  orderNumber = "12345678",
  productTitle = "Fresh Graviola from Sri Lanka (50g)",
  seller = "Shop Name",
  price = "GHS 200",
  returnDate = "12 May",
  imageUrl = "/placeholder.png",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-upfrica mb-6 p-4">
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4 md:gap-0">
        <div className="flex-1 min-w-0">
          <div className="text-green-600 font-bold flex items-center mb-2">
            ✅ {status}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-black">
            <div>
              <span className="block font-bold text-green-600">Order date</span>
              {date}
            </div>
            <div>
              <span className="block font-bold text-green-600">Total</span>
              {total}
            </div>
            <div>
              <span className="block font-bold text-green-600">Order #</span>
              {orderNumber}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button className="h-8 text-white upfrica-btn-primary-sm">
            View details
          </button>
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              className="h-8 upfrica-btn-primary-outline-sm w-full sm:w-auto"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              More actions ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 w-48">
                {[
                  "Contact seller",
                  "Return this item",
                  "I didn’t receive it",
                  "Sell this item",
                  "Add note",
                  "Hide Order",
                  "Help & report",
                ].map((label, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" gap-4 mt-4 flex-wrap">
        <img
          src={imageUrl}
          alt={productTitle}
          className="w-20 h-20 rounded-md object-cover"
        />
        <div>
          <div className="font-semibold">{productTitle}</div>
          <div className="text-sm text-gray-500">
            Sold by:{" "}
            <span className="underline text-black cursor-pointer">{seller} ›</span>
          </div>
          <div className="text-sm">{price}</div>
          <div className="text-sm">Returns accepted until {returnDate}</div>

          <div className="mt-3 w-full overflow-x-auto">
  <div className="flex gap-2 whitespace-nowrap min-w-max pr-4">
    <button className="upfrica-btn-primary-outline-sm text-black">🔁 Buy it again</button>
    <button className="upfrica-btn-primary-outline-sm text-black">✍️ Write a review</button>
    <button className="upfrica-btn-primary-outline-sm text-black">🛍️ Seller's items</button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default OrderCard;