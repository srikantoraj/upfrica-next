// components/ItemAttributeField.jsx
import React, { useState } from "react";

const ItemAttributeField = ({
  label,
  tooltip,
  options = [],
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mb-6 relative">
      <div className="flex items-center gap-2 mb-1">
        <label className="font-medium text-gray-700">{label}</label>
        <div className="group relative">
          <span className="text-sm text-blue-600 cursor-pointer">?</span>
          <div className="absolute hidden group-hover:block bg-white text-sm text-gray-700 p-2 border shadow-md w-64 z-10">
            {tooltip}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-3 py-2 border border-gray-300 rounded bg-white flex justify-between items-center"
        >
          <span>{selected || "Select an option"}</span>
          <svg className="w-4 h-4" viewBox="0 0 20 20">
            <path d="M5 8l5 5 5-5H5z" fill="currentColor" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search or enter your own"
                className="w-full border px-2 py-1 text-sm rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredOptions.map((opt, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <span>{opt}</span>
                {opt === selected && (
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20">
                    <path
                      d="M7.629 13.53l-3.3-3.3L2.5 12.06l5.13 5.13 10.37-10.37-1.83-1.83z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemAttributeField;
