import { FaCheckCircle, FaStar, FaEdit } from "react-icons/fa";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineFilter,
} from "react-icons/ai";
import { HiOutlineCalendar } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        <AiOutlineLeft className="mr-1" />
        <span>Prev</span>
      </button>
      {getPageNumbers().map((page, i) =>
        typeof page === "number" ? (
          <button
            key={i}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 ${page === currentPage ? "bg-violet-700 text-white" : ""}`}
          >
            {page}
          </button>
        ) : (
          <span key={i} className="px-3 py-1">
            {page}
          </span>
        ),
      )}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
      >
        <span>Next</span>
        <AiOutlineRight className="ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
