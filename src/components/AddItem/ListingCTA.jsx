import React from "react";

export default function ListingCTA() {
  return (
    <div className="flex flex-col  mt-6 lg:w-1/4 space-y-3 mx-auto px-8 lg:px-0">
      <button
        type="button"
        className="px-6 py-3 text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-full shadow"
        aria-label="List it for free"
      >
        List it for free
      </button>

      <button
        type="button"
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
        aria-label="Save for later"
      >
        Save for later
      </button>

      <button
        type="button"
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
        aria-label="Preview"
        name="preview"
      >
        Preview
      </button>
    </div>
  );
}
