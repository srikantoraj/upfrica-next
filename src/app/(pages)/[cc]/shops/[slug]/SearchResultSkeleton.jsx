"use client";
import React from "react";

export default function SearchResultSkeleton() {
  return (
    <div className="flex items-center p-4 border border-gray-200 rounded shadow animate-pulse bg-white mb-2">
      {/* Small image placeholder */}
      <div className="w-16 h-16 rounded bg-gray-300 flex-shrink-0"></div>
      {/* Content placeholders */}
      <div className="ml-4 flex flex-col space-y-2 flex-1">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
}
