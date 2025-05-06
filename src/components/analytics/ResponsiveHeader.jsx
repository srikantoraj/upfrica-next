import React, { useState } from "react";
import { LuMenu, LuSearch } from "react-icons/lu";

const ResponsiveHeader = ({ handleToggleClick }) => {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const toggleMobileSearch = () => setShowSearchMobile((prev) => !prev);

  return (
    <div className="ml-auto flex items-center gap-2 md:gap-4 relative pb-10">
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleToggleClick}
        className="p-2 rounded hover:bg-gray-100 transition"
        aria-label="Toggle Sidebar"
      >
        <LuMenu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Desktop Search Field */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-md px-3 py-1 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
        <input
          type="search"
          className="w-full bg-transparent text-sm outline-none border-none focus:ring-0"
          placeholder="Search..."
        />
        <button
          type="button"
          className="ml-2 text-xs text-gray-600 hover:text-black"
          title="Shortcut"
        >
          <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">Ctrl+K</kbd>
        </button>
      </div>

      {/* Mobile Search Toggle Icon */}
      <button
        onClick={toggleMobileSearch}
        className="md:hidden p-2 rounded hover:bg-gray-100 transition"
        aria-label="Open Mobile Search"
      >
        <LuSearch className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Search Field */}
      {showSearchMobile && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-2 md:hidden z-50">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveHeader;

