// 'use client';

// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

// const PendingReviewsPage = () => {
//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     const fetchPendingReviews = async () => {
//       try {
//         const res = await fetch(
//           'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Token ${token}`, // adjust to `Bearer` if needed
//             },
//           }
//         );

//         if (!res.ok) {
//           console.error('Failed to fetch pending reviews:', res.status, await res.text());
//           return;
//         }

//         const data = await res.json();
//         console.log('✅ Pending reviews:', data);
//       } catch (err) {
//         console.error('Error fetching pending reviews:', err);
//       }
//     };

//     // only fetch if we have a token
//     if (token) {
//       fetchPendingReviews();
//     } else {
//       console.warn('No auth token found—skipping pending reviews fetch.');
//     }
//   }, [token]);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>
//       <p className="text-gray-600">
//         Check your browser console (<code>F12</code> → Console) to see the array of pending reviews returned by the API.
//       </p>
//     </div>
//   );
// };

// export default PendingReviewsPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const PendingReviewsPage = () => {
//   const token = useSelector((state) => state.auth.token);
//   const [pendingReviews, setPendingReviews] = useState([]);

//   useEffect(() => {
//     const fetchPendingReviews = async () => {
//       try {
//         const res = await fetch(
//           'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Token ${token}`, // adjust to `Bearer` if needed
//             },
//           }
//         );

//         if (!res.ok) {
//           console.error('Failed to fetch pending reviews:', res.status, await res.text());
//           return;
//         }

//         const data = await res.json();
//         console.log('✅ Pending reviews:', data);
//         setPendingReviews(data);
//       } catch (err) {
//         console.error('Error fetching pending reviews:', err);
//       }
//     };

//     if (token) {
//       fetchPendingReviews();
//     } else {
//       console.warn('No auth token found—skipping pending reviews fetch.');
//     }
//   }, [token]);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>
//       {pendingReviews.length === 0 ? (
//         <p className="text-gray-600">কোনো pending review পাওয়া যায়নি।</p>
//       ) : (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Title</th>
//               <th className="px-4 py-2 border">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingReviews.map((review) => (
//               <tr key={review.id}>
//                 <td className="px-4 py-2 border">{review.id}</td>
//                 <td className="px-4 py-2 border">{review.title}</td>
//                 <td className="px-4 py-2 border">{review.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default PendingReviewsPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const PendingReviewsPage = () => {
//   const token = useSelector((state) => state.auth.token);
//   const [pendingReviews, setPendingReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedReview, setSelectedReview] = useState(null);

//   // 1) Fetch pending reviews
//   useEffect(() => {
//     if (!token) return;
//     const fetchPendingReviews = async () => {
//       try {
//         const res = await fetch(
//           'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error(await res.text());
//         setPendingReviews(await res.json());
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchPendingReviews();
//   }, [token]);

//   // 2) Open modal and set which review ইডিট হবে
//   const handleEditClick = (review) => {
//     setSelectedReview(review);
//     setIsModalOpen(true);
//   };

