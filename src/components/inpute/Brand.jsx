import React, { useState } from 'react';
import InputField from '../InuteFiled';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';

const Brand = ({formik}) => {
    const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
    const [brand, setBrand] = useState(false);
    return (
        <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">*Brand</h2>
            <p>
              Use keywords people would search for when looking for your item.
              Include details such as colour, size, brand & model.
            </p>
            <hr className="border-gray-300 mb-4" />

            <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
              <InputField
                 className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3 hover:cursor-pointer"
                id="brand"
                name="brand"
                placeholder="Search Upfrica BD"
                value={formik?.values?.brand} // Set Formik value
                onClick={() => setArrowShowDropdown(!arrowshowDropdown)} // Toggle dropdown
                onChange={formik.handleChange} // Handle input change
                readOnly={true} // Input is read-only
              />
              {brand ? (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropUp />
                </button>
              ) : (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropDown />
                </button>
              )}

              {/* Dropdown list */}
              {arrowshowDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 1"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 1
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 2"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 2
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 3"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 3
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
    );
};

export default Brand;