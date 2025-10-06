// 'use client';

// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   FiSearch,
//   FiStar,
//   FiMessageSquare,
//   FiHelpCircle,
//   FiCalendar,
// } from 'react-icons/fi';
// import Pagination from '@/components/Pagination';
// import LoaderButton from '@/components/LoaderButton';

// const PAGE_SIZE = 20;

// export default function PendingReviewsPage() {
//   const { token } = useSelector((state) => state.auth);
//   const [reviews, setReviews] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [approvingId, setApprovingId] = useState(null);

//   // Fetch pending reviews
//   useEffect(() => {
//     if (!token) return;
//     const fetchReviews = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `https://api.upfrica.com/api/products-reviews/pending/?page=${currentPage}`,
//           {
//             method: 'GET',
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         if (!res.ok) throw new Error('Failed to load reviews');
//         const data = await res.json();
//         setReviews(data.results || []);
//         setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReviews();
//   }, [token, currentPage]);

//   // Approve a review
//   const handleApprove = async (id) => {
//     if (!window.confirm('Approve this review?')) return;
//     setApprovingId(id);
//     try {
//       const res = await fetch(
//         `https://api.upfrica.com/api/reviews/${id}/approve/`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Token ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(id),
//         }
//       );
//       if (!res.ok) throw new Error('Approval failed');
//       setReviews((prev) => prev.filter((r) => r.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert('Could not approve review.');
//     } finally {
//       setApprovingId(null);
//     }
//   };

//   // Filter by review or product title
//   const filtered = reviews.filter((r) => {
//     const rt = r.title?.toLowerCase() || '';
//     const pt = r.product.title.toLowerCase();
//     return (
//       rt.includes(searchTerm.toLowerCase()) ||
//       pt.includes(searchTerm.toLowerCase())
//     );
//   });

//   return (
//     <div className="w-full max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6">Pending Reviews</h1>

