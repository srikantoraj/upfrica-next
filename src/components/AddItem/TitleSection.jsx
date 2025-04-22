'use client'
import React, { useState } from "react";

export const TitleSection = () => {
  const [title, setTitle] = useState("Apple Watch Series 8 41mm Starlight Case with Beige Fluoroelastomer Sport...");
  const [showOptions, setShowOptions] = useState(false);
  const [isSubtitleEnabled, setIsSubtitleEnabled] = useState(false);

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Title</h2>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-sm flex items-center gap-1 text-gray-700 hover:text-black"
          >
            See title options
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
          </button>

          {/* Toggle Dropdown */}
          {showOptions && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow p-4 z-10">
              <p className="text-sm mb-3 text-gray-700">Enable the items below that you’d like to show as an option when listing an item.</p>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Subtitle</p>
                  <p className="text-xs text-gray-500">Subtitles appear in our search results in the list view, and can increase buyer interest by providing more descriptive info (non-refundable fee applies).</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSubtitleEnabled}
                    onChange={() => setIsSubtitleEnabled(!isSubtitleEnabled)}
                  />
                  <div className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${isSubtitleEnabled ? "bg-blue-600" : ""}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isSubtitleEnabled ? "translate-x-5" : ""}`}></div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input field */}
      <div>
        <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Item title
        </label>
        <div className="relative">
          <input
            id="itemTitle"
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute right-2 bottom-2 text-sm text-gray-500">{title.length}/80</div>
        </div>
      </div>
    </div>
  );
};
