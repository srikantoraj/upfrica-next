
// Brand.js
import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import useBrands from '../api/useBrands';

const Brand = ({ formik }) => {
  const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const { brands, loading, error } = useBrands();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setArrowShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find the name of the currently selected brand (Formik stores the id)
  const selectedBrandName =
    brands.find((b) => b.id === formik.values.brand)?.name || '';

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
          value={selectedBrandName}
          readOnly
          onClick={() => !loading && setArrowShowDropdown((prev) => !prev)}
          className="w-full border-none focus:ring-0 px-3 py-2 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => !loading && setArrowShowDropdown((prev) => !prev)}
          className="ml-2 focus:outline-none"
        >
          <IoIosArrowDown className="w-5 h-5" />
        </button>

        {arrowshowDropdown && (
          <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10 max-h-60 overflow-auto">
            <ul className="py-2">
              {loading && (
                <li className="px-4 py-2 text-gray-500">লোড হচ্ছে…</li>
              )}
              {error && (
                <li className="px-4 py-2 text-red-500">
                  Error: {error}
                </li>
              )}
              {!loading && !error && brands.map((brand) => (
                <li
                  key={brand.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    formik.setFieldValue("brand", brand.id);
                    setArrowShowDropdown(false);
                  }}
                >
                  {brand.name}
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
