'use client'
import React, { useState } from 'react';
// import './styles.css'; // For custom transitions (optional)

const attributes = [
  {
    label: 'Item Height',
    tooltip: 'Measured height from top to bottom when upright.',
    options: ['15 in', '75 in', '250 cm'],
  },
  {
    label: 'Item Length',
    tooltip: 'Measured length from left to right when upright.',
    options: ['0.5 in', '1 in', '18 in'],
  },
  {
    label: 'Item Width',
    tooltip: 'Shortest horizontal side of the item.',
    options: ['15 in', '100 cm', '150 cm'],
  },
  {
    label: 'Type',
    tooltip: 'Specific type of product, e.g., "Wardrobe"',
    options: ['Wardrobe', 'Canvas Wardrobe', 'Freestanding Wardrobe'],
  },
];

const ItemAttributesForm = () => {
  const [values, setValues] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleChange = (label, value) => {
    setValues({ ...values, [label]: value });
  };

  return (
    <form className="">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Item Details</h2>

      {attributes.map((attr, index) => (
        <div key={index} className="flex justify-between items-start mb-6">
          {/* Label + Tooltip */}
          <div className="w-1/3 pr-4">
            <label className="text-sm font-medium text-gray-800 flex items-center">
              {attr.label}
              <div className="ml-2 relative group">
                
                <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-md w-48 z-20 top-5 left-0">
                  {attr.tooltip}
                </div>
              </div>
            </label>
          </div>

          {/* Select Input */}
          <div className="w-2/3 relative">
            <select
              onFocus={() => setOpenDropdown(attr.label)}
              onBlur={() => setOpenDropdown(null)}
              value={values[attr.label] || ''}
              onChange={(e) => handleChange(attr.label, e.target.value)}
              className={`w-full border border-gray-300 rounded-md p-2 text-sm transition-all duration-300 ease-in-out ${
                openDropdown === attr.label ? 'shadow-lg scale-[1.02]' : 'shadow-sm'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select {attr.label}</option>
              {attr.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </form>
  );
};

export default ItemAttributesForm;
