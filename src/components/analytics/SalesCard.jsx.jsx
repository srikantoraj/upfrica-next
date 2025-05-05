// src/components/cards/SalesCard.js
import React from "react";

const SalesCard = ({ title, amount, percent }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">${amount}</div>
      <div className="text-sm text-green-600 mt-1 font-semibold">+{percent}%</div>
    </div>
  );
};

export default SalesCard;
