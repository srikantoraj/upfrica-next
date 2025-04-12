import React from "react";

const SearchBar = () => {
  return (
    <div className="relative focus-within:drop-shadow-lg z-20">
      <input
        type="search"
        placeholder="Search for..."
        className="w-full rounded-md border-0 bg-white py-3 pl-6 pr-14 text-bc-black ring-1 ring-gray-1000 focus:ring-gray-1000 sm:text-sm sm:leading-6 peer"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-6 focus:outline-none pointer-events-none peer-focus:hidden"
      >
        <svg
          className="h-4 w-4 text-gray-900"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
