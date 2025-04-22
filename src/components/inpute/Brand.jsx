


import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const Brand = ({ formik }) => {
  const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setArrowShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const brandOptions = ["Option 1", "Option 2", "Option 3"];

  return (
    <div className="py-4" ref={wrapperRef}>
      <h2 className="text-2xl font-bold mb-2">*Brand</h2>
      <p className="mb-2 text-gray-600">
        Use keywords people would search for when looking for your item.
        Include details such as colour, size, brand & model.
      </p>

      <div className="relative flex items-center border rounded-lg border-purple-500 px-2">
        <input
          id="brand"
          name="brand"
          type="text"
          placeholder="Select Brand"
          value={formik.values.brand || ""}
          readOnly
          onClick={() => setArrowShowDropdown((prev) => !prev)}
          className="w-full border-none focus:ring-0 px-3 py-2 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setArrowShowDropdown((prev) => !prev)}
          className="ml-2 focus:outline-none"
        >
          <IoIosArrowDown className="w-5 h-5" />
        </button>

        {arrowshowDropdown && (
          <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
            <ul className="py-2">
              {brandOptions.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    formik.setFieldValue("brand", option);
                    setArrowShowDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;
