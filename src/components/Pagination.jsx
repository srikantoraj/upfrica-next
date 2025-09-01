// 'use client';

// import React, { useState, useEffect } from 'react';
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => setIsMobile(window.innerWidth <= 768);
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const handlePageClick = (page) => {
//         if (page >= 1 && page <= totalPages && page !== currentPage) {
//             onPageChange(page);
//         }
//     };

//     const getPageNumbers = () => {
//         if (isMobile) {
//             if (totalPages <= 2) {
//                 return [...Array(totalPages).keys()].map((i) => i + 1);
//             }
//             return [1, 2, '…'];
//         }

//         if (totalPages <= 5) {
//             return [...Array(totalPages).keys()].map((i) => i + 1);
//         }

//         if (currentPage <= 3) {
//             return [1, 2, 3, 4, '…', totalPages];
//         }

//         if (currentPage >= totalPages - 2) {
//             return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//         }

//         return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
//     };

//     return (
//         <div className="mt-8 flex justify-center overflow-x-auto">
//             <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2">
//                 <button
//                     onClick={() => handlePageClick(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//                 >
//                     <AiOutlineLeft className="mr-1" />
//                     Prev
//                 </button>

//                 {getPageNumbers().map((page, idx) =>
//                     typeof page === 'number' ? (
//                         <button
//                             key={idx}
//                             onClick={() => handlePageClick(page)}
//                             className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${page === currentPage ? 'bg-violet-700 text-white font-semibold' : ''
//                                 }`}
//                         >
//                             {page}
//                         </button>
//                     ) : (
//                         <span key={idx} className="px-3 py-1 text-gray-500">
//                             {page}
//                         </span>
//                     )
//                 )}

//                 <button
//                     onClick={() => handlePageClick(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//                 >
//                     Next
//                     <AiOutlineRight className="ml-1" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Pagination;

"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    if (isMobile)
      return totalPages <= 2
        ? [1, ...(totalPages === 2 ? [2] : [])]
        : [1, 2, "..."];
    if (totalPages <= 5) return [...Array(totalPages).keys()].map((i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="mt-10 flex justify-center overflow-x-auto">
      <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <AiOutlineLeft className="mr-1" />
          Prev
        </button>
        {getPageNumbers().map((page, i) =>
          typeof page === "number" ? (
            <button
              key={i}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${
                page === currentPage
                  ? "bg-violet-700 text-white font-semibold"
                  : ""
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={i} className="px-3 py-1 text-gray-500">
              …
            </span>
          ),
        )}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
          <AiOutlineRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
