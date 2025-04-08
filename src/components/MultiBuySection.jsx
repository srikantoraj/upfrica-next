import React, { useState } from "react";

export default function MultiBuySection() {
  const multiBuyOptions = [
    { label: "Buy 1", price: 285 },
    { label: "Buy 2", price: 265 },
    { label: "Buy 3", price: 250 },
    { label: "4 or more", price: 240 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mt-4 space-y-2">
      {/* Title */}
      <p className="font-medium text-base text-gray-800">Multi-buy:</p>

      {/* Options */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {multiBuyOptions.map((option, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`min-w-[120px] cursor-pointer border rounded-md text-center p-2 hover:bg-gray-50 transition-all
                ${isActive ? "border-black border-[2px] font-semibold" : "border-gray-300"}
              `}
            >
              <div className="text-sm text-gray-600">{option.label}</div>
              <div className="text-base font-bold text-black">₵{option.price} each</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
