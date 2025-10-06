// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

// import Filter from './Filter';
// import ProductCard from '@/components/home/ProductList/ProductCard';
// import SearchBox from './SearchBox';

// const PAGE_SIZE = 20;

// const SkeletonLoader = () => (
//     <div className="bg-gray-200 animate-pulse rounded-lg overflow-hidden border p-4 flex items-center space-x-6">
//         <div className="w-1/4 h-52 bg-gray-300 rounded-md"></div>
//         <div className="w-3/4 space-y-2">
//             <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//             <div className="h-6 bg-gray-300 rounded w-1/4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/3"></div>
//         </div>
//     </div>
// );

// // --- Inline Pagination component ---
// function Pagination({ currentPage, totalPages, onPageChange }) {
//     const handlePageClick = (page) => {
//         if (page >= 1 && page <= totalPages && page !== currentPage) {
//             onPageChange(page);
//         }
//     };

//     const getPageNumbers = () => {
//         const pages = [];
//         if (totalPages <= 5) {
//             for (let i = 1; i <= totalPages; i++) pages.push(i);
//         } else {
//             if (currentPage <= 3) {
//                 pages.push(1, 2, 3, 4, '...', totalPages);
//             } else if (currentPage >= totalPages - 2) {
//                 pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 pages.push(
//                     1,
//                     '...',
//                     currentPage - 1,
//                     currentPage,
//                     currentPage + 1,
//                     '...',
//                     totalPages
//                 );
//             }
//         }
//         return pages;
//     };

//     return (
//         <div className="flex items-center space-x-2">
//             <button
//                 onClick={() => handlePageClick(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//             >
//                 <AiOutlineLeft className="mr-1" />
//                 <span>Prev</span>
//             </button>

//             {getPageNumbers().map((page, idx) =>
//                 typeof page === 'number' ? (
//                     <button
//                         key={idx}
//                         onClick={() => handlePageClick(page)}
//                         className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 ${page === currentPage ? 'bg-violet-700 text-white' : ''
//                             }`}
//                     >
//                         {page}
//                     </button>
//                 ) : (
//                     <span key={idx} className="px-3 py-1">
//                         {page}
//                     </span>
//                 )
//             )}

//             <button
//                 onClick={() => handlePageClick(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//             >
//                 <span>Next</span>
//                 <AiOutlineRight className="ml-1" />
//             </button>
//         </div>
//     );
// }
// // --- end Pagination ---

// export default function FilterPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const q = searchParams.get('q') || '';
//     const currentPage = parseInt(searchParams.get('page') || '1', 10);

//     const [products, setProducts] = useState([]);
//     const [count, setCount] = useState(0);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             if (!q) {
//                 setProducts([]);
//                 setCount(0);
//                 setLoading(false);
//                 return;
//             }

//             setLoading(true);
//             try {
//                 const res = await fetch(
//                     `https://api.upfrica.com/api/products/?search=${encodeURIComponent(q)}&page=${currentPage}`
//                 );
//                 const json = await res.json();
//                 setProducts(json.results ?? []);
//                 setCount(json.count ?? 0);
//             } catch (err) {
//                 console.error("Error fetching search results:", err);
//                 setProducts([]);
//                 setCount(0);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [q, currentPage]);

//     const totalPages = Math.ceil(count / PAGE_SIZE);

//     const onPageChange = (page) => {
//         const params = new URLSearchParams();
//         if (q) params.set('q', q);
//         params.set('page', String(page));
//         router.push(`?${params.toString()}`);
//     };

//     return (
//         <div className={loading ? 'h-screen' : 'h-auto'}>
//             <div className="grid lg:grid-cols-7 gap-10">
//                 {/* sidebar filters */}
//                 <div className="col-span-2 hidden lg:block">
//                     <Filter />
//                 </div>

//                 {/* main content */}
//                 <div className="col-span-5 p-4">
//                     {/* <div className='py-4'>
//                         <SearchBox />
//                     </div> */}
//                     <h1 className="text-2xl font-semibold tracking-wide pb-4">
//                         {q
//                             ? `Search results for “${q}”`
//                             : 'Enter a search term to find products'}
//                     </h1>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {loading
//                             ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
//                                 <SkeletonLoader key={i} />
//                             ))
//                             : products.length > 0
//                                 ? products.map((product) => (
//                                     <ProductCard key={product.id} product={product} />
//                                 ))
//                                 : (
//                                     <p className="text-gray-500 col-span-full">
//                                         No products found for “{q}”
//                                     </p>
//                                 )}
//                     </div>

//                     {/* pagination */}
//                     {!loading && products.length > 0 && (
//                         <div className="mt-8 flex justify-center">
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={onPageChange}
//                             />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

import Filter from "./Filter";
import ProductCard from "@/components/home/ProductList/ProductCard";
import SearchBox from "./SearchBox";

const PAGE_SIZE = 20;

function SkeletonLoader() {
  return (
    <div className="bg-gray-200 animate-pulse rounded-lg overflow-hidden border p-4 flex items-center space-x-6">
      <div className="w-1/4 h-52 bg-gray-300 rounded-md"></div>
      <div className="w-3/4 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
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

      {getPageNumbers().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 ${page === currentPage ? "bg-violet-700 text-white" : ""
              }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-3 py-1">
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
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";
  const brand = searchParams.get("brand") || "";
  const ordering = searchParams.get("ordering") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!q && !category && !condition && !brand) {
        setProducts([]);
        setCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = new URL("https://api.upfrica.com/api/products/search/");
        url.searchParams.set("q", q);
        url.searchParams.set("page", currentPage);
        if (category) url.searchParams.set("category", category);
        if (condition) url.searchParams.set("condition", condition);
        if (brand) url.searchParams.set("brand", brand);
        if (ordering) url.searchParams.set("ordering", ordering);
        console.log(url.toString());

        const res = await fetch(url.toString());
        const json = await res.json();
        setProducts(json.results ?? []);
        setCount(json.count ?? 0);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setProducts([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, category, condition, brand, ordering, currentPage]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const onPageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={loading ? "h-screen" : "h-auto"}>
      <div className="grid lg:grid-cols-7 gap-10">
        {/* sidebar filters */}
        <div className="col-span-2 hidden lg:block">
          <Filter />
        </div>

        {/* main content */}
        <div className="col-span-5 p-4">
          <div className="py-4">
            <SearchBox />
          </div>
          <h1 className="text-2xl font-semibold tracking-wide pb-4">
            {q || category || condition || brand
              ? `Showing results${q ? ` for “${q}”` : ""}`
              : "Enter a search term to find products"}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonLoader key={i} />
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No products found</p>
            )}
          </div>

          {!loading && products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
