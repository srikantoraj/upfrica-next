// components/new-dashboard/RecentReviews.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_API_URL } from "@/app/constants";
import { Button } from "@/components/ui/button";

export default function RecentReviews({ token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/reviews/my-reviews/?page_size=2`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setReviews(data.results || []);
      } catch (err) {
        console.error("❌ Failed to load recent reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  if (!token || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
        <h2 className="text-sm font-bold mb-1">Recent Reviews</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold dark:text-white mb-1">Recent Reviews</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You haven’t left any reviews yet.
        </p>
        <Link
          href="/orders"
          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
        >
          Review a recent order →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white">Recent Reviews</h2>
        <Link href="/new-dashboard/reviews">
          <Button variant="link" className="text-xs text-blue-600 p-0 h-auto">View All</Button>
        </Link>
      </div>

      <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        {reviews.slice(0, 2).map((review) => (
          <li
            key={review.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0"
          >
            <Link
              href={review.product_frontend_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline block truncate text-sm"
              title={review.product_title}
            >
              {review.product_title || "Untitled Product"}
            </Link>

            {review.comment && (
              <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{review.comment}</p>
            )}

            <div className="flex items-center justify-between text-xs mt-1">
              <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <span>⭐ {review.rating}</span>
                {review.status_label && (
                  <span className={review.status_label === "Approved" ? "text-green-600" : "text-yellow-600"}>
                    {review.status_label}
                  </span>
                )}
              </span>
              <span className="italic text-gray-400 dark:text-gray-500">
                {new Date(review.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}