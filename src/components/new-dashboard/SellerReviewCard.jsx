// src/components/new-dashboard/SellerReviewCard.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function SellerReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [expandedTags, setExpandedTags] = useState(false);

  const tagColor = (tag) => {
    const positive = ["Helpful seller", "Fast delivery", "Polite", "Great communication"];
    const negative = ["Unresponsive", "Rude", "Delayed"];
    if (positive.includes(tag)) return "bg-green-600";
    if (negative.includes(tag)) return "bg-red-600";
    return "bg-gray-600";
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const reviewText = review.text || review.comment || "";
  const tags = review.tags || [];
  const buyerName = review.reviewer_username || "Anonymous Buyer"; // ✅ updated key
  const productName = review.product_title || review.product_name || "";

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4">
      <div className="flex flex-col space-y-2">
        {/* Rating & Date */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span className="flex items-center gap-1 text-yellow-400 font-semibold">
            <FaStar className="text-yellow-400" /> {review.rating} / 5
          </span>
          <span>{formatDate(review.created_at)}</span>
        </div>

        {/* Product Name */}
        {productName && (
          <p className="text-sm text-blue-400 font-medium">
            🛍️ {productName}
          </p>
        )}

        {/* Review Text */}
        {reviewText && (
          <div className="text-sm text-white mt-1 leading-relaxed">
            <p className={expanded ? "" : "line-clamp-3"}>
              {reviewText}
            </p>
            {reviewText.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-400 hover:underline mt-1"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(expandedTags ? tags : tags.slice(0, 5)).map((tagObj, idx) => {
              const label = typeof tagObj === "string" ? tagObj : tagObj.label;
              return (
                <span
                  key={idx}
                  className={`${tagColor(label)} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}
                >
                  ✅ {label}
                </span>
              );
            })}
            {tags.length > 5 && (
              <button
                onClick={() => setExpandedTags(!expandedTags)}
                className="text-xs text-blue-400 mt-1 hover:underline cursor-pointer"
              >
                {expandedTags ? "Show less tags" : `+${tags.length - 5} more`}
              </button>
            )}
          </div>
        )}

        {/* Reviewer Info */}
        <div className="mt-2 text-xs text-gray-400 italic">
          — {buyerName}
        </div>
      </div>
    </div>
  );
}