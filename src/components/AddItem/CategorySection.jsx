import React from "react";

export const CategorySection = () => {
  return (
    <div className="">
      {/* Section Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-semibold">Item category</h2>
        <button
          className="text-gray-600 hover:text-black"
          aria-label="Edit Item category"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
          </svg>
        </button>
      </div>

      {/* Category Info */}
      <div className="space-y-1">
        <button
          type="button"
          className="text-blue-600 text-sm hover:underline"
          aria-label="Smart Watches Item category First category"
        >
          Smart Watches
        </button>
        <div className="text-gray-500 text-sm">in Mobile Phones & Communication</div>
      </div>
    </div>
  );
};
