"use client";
import React from "react";

export default function RelatedProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[370px] font-sans animate-pulse">
      {/* Image Section */}
      <div className="relative w-full h-[230px]">
        <div className="w-full h-full bg-gray-300" />
      </div>
      {/* Product Details */}
      <div className="px-4 py-3">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      {/* Price & Cart Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-6 bg-gray-300 rounded w-1/3" />
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