//       {/* Full-width Search */}
//       <div className="mb-6">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             placeholder="Search reviews or products..."
//             className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none font-medium"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="space-y-6">
//           {[...Array(3)].map((_, i) => (
//             <div
//               key={i}
//               className="animate-pulse bg-gray-100 h-32 rounded-lg"
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {filtered.length === 0 && (
//             <p className="text-center text-gray-500">No reviews found.</p>
//           )}

//           {filtered.map((r) => (
//             <div
//               key={r.id}
//               className="bg-white shadow rounded-lg p-4 flex items-center space-x-4"
//             >
//               {/* Image */}
//               <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
//                 {r.product.product_images[0] && (
//                   <img
//                     src={r.product.product_images[0]}
//                     alt={r.product.title}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>

//               {/* Info Grid */}
//               <div className="flex-1 grid grid-cols-2 gap-4 text-sm text-gray-700">
//                 {/* Product Title */}
//                 <div>
//                   <span className="font-medium text-gray-800">Product:</span>{' '}
//                   {r.product.title || 'N/A'}
//                 </div>

//                 {/* Review Title */}
//                 <div>
//                   <span className="font-medium text-gray-800">Review:</span>{' '}
//                   {r.title || 'N/A'}
//                 </div>

//                 {/* Rating */}
//                 <div className="flex items-center">
//                   <FiStar className="mr-1 text-yellow-500" />
//                   <span>
//                     {r.rating != null ? `${r.rating}/5` : 'N/A'}
//                   </span>
//                 </div>

//                 {/* Date */}
//                 <div className="flex items-center">
//                   <FiCalendar className="mr-1 text-gray-500" />
//                   <span>
//                     {r.created_at
//                       ? new Date(r.created_at).toLocaleDateString()
//                       : 'N/A'}
//                   </span>
//                 </div>

//                 {/* Comment (span both columns) */}
//                 <div className="col-span-2 flex items-start">
//                   <FiMessageSquare className="mt-1 mr-1 text-gray-500" />
//                   <p className="flex-1">
//                     {r.comment ? r.comment : 'N/A'}
//                   </p>
//                 </div>

//                 {/* Questions (span both columns) */}
//                 <div className="col-span-2">
//                   <div className="flex items-center mb-1">
//                     <FiHelpCircle className="mr-1 text-gray-500" />
//                     <span className="font-medium text-gray-800">
//                       Questions:
//                     </span>
//                   </div>
//                   {r.questions && Object.keys(r.questions).length > 0 ? (
//                     <ul className="list-disc list-inside text-gray-700">
//                       {Object.entries(r.questions).map(([k, v]) => (
//                         <li key={k}>
//                           <span className="capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
//                           {v || 'N/A'}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-700">N/A</p>
//                   )}
//                 </div>
//               </div>

//               {/* Approve Button */}
//               <LoaderButton
//                 loading={approvingId === r.id}
//                 onClick={() => handleApprove(r.id)}
//                 className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${approvingId === r.id
//                     ? 'bg-green-300 text-white'
//                     : 'bg-green-500 hover:bg-green-600 text-white'
//                   }`}
//               >
//                 Approve
//               </LoaderButton>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-8">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiStar,
  FiMessageSquare,
  FiHelpCircle,
  FiCalendar,
  FiTrash,
  FiCheck,
} from "react-icons/fi";
import Pagination from "@/components/Pagination";
import LoaderButton from "@/components/LoaderButton";

const PAGE_SIZE = 20;

export default function PendingReviewsPage() {
  const { token } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch pending reviews
  useEffect(() => {
    if (!token) return;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.upfrica.com/api/products-reviews/pending/?page=${currentPage}`,
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        setReviews(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / PAGE_SIZE));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token, currentPage]);

  // Approve a review
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this review?")) return;
    setApprovingId(id);
    try {
      await fetch(`https://api.upfrica.com/api/reviews/${id}/approve/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not approve review.");
    } finally {
      setApprovingId(null);
    }
  };

  // Delete a review
  const handleDelete = async (r) => {
    if (!window.confirm("Delete this review?")) return;
    setDeletingId(r.id);
    try {
      await fetch(
        `https://api.upfrica.com/api/products/${r.product.slug}/reviews/${r.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setReviews((prev) => prev.filter((rev) => rev.id !== r.id));
    } catch (err) {
      console.error(err);
      alert("Could not delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter by review or product title
  const filtered = reviews.filter((r) => {
    const rt = r.title?.toLowerCase() || "";
    const pt = r.product.title.toLowerCase();
    return (
      rt.includes(searchTerm.toLowerCase()) ||
      pt.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Pending Reviews</h1>

      {/* Full-width Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search reviews or products..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 h-32 rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-lg p-4 space-y-4"
            >
              {/* First row: image + review title */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                  {r.product.product_images[0] && (
                    <img
                      src={r.product.product_images[0]}
                      alt={r.product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h2 className="text-base  text-gray-800 truncate">
                  Title: {r.product.title || "N/A"}
                </h2>
              </div>

              {/* Second row: all other info */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-semibold text-gray-800">Review:</span>{" "}
                  {r.title || "N/A"}
                </div>
                <div className="flex items-center">
                  <FiStar className="mr-1 text-yellow-500" />
                  <span>{r.rating != null ? `${r.rating}/5` : "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1 text-gray-500" />
                  <span>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Comment:</span>{" "}
                  {r.comment || "N/A"}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center mb-1">
                    <FiHelpCircle className="mr-1 text-gray-500" />
                    <span className="font-medium text-gray-800">
                      Questions:
                    </span>
                  </div>
                  {r.questions && Object.keys(r.questions).length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                      {Object.entries(r.questions).map(([k, v]) => (
                        <li key={k}>
                          <span className="capitalize">
                            {k.replace(/_/g, " ")}:
                          </span>{" "}
                          {v || "N/A"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">N/A</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <LoaderButton
                  loading={approvingId === r.id}
                  onClick={() => handleApprove(r.id)}
                  className={`flex items-center px-4 py-2 rounded-full font-semibold ${approvingId === r.id
                      ? "bg-green-300 text-white"
                      : "bg-green-400 hover:bg-green-600 text-white"
                    }`}
                >
                  <FiCheck className="mr-2" />
                  Approve
                </LoaderButton>
                <LoaderButton
                  loading={deletingId === r.id}
                  onClick={() => handleDelete(r)}
                  className={`flex items-center px-4 py-2 rounded-full font-semibold ${deletingId === r.id
                      ? "bg-red-100 text-white"
                      : "bg-red-400 hover:bg-red-600 text-white"
                    }`}
                >
                  <FiTrash className="mr-2" />
                  Delete
                </LoaderButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