//   // 3) Save new status (0→1) via PATCH, তারপর UI-তে আপডেট
//   const handleSaveStatus = async () => {
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/admin/reviews/${selectedReview.id}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify({ status: 1 }),
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       const updated = await res.json();
//       setPendingReviews((prev) =>
//         prev.map((r) =>
//           r.id === updated.id
//             ? { ...r, status: updated.status }
//             : r
//         )
//       );
//       setIsModalOpen(false);
//       setSelectedReview(null);
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   // 4) Delete review: DELETE কল আর UI-তে ফিল্টার
//   const handleDelete = async (id) => {
//     if (!confirm('আপনি কি সত্যি ডিলিট করতে চান?')) return;
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/admin/reviews/${id}/`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error(res.status);
//       setPendingReviews((prev) => prev.filter((r) => r.id !== id));
//     } catch (err) {
//       console.error('Failed to delete review:', err);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>

//       {pendingReviews.length === 0 ? (
//         <p className="text-gray-600">কোনো pending review পাওয়া যায়নি।</p>
//       ) : (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Title</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingReviews.map((review) => (
//               <tr key={review.id}>
//                 <td className="px-4 py-2 border">{review.id}</td>
//                 <td className="px-4 py-2 border">{review.title}</td>
//                 <td className="px-4 py-2 border">{review.status}</td>
//                 <td className="px-4 py-2 border space-x-2">
//                   <button
//                     className="px-2 py-1 bg-blue-500 text-white rounded"
//                     onClick={() => handleEditClick(review)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="px-2 py-1 bg-red-500 text-white rounded"
//                     onClick={() => handleDelete(review.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* 5) Simple Modal for Editing Status */}
//       {isModalOpen && selectedReview && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">
//               Edit Review #{selectedReview.id}
//             </h2>
//             <p className="mb-2"><strong>Title:</strong> {selectedReview.title}</p>
//             <p className="mb-4"><strong>Current Status:</strong> {selectedReview.status}</p>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border rounded"
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedReview(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//                 onClick={handleSaveStatus}
//               >
//                 Approve (0→1)
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingReviewsPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const STATUS_LABELS = {
//   0: 'Pending',
//   1: 'Approved',
//   2: 'Rejected',
// };

// const PendingReviewsPage = () => {
//   const token = useSelector((state) => state.auth.token);
//   const [pendingReviews, setPendingReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [newStatus, setNewStatus] = useState(0);

//   // Fetch pending reviews
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       try {
//         const res = await fetch(
//           'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error(await res.text());
//         setPendingReviews(await res.json());
//       } catch (err) {
//         console.error(err);
//       }
//     })();
//   }, [token]);

//   // Edit 클릭: 모달 열기 + 상태 초기화
//   const handleEditClick = (review) => {
//     setSelectedReview(review);
//     setNewStatus(review.status);
//     setIsModalOpen(true);
//   };

//   // Delete 클릭
//   const handleDelete = async (id) => {
//     if (!confirm('আপনি কি সত্যিই মুছে ফেলতে চান?')) return;
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/admin/reviews/${id}/`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       setPendingReviews((prev) => prev.filter((r) => r.id !== id));
//     } catch (err) {
//       console.error('Failed to delete review:', err);
//     }
//   };

//   // Done 클릭: PATCH newStatus
//   const handleSaveStatus = async () => {
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/admin/reviews/${selectedReview.id}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       const updated = await res.json();
//       setPendingReviews((prev) =>
//         prev.map((r) => (r.id === updated.id ? updated : r))
//       );
//       setIsModalOpen(false);
//       setSelectedReview(null);
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>

