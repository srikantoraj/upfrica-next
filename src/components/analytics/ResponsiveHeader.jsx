import React, { useState } from "react";
import { LuMenu, LuSearch } from "react-icons/lu";

const ResponsiveHeader = ({ handleToggleClick }) => {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const toggleMobileSearch = () => {
    setShowSearchMobile((prev) => !prev);
  };

  return (
    <div className="ml-auto flex items-center space-x-2 md:space-x-4 pb-10 ">
      {/* Sidebar Toggle */}
      <button
        id="sidebar-hide"
        onClick={handleToggleClick}
        className="md:inline-flex items-center justify-center p-2 rounded hover:bg-gray-100"
      >
        <LuMenu className="w-6 h-6" />
      </button>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center border rounded px-2 py-1">
        <input
          type="search"
          className="flex-1 outline-none border-none bg-transparent text-sm"
          placeholder="Search..."
        />
        <button
          type="button"
          className="text-xs px-2 text-gray-600 hover:text-black"
        >
          <kbd>Ctrl+K</kbd>
        </button>
      </div>

      {/* Mobile Search Icon */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100 "
        onClick={toggleMobileSearch}
      >
        <LuSearch className="w-5 h-5" />
      </button>

      {/* Mobile Search Box - visible only on toggle */}
      {showSearchMobile && (
        <div className="w-64 bg-white border rounded shadow-md p-2 md:hidden z-50">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring"
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveHeader;
