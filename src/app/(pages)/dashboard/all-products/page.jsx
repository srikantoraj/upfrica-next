"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 20;
const SKELETON_ROWS = 10;
const DEBOUNCE_DELAY = 500;

export default function DashboardPage() {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();

  // PRODUCTS & PAGINATION
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // SEARCH
  const [searchInput, setSearchInput] = useState(""); // immediate input
  const [searchQuery, setSearchQuery] = useState(""); // debounced

  // DELETE STATE & ALERT
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Fetch products (list or search) when token, page or searchQuery changes
  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const base = "https://api.upfrica.com/api/seller/products";
        const url = searchQuery
          ? `${base}/search/?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`
          : `${base}/?page=${currentPage}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        setProducts(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Could not load products." });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, currentPage, searchQuery]);

  // Debounce the searchInput into searchQuery
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // DELETE handler with loading button text and alert
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `https://api.upfrica.com/api/seller/products/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setAlert({ type: "success", message: "Product deleted successfully." });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Could not delete product. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (slug) => {
    router.push(`/products/edit/${slug}`);
  };

  return (
    <>
      {/* HEADER + SEARCH */}
      <header className="flex items-center space-x-6 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
          <p className="text-gray-600">Welcome to seller dashboard</p>
        </div>
        <div className="relative flex-1 max-w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </header>

      {/* ALERT BANNER */}
      {alert.message && (
        <div
          className={`mb-4 px-4 py-3 border rounded ${alert.type === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
            }`}
        >
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert({ type: "", message: "" })}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Products</h2>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-[35%] pb-2">Product Info</th>
              <th className="w-[10%] pb-2">Date Added</th>
              <th className="w-[10%] pb-2">Price</th>
              <th className="w-[10%] pb-2">Status</th>
              <th className="w-[10%] pb-2">Viewed</th>
              <th className="w-[10%] pb-2">Sold</th>
              <th className="w-[15%] pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                <tr key={idx} className="even:bg-gray-50 animate-pulse">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                      <div className="flex-1 max-w-[40%]">
                        <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                  </td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="even:bg-gray-50">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      {p.product_images[0] && (
                        <img
                          src={p.product_images[0]}
                          alt={p.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div>{p.title}</div>
                        <div className="text-gray-500 text-sm">
                          SKU: {p.u_pid}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {(p.price_cents / 100).toFixed(2)} {p.price_currency}
                  </td>
                  <td className="py-3">
                    <span
                      className={
                        p.status === 1 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {p.status === 1 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3">{p.impressions_count ?? 0}</td>
                  <td className="py-3">{p.likes ?? 0}</td>
                  <td className="py-3 space-x-4">
                    <button
                      onClick={() => handleEdit(p.slug)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className={`${deletingId === p.id
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:underline"
                        }`}
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BOTTOM PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}

// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useSelector } from 'react-redux';
// // import { FiSearch } from 'react-icons/fi';
// // import { useRouter } from 'next/navigation';
// // import Pagination from '@/components/Pagination';

// // const PAGE_SIZE = 20;
// // const SKELETON_ROWS = 10;

// // export default function DashboardPage() {
// //     const { user, token } = useSelector((state) => state.auth);
// //     const router = useRouter();

// //     const [products, setProducts] = useState([]);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [totalPages, setTotalPages] = useState(1);
// //     const [loading, setLoading] = useState(false);

// //     useEffect(() => {
// //         if (!token) return;
// //         setLoading(true);
// //         fetch(`https://api.upfrica.com/api/seller/products/?page=${currentPage}`, {
// //             method: 'GET',
// //             headers: { Authorization: `Token ${token}` },
// //         })
// //             .then((res) => {
// //                 if (!res.ok) throw new Error('Failed to fetch products');
// //                 return res.json();
// //             })
// //             .then((data) => {
// //                 setProducts(data.results || []);
// //                 setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
// //             })
// //             .catch((err) => console.error(err))
// //             .finally(() => setLoading(false));
// //     }, [token, currentPage]);

// //     const handleDelete = async (id) => {
// //         const confirmed = window.confirm(
// //             'Are you sure you want to delete this product?'
// //         );
// //         if (!confirmed) return;

// //         try {
// //             const res = await fetch(
// //                 `https://api.upfrica.com/api/seller/products/${id}/`,
// //                 {
// //                     method: 'DELETE',
// //                     headers: { Authorization: `Token ${token}` },
// //                 }
// //             );
// //             if (!res.ok) throw new Error('Failed to delete product');
// //             // remove from local state
// //             setProducts((prev) => prev.filter((p) => p.id !== id));
// //         } catch (err) {
// //             console.error(err);
// //             alert('Could not delete product. Please try again.');
// //         }
// //     };

// //     const handleEdit = (id) => {
// //         router.push(`/products/edit/${id}`);
// //     };

// //     return (
// //         <>
// //             {/* HEADER + SEARCH */}
// //             <header className="flex items-center space-x-6 mb-6">
// //                 <div>
// //                     <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
// //                     <p className="text-gray-600">Welcome to seller dashboard</p>
// //                 </div>
// //                 <div className="relative flex-1 max-w-full">
// //                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                     <input
// //                         type="text"
// //                         placeholder="Search something here …"
// //                         className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
// //                     />
// //                 </div>
// //             </header>

// //             {/* ALL PRODUCTS TABLE */}
// //             <div className="bg-white p-4 rounded-lg shadow-sm">
// //                 {/* Title + Pagination */}
// //                 <div className="flex items-center justify-between mb-4">
// //                     <h2 className="text-xl font-semibold">All Products</h2>
// //                     {totalPages > 1 && (
// //                         <Pagination
// //                             currentPage={currentPage}
// //                             totalPages={totalPages}
// //                             onPageChange={setCurrentPage}
// //                         />
// //                     )}
// //                 </div>

// //                 <table className="w-full table-fixed text-left">
// //                     <thead>
// //                         <tr className="border-b border-gray-200">
// //                             <th className="w-[35%] pb-2">Product Info</th>
// //                             <th className="w-[10%] pb-2">Date Added</th>
// //                             <th className="w-[10%] pb-2">Price</th>
// //                             <th className="w-[10%] pb-2">Status</th>
// //                             <th className="w-[10%] pb-2">Viewed</th>
// //                             <th className="w-[10%] pb-2">Sold</th>
// //                             <th className="w-[15%] pb-2">Action</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {loading ? (
// //                             Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
// //                                 <tr key={idx} className="even:bg-gray-50 animate-pulse">
// //                                     <td className="py-3">
// //                                         <div className="flex items-center space-x-3">
// //                                             <div className="w-10 h-10 bg-gray-200 rounded" />
// //                                             <div className="flex-1 max-w-[40%]">
// //                                                 <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
// //                                                 <div className="h-3 bg-gray-200 rounded w-1/2" />
// //                                             </div>
// //                                         </div>
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
// //                                     </td>
// //                                 </tr>
// //                             ))
// //                         ) : products.length > 0 ? (
// //                             products.map((p) => (
// //                                 <tr key={p.id} className="even:bg-gray-50">
// //                                     <td className="py-3">
// //                                         <div className="flex items-center space-x-3">
// //                                             {p.product_images[0] && (
// //                                                 <img
// //                                                     src={p.product_images[0]}
// //                                                     alt={p.title}
// //                                                     className="w-20 h-20 object-cover rounded"
// //                                                 />
// //                                             )}
// //                                             <div className="flex-1">
// //                                                 <div>{p.title}</div>
// //                                                 <div className="text-gray-500 text-sm">
// //                                                     SKU: {p.u_pid}
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </td>
// //                                     <td className="py-3">
// //                                         {new Date(p.created_at).toLocaleDateString()}
// //                                     </td>
// //                                     <td className="py-3">
// //                                         {(p.price_cents / 100).toFixed(2)} {p.price_currency}
// //                                     </td>
// //                                     <td className="py-3">
// //                                         <span
// //                                             className={
// //                                                 p.status === 1 ? 'text-green-600' : 'text-red-600'
// //                                             }
// //                                         >
// //                                             {p.status === 1 ? 'In Stock' : 'Out of Stock'}
// //                                         </span>
// //                                     </td>
// //                                     <td className="py-3">{p.impressions_count ?? 0}</td>
// //                                     <td className="py-3">{p.likes ?? 0}</td>
// //                                     <td className="py-3 space-x-4">
// //                                         <button
// //                                             onClick={() => handleEdit(p.slug)}
// //                                             className="text-blue-600 hover:underline"
// //                                         >
// //                                             Edit
// //                                         </button>
// //                                         <button
// //                                             onClick={() => handleDelete(p.id)}
// //                                             className="text-red-600 hover:underline"
// //                                         >
// //                                             Delete
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))
// //                         ) : (
// //                             <tr>
// //                                 <td colSpan={7} className="py-4 text-center text-gray-500">
// //                                     No products found.
// //                                 </td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* Bottom Pagination */}
// //             {totalPages > 1 && (
// //                 <div className="flex items-center justify-center mt-4">
// //                     <Pagination
// //                         currentPage={currentPage}
// //                         totalPages={totalPages}
// //                         onPageChange={setCurrentPage}
// //                     />
// //                 </div>
// //             )}
// //         </>
// //     );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { FiSearch } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';
// import Pagination from '@/components/Pagination';

// const PAGE_SIZE = 20;
// const SKELETON_ROWS = 10;

// export default function DashboardPage() {
//     const { user, token } = useSelector((state) => state.auth);
//     const router = useRouter();

//     // Products & pagination
//     const [products, setProducts] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);

//     // Search
//     const [searchInput, setSearchInput] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');

//     // Deletion state & alert
//     const [deletingId, setDeletingId] = useState(null);
//     const [alert, setAlert] = useState({ type: '', message: '' });

//     // Fetch products (list or search) whenever token, page or searchQuery changes
//     useEffect(() => {
//         if (!token) return;

//         const fetchProducts = async () => {
//             setLoading(true);
//             try {
//                 // Choose the correct endpoint
//                 const base = 'https://api.upfrica.com/api/seller/products';
//                 const url = searchQuery
//                     ? `${base}/search/?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`
//                     : `${base}/?page=${currentPage}`;

//                 const res = await fetch(url, {
//                     method: 'GET',
//                     headers: { Authorization: `Token ${token}` },
//                 });
//                 if (!res.ok) throw new Error('Failed to fetch products');
//                 const data = await res.json();

//                 setProducts(data.results || []);
//                 setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
//             } catch (err) {
//                 console.error(err);
//                 setAlert({ type: 'error', message: 'Could not load products.' });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, [token, currentPage, searchQuery]);

//     // Handle Enter in search input
//     const handleSearchKey = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             setSearchQuery(searchInput.trim());
//             setCurrentPage(1);
//         }
//     };

//     // Delete handler with loading state and alert
//     const handleDelete = async (id) => {
//         const confirmed = window.confirm(
//             'Are you sure you want to delete this product?'
//         );
//         if (!confirmed) return;

//         setDeletingId(id);
//         try {
//             const res = await fetch(
//                 `https://api.upfrica.com/api/seller/products/${id}/`,
//                 {
//                     method: 'DELETE',
//                     headers: { Authorization: `Token ${token}` },
//                 }
//             );
//             if (!res.ok) throw new Error('Failed to delete product');

//             // Remove from local list
//             setProducts((prev) => prev.filter((p) => p.id !== id));
//             setAlert({ type: 'success', message: 'Product deleted successfully.' });
//         } catch (err) {
//             console.error(err);
//             setAlert({ type: 'error', message: 'Could not delete product. Please try again.' });
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     const handleEdit = (slug) => {
//         router.push(`/products/edit/${slug}`);
//     };

//     return (
//         <>
//             {/* HEADER + SEARCH */}
//             <header className="flex items-center space-x-6 mb-6">
//                 <div>
//                     <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
//                     <p className="text-gray-600">Welcome to seller dashboard</p>
//                 </div>
//                 <div className="relative flex-1 max-w-full">
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search products…"
//                         className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
//                         value={searchInput}
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         onKeyDown={handleSearchKey}
//                     />
//                 </div>
//             </header>

//             {/* ALERT BANNER */}
//             {alert.message && (
//                 <div
//                     className={`mb-4 px-4 py-3 border rounded ${alert.type === 'success'
//                             ? 'bg-green-100 border-green-400 text-green-700'
//                             : 'bg-red-100 border-red-400 text-red-700'
//                         }`}
//                 >
//                     <span>{alert.message}</span>
//                     <button
//                         onClick={() => setAlert({ type: '', message: '' })}
//                         className="float-right font-bold"
//                     >
//                         ×
//                     </button>
//                 </div>
//             )}

//             {/* ALL PRODUCTS TABLE */}
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//                 {/* Title + Pagination */}
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">All Products</h2>
//                     {totalPages > 1 && (
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={setCurrentPage}
//                         />
//                     )}
//                 </div>

//                 <table className="w-full table-fixed text-left">
//                     <thead>
//                         <tr className="border-b border-gray-200">
//                             <th className="w-[35%] pb-2">Product Info</th>
//                             <th className="w-[10%] pb-2">Date Added</th>
//                             <th className="w-[10%] pb-2">Price</th>
//                             <th className="w-[10%] pb-2">Status</th>
//                             <th className="w-[10%] pb-2">Viewed</th>
//                             <th className="w-[10%] pb-2">Sold</th>
//                             <th className="w-[15%] pb-2">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {loading ? (
//                             Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
//                                 <tr key={idx} className="even:bg-gray-50 animate-pulse">
//                                     <td className="py-3">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-10 h-10 bg-gray-200 rounded" />
//                                             <div className="flex-1 max-w-[40%]">
//                                                 <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
//                                                 <div className="h-3 bg-gray-200 rounded w-1/2" />
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
//                                     </td>
//                                     <td className="py-3">
//                                         <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : products.length > 0 ? (
//                             products.map((p) => (
//                                 <tr key={p.id} className="even:bg-gray-50">
//                                     <td className="py-3">
//                                         <div className="flex items-center space-x-3">
//                                             {p.product_images[0] && (
//                                                 <img
//                                                     src={p.product_images[0]}
//                                                     alt={p.title}
//                                                     className="w-20 h-20 object-cover rounded"
//                                                 />
//                                             )}
//                                             <div className="flex-1">
//                                                 <div>{p.title}</div>
//                                                 <div className="text-gray-500 text-sm">
//                                                     SKU: {p.u_pid}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="py-3">
//                                         {new Date(p.created_at).toLocaleDateString()}
//                                     </td>
//                                     <td className="py-3">
//                                         {(p.price_cents / 100).toFixed(2)} {p.price_currency}
//                                     </td>
//                                     <td className="py-3">
//                                         <span
//                                             className={
//                                                 p.status === 1 ? 'text-green-600' : 'text-red-600'
//                                             }
//                                         >
//                                             {p.status === 1 ? 'In Stock' : 'Out of Stock'}
//                                         </span>
//                                     </td>
//                                     <td className="py-3">{p.impressions_count ?? 0}</td>
//                                     <td className="py-3">{p.likes ?? 0}</td>
//                                     <td className="py-3 space-x-4">
//                                         <button
//                                             onClick={() => handleEdit(p.slug)}
//                                             className="text-blue-600 hover:underline"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(p.id)}
//                                             disabled={deletingId === p.id}
//                                             className={`${deletingId === p.id
//                                                     ? 'text-gray-400 cursor-not-allowed'
//                                                     : 'text-red-600 hover:underline'
//                                                 }`}
//                                         >
//                                             {deletingId === p.id ? 'Deleting…' : 'Delete'}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={7} className="py-4 text-center text-gray-500">
//                                     No products found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Bottom Pagination */}
//             {totalPages > 1 && (
//                 <div className="flex items-center justify-center mt-4">
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={setCurrentPage}
//                     />
//                 </div>
//             )}
//         </>
//     );
// }
