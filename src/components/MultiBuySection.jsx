import React, { useState } from "react";

export default function MultiBuySection() {
  // 1) Our array of multi-buy data
  const multiBuyOptions = [
    { label: "Buy 1", price: 285 },
    { label: "Buy 2", price: 265 },
    { label: "Buy 3", price: 250 },
    { label: "Buy 4", price: 240 },
  ];

  // 2) State to track which index is active
  // By default, we can set it to 0 (first item) or null if we want none initially.
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex space-x-2 overflow-x-auto mt-2 scrollbar-hide">
      {multiBuyOptions.map((option, idx) => {
        // 3) Conditionally add black border + bold if this item is active
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)} // 4) Update activeIndex on click
            className={`
              border p-2 text-center min-w-[120px] cursor-pointer
              text-sm md:text-base lg:text-xl hover:bg-gray-50
              ${isActive ? "border-black font-bold border-[3px] rounded-md" : " font-bold rounded-md"}
            `}
          >
            <span className="block text-sm ">{option.label}</span>₵{option.price}
          </div>
        );
      })}
    </div>
  );
}
