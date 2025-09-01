"use client";

import React from "react";
import StarRating from "@/components/common/StarRating";

export default function ReviewSummaryBox({
  averageRating = 0,
  reviewCount = 0,
  ratingPercent = {},
  onWriteReviewClick = null,
}) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <StarRating rating={averageRating} />
          <span className="text-sm text-gray-600 text-center sm:text-left">
            Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
          </span>
        </div>

        <a
          href="#write-review"
          onClick={(e) => {
            if (onWriteReviewClick) {
              e.preventDefault();
              onWriteReviewClick();
            }
          }}
          className="text-sm btn-primary text-white px-3 py-1.5 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black text-center"
          role="button"
          tabIndex={0}
        >
          📝 Write a Review
        </a>
      </div>

      {/* Rating Bar Breakdown */}
      <div className="space-y-2 mt-2">
        {stars.map((star) => {
          const percent = ratingPercent?.[star] || 0;
          return (
            <div
              key={star}
              className="flex items-center gap-2 text-sm"
              aria-label={`${star} star rating - ${percent.toFixed(1)}%`}
            >
              <span className="w-6">{star} ★</span>
              <div className="flex-1 bg-gray-100 rounded h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="w-12 text-right text-gray-600">
                {percent.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}