// src/components/new-dashboard/SellerReviewsPageContent.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function SellerReviewsCard() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchSellerReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/seller-product-reviews/?limit=5`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setReviews(data.results || []);
      } catch (error) {
        console.error("Failed to fetch seller reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerReviews();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold dark:text-gray-400 mb-3">Recent Customer Reviews</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold dark:text-gray-400">Recent Customer Reviews</h2>
        <Link href="/dashboard/reviews" className="text-sm text-blue-600 hover:underline">View All</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">Comment</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="py-3 pr-4 font-medium">{review.product_title}</td>
                <td className="py-3 pr-4">{"⭐".repeat(review.rating)}</td>
                <td className="py-3 pr-4 italic text-gray-500 dark:text-gray-400">
                  “{review.comment.slice(0, 60)}{review.comment.length > 60 ? "…" : ""}”
                </td>
                <td className="py-3 pr-4">
                  {review.status_label === "Approved" ? (
                    <span className="text-green-600 font-semibold">✅ Approved</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">❗ {review.status_label}</span>
                  )}
                </td>
                <td className="py-3">{new Date(review.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}