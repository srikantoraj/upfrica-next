// export default SellerOrdersData;
// src/components/overview/SellerOrdersData.js
import React from "react";
import { FaInbox, FaTruck, FaUndo } from "react-icons/fa";

const iconMap = {
  New: FaInbox,
  Shipped: FaTruck,
  "Cancelled / Returned": FaUndo,
};

const SellerOrdersData = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center animate-pulse"
          >
            <div>
              <div className="h-6 w-6 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-300 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-10" />
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-300 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {orders.map((item, idx) => {
        const Icon = iconMap[item.seller] || FaInbox;
        const growthDisplay = item.growth != null ? `${item.growth}%` : "--";
        return (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="text-2xl text-gray-700" />
                <h3 className="text-sm font-semibold text-gray-700">
                  {item.seller} Orders
                </h3>
              </div>
              <p className="text-xl font-bold text-gray-900">{item.orders}</p>
              <p className="text-sm text-green-500 font-medium">
                {growthDisplay}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Avg. Target Orders</p>
              <p className="text-md font-bold text-gray-700">{item.target}</p>
              <p className="text-sm text-gray-500 mt-2">Avg. Ship Time</p>
              <p className="text-md font-bold text-gray-700">
                {item.avgShipTime ?? "--"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SellerOrdersData;
