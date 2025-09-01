"use client";
import React from "react";
import { FiEdit2 } from "react-icons/fi";

export const CategorySection = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Item category</h2>
        <button
          type="button"
          aria-label="Edit Item category"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <FiEdit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Category Value */}
      <div className="text-sm text-gray-800">
        <button
          type="button"
          className="text-blue-600 hover:underline focus:outline-none"
        >
          Smart Watches
        </button>
        <div className="text-xs text-gray-500 mt-1">
          in Mobile Phones & Communication
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-4"></div>
    </div>
  );
};
