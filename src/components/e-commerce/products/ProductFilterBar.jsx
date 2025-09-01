// components/ProductFilterBar.jsx
import { FaSearch, FaFilter } from "react-icons/fa";

export default function ProductFilterBar({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#f9fbfd] p-4 rounded-lg mb-6">
      {/* Search Input */}
      <div className="relative w-full md:max-w-sm">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sort and Filter */}
      <div className="flex items-center gap-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="high">Price: High To Low</option>
          <option value="low">Price: Low To High</option>
          <option value="rating">Rating</option>
        </select>

        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
          <FaFilter />
          Filter
        </button>
      </div>
    </div>
  );
}
