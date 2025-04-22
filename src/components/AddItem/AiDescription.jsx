import React from "react";

const DescriptionEditor = () => {
  return (
    <section className="">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Description</h2>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-2">
        <button
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          className="p-2 border border-gray-300 rounded hover:bg-gray-100"
          title="Unordered List"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 14 12"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3ZM5 1.5C5 0.947715 5.44772 0.5 6 0.5H13C13.5523 0.5 14 0.947715 14 1.5C14 2.05228 13.5523 2.5 13 2.5H6C5.44772 2.5 5 2.05228 5 1.5ZM1.5 7.5C2.32843 7.5 3 6.82843 3 6C3 5.17157 2.32843 4.5 1.5 4.5C0.671573 4.5 0 5.17157 0 6C0 6.82843 0.671573 7.5 1.5 7.5ZM6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7H13C13.5523 7 14 6.55228 14 6C14 5.44772 13.5523 5 13 5H6ZM5 10.5C5 9.94771 5.44772 9.5 6 9.5H13C13.5523 9.5 14 9.94771 14 10.5C14 11.0523 13.5523 11.5 13 11.5H6C5.44772 11.5 5 11.0523 5 10.5ZM1.5 12C2.32843 12 3 11.3284 3 10.5C3 9.67157 2.32843 9 1.5 9C0.671573 9 0 9.67157 0 10.5C0 11.3284 0.671573 12 1.5 12Z"
              fill="#111820"
            />
          </svg>
        </button>

        {/* Custom Template dropdown (dummy) */}
        <div className="relative group">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
            Custom template
            <svg
              className="w-3 h-3 inline ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <ul className="absolute hidden group-hover:block bg-white border border-gray-200 mt-1 shadow text-sm rounded w-48 z-10">
            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
              Create template
            </li>
            <li className="px-4 py-2 text-gray-400 cursor-not-allowed">
              Create new (10 left)
            </li>
          </ul>
        </div>

        <button className="text-blue-600 text-sm hover:underline ml-auto">
          Show all options
        </button>
      </div>

      {/* Rich Text Editor (basic textarea for now) */}
      <div className="mb-4">
        <textarea
          className="w-full h-40 border border-gray-300 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a detailed description of your item, or let AI draft it for you..."
        ></textarea>
      </div>

      {/* AI Description Suggestion */}
      <div className="text-right">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Use AI description
        </button>
      </div>
    </section>
  );
};

export default DescriptionEditor;
