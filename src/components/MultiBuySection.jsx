import React, { useState } from "react";

export default function MultiBuySection({ product }) {
  const { price_cents, price_currency, product_quantity } = product || {}

  // Convert price_cents to a numeric value in GHS (assumes price_cents is a string or number).
  const convertedPrice = parseInt(price_cents, 10) / 100;

  // Define discount rates for each quantity option.
  // For quantity 1, no discount (i.e., multiplier 1); for 2, 3 and 4+ we apply progressively higher discounts.
  const discountRates = {
    1: 1,     // No discount for 1 item.
    2: 1,  // 7% off for buying 2.
    3: 1,  // 12% off for buying 3.
    4: 1   // 15% off for buying 4 or more.
  };

  // Build the options based on available quantity.
  // If there are at least 4 products available, the highest option is "4 or more"
  // Otherwise, show one option per product (i.e. "Buy X" up to product_quantity).
  const multiBuyOptions = [];
  const maxOption = product_quantity >= 4 ? 4 : product_quantity;

  for (let i = 1; i <= maxOption; i++) {
    // Use the "4 or more" label if the product quantity is 4+ and we're on the last available option.
    const label = (i === 4 && product_quantity >= 4) ? "4 or more" : `Buy ${i}`;
    // Use the corresponding discount rate; defaulting to the rate for "4 or more" if we exceed defined keys.
    const discountRate = discountRates[i] || discountRates[4];
    // Compute the discounted price per unit.
    const optionPrice = (convertedPrice * discountRate).toFixed(2);
    multiBuyOptions.push({ label, price: optionPrice });
  }

  // Track active selection.
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
