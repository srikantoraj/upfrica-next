// StillInStockBanner.jsx
"use client";
import React, { useState } from "react";

export default function StillInStockBanner({ price, region, productSlug }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="border border-green-200 bg-green-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-sm text-gray-400 hover:text-red-500"
        aria-label="Close"
      >
        ✕
      </button>

      <div>
        <p className="font-semibold text-green-800 mb-1">
          🎉 Still In Stock – Don’t Miss Out!
        </p>
        <p className="text-sm text-green-700">
          This item is still available for purchase. Current price:{" "}
          <strong>GHS {price}</strong>
        </p>
      </div>

      <a
        href={`/${region}/${productSlug}`}
        className="bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded mt-2 sm:mt-0"
      >
        Buy Now
      </a>
    </div>
  );
}