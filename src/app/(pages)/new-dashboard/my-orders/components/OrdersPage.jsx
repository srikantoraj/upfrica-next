// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import OrderCard from "./OrderCard";
// import Pagination from "@/components/Pagination";
// import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

// const PAGE_SIZE = 20;

// export default function OrdersPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = useSelector((state) => state.auth.token);

//   const pageParam = parseInt(searchParams.get("page") || "1", 10);
//   const [orders, setOrders] = useState([]);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const debounceRef = useRef(null);

//   // 1️⃣ Fetch paginated orders
//   useEffect(() => {
//     if (!token) return;
//     setLoading(true);
//     fetch(`https://media.upfrica.com/api/buyer/orders/?page=${pageParam}`, {
//       headers: {
//         Authorization: `Token ${token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         setOrders(data.results);
//         setCount(data.count);
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [token, pageParam]);

//   const totalPages = Math.ceil(count / PAGE_SIZE);
//   const goToPage = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       router.push(`/new-dashboard/my-orders?page=${newPage}`);
//     }
//   };

//   // 2️⃣ Debounced client-side search over orders & items
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       setSearchLoading(false);
//       return;
//     }
//     setSearchLoading(true);
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       const q = searchQuery.toLowerCase();
//       const hits = orders.flatMap((order) =>
//         order.order_items
//           .filter(
//             (item) =>
//               item.product.title.toLowerCase().includes(q) ||
//               String(order.id).includes(q)
//           )
//           .map((item) => ({ ...item, order }))
//       );
//       setSearchResults(hits);
//       setSearchLoading(false);
//     }, 300);
//     return () => clearTimeout(debounceRef.current);
//   }, [searchQuery, orders]);

//   // 3️⃣ Which orders to display?
//   const displayOrders = searchQuery
//     ? Array.from(new Set(searchResults.map((i) => i.order.id))).map(
//       (id) => searchResults.find((i) => i.order.id === id).order
//     )
//     : orders;

//   return (
//     <div className="bg-gray-100 min-h-screen text-black font-sans px-4 sm:px-6 lg:px-8 py-6">
//       {/* ── Search Bar ── */}
//       <div className="relative w-full sm:max-w-xl mx-auto mb-4">
//         <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-700" />
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search orders by product name or order #..."
//           className="w-full rounded-full border border-gray-300 px-10 py-2 text-sm sm:text-base focus:outline-none"
//         />
//         {searchQuery && (
//           <AiOutlineClose
//             onClick={() => setSearchQuery("")}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-600 cursor-pointer"
//           />
//         )}
//       </div>

//       <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
//         My Orders
//       </h1>

//       {loading ? (
//         <div className="text-center text-gray-600 text-sm sm:text-base py-10">
//           Loading your orders...
//         </div>
//       ) : error ? (
//         <p className="text-red-600 text-center text-sm sm:text-base py-10">
//           Error loading orders: {error}
//         </p>
//       ) : (
//         <>
//           {displayOrders.length === 0 ? (
//             <p className="text-center text-gray-500 text-sm sm:text-base py-10">
//               {searchQuery
//                 ? searchLoading
//                   ? "Searching…"
//                   : "No matching orders found."
//                 : "You have no orders yet."}
//             </p>
//           ) : (
//             <div className="space-y-6">
//               {displayOrders.map((order) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   items={
//                     searchQuery
//                       ? searchResults.filter((i) => i.order.id === order.id)
//                       : order.order_items
//                   }
//                 />
//               ))}
//             </div>
//           )}

