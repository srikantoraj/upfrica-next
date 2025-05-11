// src/components/SalesCardGroup.js
import React from "react";
const salesData = [
  {
    title: "Daily Sales",
    amount: "$249.95",
    percent: "20%",
    message: "You made an extra $5,000 this daily",
    progress: 70,
    bgColor: "bg-white",
    textColor: "text-black",
  },
  {
    title: "Monthly Sales",
    amount: "$249.95",
    percent: "20%",
    message: "You made an extra $5,000 this Monthly",
    progress: 75,
    bgColor: "bg-white",
    textColor: "text-black",
  },
  {
    title: "Yearly Sales",
    amount: "$249.95",
    percent: "20%",
    message: "You made an extra $5,000 this Daily",
    progress: 80,
    bgColor: "bg-gradient-to-r from-blue-500 to-blue-400",
    textColor: "text-white",
  },
];


const SalesCardGroup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {salesData.map((item, index) => (
        <div key={index} className={`rounded-xl p-4 shadow-md ${item.bgColor}`}>
          <h4 className={`text-sm font-medium ${item.textColor}`}>{item.title}</h4>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-2xl font-bold ${item.textColor}`}>{item.amount}</p>
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded">
              {item?.percent}
            </span>
          </div>
          <p className={`text-sm mt-1 ${item.textColor}`}>{item.message}</p>
          <div className="w-full h-2 mt-3 bg-gray-200 rounded">
            <div className="h-2 bg-blue-400 rounded" style={{ width: `${item.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesCardGroup;
