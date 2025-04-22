'use client'
import React, { useState } from "react";

export default function SoldListingsSummary() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white   space-y-6">
      {/* Title + Tooltip */}
      <div className="flex items-start justify-between">
        <span className="text-lg font-semibold text-gray-900">
          Sold listings in the last 90 days
        </span>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Information about sold listings"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 108 8A8 8 0 008 0zm.93 12.588h-1.8v-1.8h1.8zm1.307-6.323a2.312 2.312 0 00-.516-.89 2.247 2.247 0 00-.822-.528 3.414 3.414 0 00-1.066-.169 3.1 3.1 0 00-1.23.247 2.277 2.277 0 00-.902.703 1.753 1.753 0 00-.325.961h1.86a.881.881 0 01.158-.417.87.87 0 01.32-.276 1.107 1.107 0 01.485-.105 1.148 1.148 0 01.589.14.659.659 0 01.264.564.825.825 0 01-.11.406 2.07 2.07 0 01-.379.46c-.21.198-.395.374-.553.528a2.706 2.706 0 00-.426.53 1.615 1.615 0 00-.222.704v.243h1.8v-.12a1.2 1.2 0 01.13-.487 2.021 2.021 0 01.31-.429c.162-.178.34-.355.532-.528a3.151 3.151 0 00.544-.627 1.622 1.622 0 00.219-.872 2.04 2.04 0 00-.148-.761z" />
          </svg>
        </button>
      </div>

      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="border rounded-md p-4 bg-gray-50 text-sm text-gray-700 space-y-3 shadow-md">
          <div>
            <h3 className="font-medium">Recommended starting bid</h3>
            <p>
              A competitive price intended to create more engagement with your listing. Based on sold prices of similar listings (excluding postage and fees).
            </p>
          </div>
          <div>
            <h3 className="font-medium">Median sold price</h3>
            <p>
              The median sold price per item for similar listings, excluding postage and Buyer Protection fees.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Free postage</h3>
            <p>The percentage of sales that included free postage.</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Recommended starting bid</p>
          <p className="text-lg font-bold text-gray-900 mt-1">£47.70</p>
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Median sold price</p>
          <p className="text-lg font-bold text-gray-900 mt-1">£136.91</p>
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Free postage</p>
          <p className="text-lg font-bold text-gray-900 mt-1">33%</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          className="text-blue-600 text-sm font-medium hover:underline"
          type="button"
        >
          See sold listings
        </button>
      </div>
    </div>
  );
}
