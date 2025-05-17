


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

  console.log("reviews",reviews);
  

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
  const shouldDelete = window.confirm('You are about to delete this review. Are you sure?');
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
    alert('Something went wrong while deleting the review. Please try again.');
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