//           {/* ── Pagination ── */}
//           {!searchQuery && totalPages > 1 && (
//             <div className="mt-6 flex justify-center">
//               <Pagination
//                 currentPage={pageParam}
//                 totalPages={totalPages}
//                 onPageChange={goToPage}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import OrderCard from "./OrderCard";
import Pagination from "@/components/Pagination";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  // ── 1️⃣ Fetch paginated orders (only when not searching)
  useEffect(() => {
    if (!token || searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    fetch(`https://media.upfrica.com/api/buyer/orders/?page=${pageParam}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data.results);
        setCount(data.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, pageParam, searchQuery]);

  // ── 2️⃣ Debounced server-side search
  useEffect(() => {
    // if search cleared, reset searchLoading & error
    if (!searchQuery.trim()) {
      setSearchLoading(false);
      setError(null);
      return;
    }

    setSearchLoading(true);
    setError(null);

    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetch(
        `https://media.upfrica.com/api/buyer/orders/search/?q=${encodeURIComponent(
          searchQuery
        )}&page=${pageParam}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setOrders(data.results);
          setCount(data.count);
        })
        .catch((err) => setError(err.message))
        .finally(() => setSearchLoading(false));
    }, 300);

    // cleanup on unmount or next effect run
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, token, pageParam]);

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/new-dashboard/my-orders?page=${newPage}`);
    }
  };


  // ── Skeleton card for loading state
  // const SkeletonCard = () => (
  //   <div className="border rounded-lg bg-white p-4 animate-pulse flex space-x-4">
  //     <div className="w-16 h-16 bg-gray-300 rounded-md" />
  //     <div className="flex-1 space-y-2 py-1">
  //       <div className="h-4 bg-gray-300 rounded w-1/3" />
  //       <div className="h-3 bg-gray-300 rounded w-2/3" />
  //       <div className="h-3 bg-gray-300 rounded w-1/2" />
  //     </div>
  //   </div>
  // );


    // ── Skeleton mimicking OrderCard
  const SkeletonCard = () => (
    <div className="md:w-full bg-white rounded-xl shadow-upfrica mb-6 p-4 animate-pulse">
      {/* — Header skeleton — */}
      <div className="flex flex-col md:flex-row justify-between bg-gray-100 rounded-lg p-4 gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 rounded w-12" />
              <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 rounded w-12" />
              <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 rounded w-12" />
              <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="h-8 bg-gray-300 rounded w-24" />
        </div>
      </div>

      {/* — Items list skeleton — */}
      <div className="mt-4 space-y-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-3 animate-pulse flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-md" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/3" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* — Delivery info skeleton — */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-3 bg-gray-300 rounded w-2/3" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen text-black font-sans px-4 sm:px-6 lg:px-8 py-6">
      {/* ── Search Bar ── */}
      <div className="relative w-full sm:max-w-xl mx-auto mb-4">
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-700" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders by product name or order #..."
          className="w-full rounded-full border border-gray-300 px-10 py-2 text-sm sm:text-base focus:outline-none"
        />
        {searchQuery && (
          <AiOutlineClose
            onClick={() => {
              setSearchQuery("");
              router.push(`/new-dashboard/my-orders?page=1`);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-600 cursor-pointer"
          />
        )}
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        My Orders
      </h1>

      {/* product card  */}
      {/* ── Loading / Error / Empty / Data States ── */}
      {loading || searchLoading ? (
        <div className="space-y-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600 text-center text-sm sm:text-base py-10">
          Error: {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base py-10">
          {searchQuery
            ? "No orders matched your search."
            : "You have no orders yet."}
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                items={order.order_items}
              />
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
}


// loading cart

//  {(loading || searchLoading) ? (
//         <div className="text-center text-gray-600 text-sm sm:text-base py-10">
//           {searchLoading ? "Searching orders…" : "Loading your orders…"}
//         </div>
//       ) : error ? (
//         <p className="text-red-600 text-center text-sm sm:text-base py-10">
//           Error: {error}
//         </p>
//       ) : orders.length === 0 ? (
//         <p className="text-center text-gray-500 text-sm sm:text-base py-10">
//           {searchQuery
//             ? "No orders matched your search."
//             : "You have no orders yet."}
//         </p>
//       ) : (
//         <>
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <OrderCard
//                 key={order.id}
//                 order={order}
//                 items={order.order_items}
//               />
//             ))}
//           </div>

//           {/* ── Pagination ── */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex justify-center">
//               <Pagination
//                 currentPage={pageParam}
//                 totalPages={totalPages}
//                 onPageChange={goToPage}
//               />
//             </div>
//           )}
//         </>
//       )}
