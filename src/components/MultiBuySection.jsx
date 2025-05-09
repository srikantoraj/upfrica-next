// import React, { useState } from "react";

// export default function MultiBuySection({ product, onTierSelect, selectedTier }) {
//   const { secondary_data } = product || {};
//   console.log("thrid data", secondary_data);

//   // const tiers = secondary_data?.multi_buy === "yes" ? JSON.parse(secondary_data.multi_buy_tiers) : [];


//   let tiers = [];

//   if (secondary_data?.multi_buy === "yes") {
//     const rawData = secondary_data.multi_buy_tiers;
//     try {
//       tiers = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
//     } catch (e) {
//       console.warn("Failed to parse multi_buy_tiers:", e);
//       tiers = rawData; // fallback to raw if parse fails
//     }
//   }


//   // Don't render if no multi-buy tiers
//   if (!tiers?.length) {
//     return null;
//   }


import React, { useMemo } from "react";

export default function MultiBuySection({ product, onTierSelect, selectedTier }) {
  const { secondary_data } = product || [];

  let tiers = [];

  if (secondary_data?.multi_buy === "yes") {
    const rawData = secondary_data.multi_buy_tiers;
    try {
      tiers = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    } catch (e) {
      console.warn("Failed to parse multi_buy_tiers:", e);
      tiers = rawData;
    }
  }

  if (!tiers?.length) return null;

  const toUnits = (cents) => (parseInt(cents, 10) / 100).toFixed(2);

  const multiBuyOptions = useMemo(() => {
    const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
    return sortedTiers.map(({ min_quantity, price_each }, idx, arr) => {
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
  }, [tiers]);

  return (
    <div className="mt-4 space-y-2">
      <p className="font-medium text-base text-gray-800">Multi-buy:</p>
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {multiBuyOptions.map((opt, idx) => {
          const isActive = selectedTier?.minQuantity === opt.minQuantity;
          return (
            <div
              key={idx}
              onClick={() => {
                if (selectedTier?.minQuantity !== opt.minQuantity) {
                  onTierSelect(opt);
                }
              }}
              className={`min-w-[120px] cursor-pointer border rounded-md text-center p-2 hover:bg-gray-50 transition-all
                ${isActive ? "border-black border-2 font-semibold" : "border-gray-300"}
              `}
            >
              <div className="text-sm text-gray-600">{opt.label}</div>
              <div className="text-base font-bold text-black">₵{opt.price} each</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
