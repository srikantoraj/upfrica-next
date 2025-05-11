// src/components/cards/SellerOrdersGroup.js
import React from "react";
import { FaStore, FaShoppingCart, FaBox } from "react-icons/fa";

const sellerOrders = [
  {
    seller: "Amazon",
    Icon: FaStore,
    orders: 23540,
    growth: "+5.1%",
    target: 50000,
    avgShipTime: "2.3d",
    color: "text-yellow-600",
  },
  {
    seller: "eBay",
    Icon: FaShoppingCart,
    orders: 12430,
    growth: "+3.2%",
    target: 30000,
    avgShipTime: "3.8d",
    color: "text-blue-600",
  },
  {
    seller: "Etsy",
    Icon: FaBox,
    orders: 8430,
    growth: "+4.7%",
    target: 20000,
    avgShipTime: "4.1d",
    color: "text-purple-600",
  },
];

const SellerOrdersData = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sellerOrders.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <item.Icon className={`text-2xl ${item.color}`} />
              <h3 className="text-sm font-semibold text-gray-700">
                {item.seller} Orders
              </h3>
            </div>
            <p className="text-xl font-bold text-gray-900">{item.orders}</p>
            <p className="text-sm text-green-500 font-medium">{item.growth}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Target Orders</p>
            <p className="text-md font-bold text-gray-700">{item.target}</p>
            <p className="text-sm text-gray-500 mt-2">Avg. Ship Time</p>
            <p className="text-md font-bold text-gray-700">
              {item.avgShipTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerOrdersData;
