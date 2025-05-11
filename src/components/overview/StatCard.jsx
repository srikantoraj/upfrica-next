// src/components/cards/StatCard.js
import React from "react";

const StatCard = ({ title, amount, percent, message, progress, bgColor, textColor }) => {
  return (
    <div className={`rounded-xl p-4 shadow-md ${bgColor}`}>
      <h4 className={`text-sm font-medium ${textColor}`}>{title}</h4>
      <div className="flex items-center justify-between mt-2">
        <p className={`text-2xl font-bold ${textColor}`}>{amount}</p>
        <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded">
          {percent}
        </span>
      </div>
      <p className={`text-sm mt-1 ${textColor}`}>{message}</p>
      <div className="w-full h-2 mt-3 bg-gray-200 rounded">
        <div className="h-2 bg-blue-400 rounded" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default StatCard;
