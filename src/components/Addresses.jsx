'use client'; // Ensure this is a client component to use React hooks

import React from 'react';

const Addresses = ({ options, onSelect, placeholder = 'Select an option' }) => {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    onSelect(selectedId);
  };

  return (
    <select
      onChange={handleChange}
      className="block w-full px-4 py-2 mt-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue=""
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.value}
        </option>
      ))}
    </select>
  );
};

export default Addresses;