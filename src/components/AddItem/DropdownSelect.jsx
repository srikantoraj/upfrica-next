"use client";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const DropdownSelect = ({ label, tooltip, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      {/* Label (Left) */}
      <div className="w-1/3 text-sm font-medium text-gray-700 ">{label}</div>

      {/* Dropdown (Right) */}
      <div className="w-2/3 relative">
        <button
          type="button"
          className=" flex items-center justify-between w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left text-sm focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {selected || `Select ${label}`}
          <FaChevronRight className="text-gray-400 text-sm rotate-90" />
        </button>

        {open && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto">
            {options.map((option, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className={` cursor-pointer select-none py-2 px-3 hover:bg-blue-100 ${
                  option === selected
                    ? "font-semibold text-blue-600"
                    : "text-gray-900"
                }`}
              >
                <span>{option}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownSelect;
