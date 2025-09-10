'use client';

import React from 'react';

export default function StickyPriceBar({
  symbol = '₵',
  activePrice,     // string e.g. "129.99"
  onBuyNow,        // () => void
}) {
  if (!activePrice) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 flex items-center justify-between md:hidden z-50">
      <div className="text-lg font-bold">{symbol}{activePrice}</div>
      <button
        onClick={onBuyNow}
        className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold"
      >
        Buy Now (SafePay)
      </button>
    </div>
  );
}