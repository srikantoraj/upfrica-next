import React, { useState } from 'react';
import InputField from '../InuteFiled';
import useCategories, { fetchCategories } from '../api/data';

const Categore = ({formik}) => {
   
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false); // To control category dropdown

    const { categories} = useCategories(); // কাস্টম হুক থেকে ডেটা নেওয়া
    return (
        <div className="py-4">
        <h2 className="text-2xl font-bold mb-2">*Category</h2>

        <hr className="border-gray-300 mb-4" />
        <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
          <InputField
            className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3 hover:cursor-pointer"
            type="text"
            placeholder="Search Upfrica BD"
            value={formik.values.category_name} // Formik value
            onClick={(e) => {
              e.stopPropagation();
              const newState = !categoryDropdownOpen; // Toggle state
              console.log('Dropdown state:', newState); // Log the new state
              setCategoryDropdownOpen(newState);
            }}
            onChange={formik.handleChange} // Handle input change
            name="category_name" // Set the name for formik
          />
          <button
            type="button"
            className="bg-purple-500 text-white h-[45px] px-6 rounded-tr-md rounded-br-md"
          >
            More
          </button>

          {/* Dropdown list */}
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
              <ul className="py-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li
                      key={category.id} // Assuming each category has an id
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("category_id", category.id); // Set the selected value to Formik field
                        formik.setFieldValue("category_name", category.name); // Set the selected value to Formik field
                        setCategoryDropdownOpen(false); // Hide dropdown after selection
                      }}
                    >
                      {category.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">Loading...</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <p className="">Select or tap on more</p>
      </div>
    );
};

export default Categore;