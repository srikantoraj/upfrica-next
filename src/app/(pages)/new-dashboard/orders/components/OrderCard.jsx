'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";

const OrderCard = ({
  status = "Processing",
  date,
  total,
  orderNumber,
  product,
  price,
  returnDate = "12 May",
  order,
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const maskedPhone = order?.address?.address_data?.phone_number?.replace(
    /(\+\d{3})\s\d{2}\s\d{3}/,
    "$1 ***"
  );

  const sellerName = product?.shop?.name || product?.user?.username || "Seller";

  const getImageUrl = () => {
    const img = product?.product_images?.[0];
    if (typeof img === "string") return img;
    if (img?.image && typeof img.image === "string") return img.image;
    return "/placeholder.png";
  };

  const productTitle = product?.title || "Untitled Product";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-upfrica mb-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 gap-4 md:gap-0">
        <div className="flex-1 min-w-0">
          <div className="text-green-600 font-bold flex items-center mb-2">
            ✅ {status}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-black dark:text-white">
            <div>
              <span className="block font-bold text-green-600">Order #</span>
              {orderNumber}
            </div>
            <div>
              <span className="block font-bold text-green-600">Order date</span>
              {date}
            </div>
            <div>
              <span className="block font-bold text-green-600">Total</span>
              {total}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            className="h-8 text-white upfrica-btn-primary-sm"
            onClick={() => router.push(`/new-dashboard/orders/${order?.id}`)}
          >
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
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 w-48">
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
                    className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <div className="flex gap-4 mb-4">
          <div className="w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
            <img
              src={getImageUrl()}
              alt={productTitle}
              className="w-20 h-20 object-cover shrink-0 rounded-md"
              onError={(e) => {
                if (!e.currentTarget.src.includes("placeholder.png")) {
                  e.currentTarget.src = "/placeholder.png";
                }
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black dark:text-white">{productTitle}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              Sold by: <span className="underline text-black dark:text-white cursor-pointer">{sellerName} ›</span>
            </div>
            <div className="text-sm text-black dark:text-white">{price}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Returns accepted until {returnDate}</div>
          </div>
        </div>

        {/* Action buttons and address */}
        <div>
          <div className="flex gap-2 mb-4 w-full overflow-x-auto scrollbar-hide">
            <button className="upfrica-btn-primary-outline-sm text-black dark:text-white">🔁 Buy it again</button>
            <button className="upfrica-btn-primary-outline-sm text-black dark:text-white">✍️ Write a review</button>
            <button className="upfrica-btn-primary-outline-sm text-black dark:text-white">🛍️ Seller's items</button>
          </div>

          <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <span className="font-semibold text-gray-800 dark:text-white">Delivery Info:</span>
            <div className="grid grid-cols-1 items-center">
              <div className="flex items-center space-x-2">
                <AiOutlineHome className="text-violet-600" size={18} />
                <span>
                  {showFullInfo
                    ? `${order?.address?.address_data?.address_line_1 || ""}${order?.address?.address_data?.address_line_2 ? ", " + order.address.address_data.address_line_2 : ""}, ${order?.address?.address_data?.local_area || ""}, ${order?.address?.address_data?.town || ""}, ${order?.address?.address_data?.country || ""}`
                    : `${order?.address?.address_data?.town || ""}, ${order?.address?.address_data?.country || ""}`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <AiOutlineUser className="text-violet-600" size={18} />
                <span>
                  {showFullInfo
                    ? `${order?.buyer?.first_name} ${order?.buyer?.last_name}`
                    : `${order?.buyer?.first_name} ${order?.buyer?.last_name?.[0] || ""}.`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <AiOutlinePhone className="text-violet-600" size={18} />
                <span>{showFullInfo ? order?.address?.address_data?.phone_number : maskedPhone}</span>
              </div>
            </div>

            <button
              onClick={() => setShowFullInfo(!showFullInfo)}
              className="text-sm text-purple-600 dark:text-purple-400 mt-2 underline"
            >
              {showFullInfo ? "Hide full info ▲" : "Show full info ▼"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;