//       {pendingReviews.length === 0 ? (
//         <p className="text-gray-600">কোনো pending review পাওয়া যায়নি।</p>
//       ) : (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Title</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingReviews.map((review) => (
//               <tr key={review.id}>
//                 <td className="px-4 py-2 border">{review.id}</td>
//                 <td className="px-4 py-2 border">{review.title}</td>
//                 <td className="px-4 py-2 border">
//                   {STATUS_LABELS[review.status]}
//                 </td>
//                 <td className="px-4 py-2 border space-x-2">
//                   <button
//                     className="px-2 py-1 bg-blue-500 text-white rounded"
//                     onClick={() => handleEditClick(review)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="px-2 py-1 bg-red-500 text-white rounded"
//                     onClick={() => handleDelete(review.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Modal */}
//       {isModalOpen && selectedReview && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">
//               Edit Review #{selectedReview.id}
//             </h2>
//             <p className="mb-2">
//               <strong>Title:</strong> {selectedReview.title}
//             </p>
//             <label className="block mb-4">
//               <span className="block font-medium">Status পরিবর্তন করুন:</span>
//               <select
//                 className="mt-1 block w-full border rounded px-2 py-1"
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(Number(e.target.value))}
//               >
//                 {Object.entries(STATUS_LABELS).map(([code, label]) => (
//                   <option key={code} value={code}>
//                     {label}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border rounded"
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedReview(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//                 onClick={handleSaveStatus}
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingReviewsPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const STATUS_OPTIONS = [
//   { value: 0, label: 'Pending' },
//   { value: 1, label: 'Approved' },
// ];

// const PendingReviewsPage = () => {
//   const token = useSelector((state) => state.auth.token);
//   const [reviews, setReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [newStatus, setNewStatus] = useState(0);

//   // 1) ফেচ করা
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       const res = await fetch(
//         'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       if (!res.ok) {
//         console.error(await res.text());
//         return;
//       }
//       setReviews(await res.json());
//     })();
//   }, [token]);

//   // 2) Edit ক্লিক: মডাল খুলে current status ধরে রাখা
//   const openEditModal = (review) => {
//     setSelectedReview(review);
//     setNewStatus(review.status);   // এখানে API থেকে পাওয়া current status
//     setIsModalOpen(true);
//   };

//   // 3) Done ক্লিক: PATCH পাঠানো
//   const saveStatus = async () => {
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/admin/reviews/${selectedReview.id}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       const updated = await res.json();
//       setReviews((prev) =>
//         prev.map((r) => (r.id === updated.id ? updated : r))
//       );
//       closeModal();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedReview(null);
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>
//       {reviews.length === 0 ? (
//         <p className="text-gray-600">কোনো pending review পাওয়া যায়নি।</p>
//       ) : (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Title</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reviews.map((rev) => (
//               <tr key={rev.id}>
//                 <td className="px-4 py-2 border">{rev.id}</td>
//                 <td className="px-4 py-2 border">{rev.title}</td>
//                 <td className="px-4 py-2 border">{rev.status}</td>
//                 <td className="px-4 py-2 border space-x-2">
//                   <button
//                     className="px-2 py-1 bg-blue-600 text-white rounded"
//                     onClick={() => openEditModal(rev)}
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Modal */}
//       {isModalOpen && selectedReview && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">
//               Edit Review #{selectedReview.id}
//             </h2>
//             <p className="mb-2">
//               <strong>Title:</strong> {selectedReview.title}
//             </p>

//             <label className="block mb-4">
//               <span className="font-medium">Status:</span>
//               <select
//                 className="mt-1 block w-full border rounded px-2 py-1"
//                 value={newStatus}   // এখানে current status সিলেক্টেড
//                 onChange={(e) => setNewStatus(Number(e.target.value))}
//               >
//                 {STATUS_OPTIONS.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.value} — {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <div className="flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 border rounded"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//                 onClick={saveStatus}
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingReviewsPage;


'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // 👈 এখানে ইমপোর্ট

const STATUS_OPTIONS = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Approved' },
];

const PendingReviewsPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newStatus, setNewStatus] = useState(0);

  // Fetch pending reviews
  useEffect(() => {
    if (!token) return;
    (async () => {
      const res = await fetch(
        'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!res.ok) {
        console.error(await res.text());
        return;
      }
      setReviews(await res.json());
    })();
  }, [token]);

  console.log("revews",reviews);
  

  // Open edit modal
  const openEditModal = (review) => {
    setSelectedReview(review);
    setNewStatus(review.status);
    setIsModalOpen(true);
  };

  // Delete handler
  // const handleDelete = async (id) => {
  //   if (!confirm('আপনি কি সত্যিই ডিলিট করতে চান?')) return;
  //   try {
  //     const res = await fetch(
  //       `https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/${id}/`,
  //       {
  //         method: 'DELETE',
  //         headers: { Authorization: `Token ${token}` },
  //       }
  //     );
  //     if (!res.ok) throw new Error(await res.text());
  //     setReviews((prev) => prev.filter((r) => r.id !== id));
  //   } catch (err) {
  //     console.error('Failed to delete:', err);
  //   }
  // };

  const handleDelete = async (id) => {
  // ১) কনফার্ম ডায়ালগ
  const shouldDelete = window.confirm('আপনি কি সত্যিই ডিলিট করতে চান?');
  if (!shouldDelete) return;

  // ২) API কল
  try {
    const res = await fetch(
      `https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/${id}/`,
      {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      }
    );
    if (!res.ok) throw new Error(await res.text());
    setReviews((prev) => prev.filter((r) => r.id !== id));
  } catch (err) {
    console.error('Failed to delete:', err);
    alert('ডিলিট করতে গিয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  }
};


  // Save updated status
  const saveStatus = async () => {
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/${selectedReview.id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      console.log("updated",updated);
      
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setIsModalOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600">কোনো pending review পাওয়া যায়নি।</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev.id}>
                <td className="px-4 py-2 border">{rev.id}</td>
                <td className="px-4 py-2 border">{rev.title}</td>
                <td className="px-4 py-2 border">{rev.status}</td>
                <td className="px-4 py-2 border flex space-x-2">
                  {/* Edit Icon Button */}
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1 hover:bg-blue-100 rounded"
                    aria-label="Edit review"
                  >
                    <FiEdit size={20} className="text-blue-600" />
                  </button>
                  {/* Delete Icon Button */}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1 hover:bg-red-100 rounded"
                    aria-label="Delete review"
                  >
                    <FiTrash2 size={20} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal (same as আগে) */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Edit Review #{selectedReview.id}
            </h2>
            <p className="mb-2">
              <strong>Title:</strong> {selectedReview.title}
            </p>
            <label className="block mb-4">
              <span className="font-medium">Status:</span>
              <select
                className="mt-1 block w-full border rounded px-2 py-1"
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value))}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value} — {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReview(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={saveStatus}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReviewsPage;




