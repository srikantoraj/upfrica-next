import React, { useState } from "react";

export default function MultiBuySection({ product }) {
  const { secondary_data } = product || {};
  const tiers = secondary_data?.multi_buy === "yes" ? secondary_data.multi_buy_tiers : [];

  // Don't render if no multi-buy tiers
  if (!tiers?.length) {
    return null;
  }

  // Helper: convert cents (string|number) to units with two decimals
  const toUnits = (cents) => (parseInt(cents, 10) / 100).toFixed(2);

  // Sort tiers by min_quantity asc
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);

  // Build options, labeling each except the last normally, and the last as "and more"
  const multiBuyOptions = sortedTiers.map(({ min_quantity, price_each }, idx, arr) => {
    const isLast = idx === arr.length - 1;
    const label = isLast
      ? `Buy ${min_quantity} and more`
      : `Buy ${min_quantity}`;
    return {
      label,
      price: toUnits(price_each),
      minQuantity: min_quantity,
    };
  });

  // Active selection state
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="mt-4 space-y-2">
      <p className="font-medium text-base text-gray-800">Multi-buy:</p>
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {multiBuyOptions.map((opt, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`min-w-[120px] cursor-pointer border rounded-md text-center p-2 hover:bg-gray-50 transition-all
                ${isActive ? "border-black border-2 font-semibold" : "border-gray-300"}
              `}
            >
              <div className="text-sm text-gray-600">{opt.label}</div>
              <div className="text-base font-bold text-black">
                ₵{opt.price} each
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
