"use client";

import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";

export default function BuyerInfoBlock({
  order,
  showFullInfo,
  setShowFullInfo,
}) {
  if (!order || typeof order !== "object") {
    return (
      <div className="text-sm text-red-500 dark:text-red-400 italic">
        No delivery information available.
      </div>
    );
  }

  const addressData = order.address?.address_data || {};
  const buyer = order.buyer || {};

  return (
    <div className="text-sm">
      <h3 className="font-semibold mb-1  dark:text-gray-300">Delivery info</h3>

      <div className="flex items-center gap-2">
        <AiOutlineHome />
        <span>
          {showFullInfo
            ? addressData.address_line_1 || "No address provided"
            : `${addressData.town || "Unknown"}, ${addressData.country || ""}`}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <AiOutlineUser />
        <span>
          {showFullInfo
            ? `${buyer.first_name || ""} ${buyer.last_name || ""}`
            : `${buyer.first_name || ""} ${buyer.last_name?.[0] || ""}.`}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <AiOutlinePhone />
        <span>
          {showFullInfo
            ? addressData.phone_number || "Hidden"
            : "+233 *** ****"}
        </span>
      </div>

      <button
        onClick={() => setShowFullInfo(!showFullInfo)}
        className="text-purple-600 dark:text-purple-400 mt-2 underline text-sm"
      >
        {showFullInfo ? "Hide full address" : "View full address"}
      </button>
    </div>
  );
}
