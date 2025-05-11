import React, { useState } from "react";
import { LuMenu, LuSearch } from "react-icons/lu";

const ResponsiveHeader = ({ handleToggleClick }) => {
  const [showSearchMobile, setShowSearchMobile] = useState(false);

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

    </div>
  );
};

export default ResponsiveHeader;

