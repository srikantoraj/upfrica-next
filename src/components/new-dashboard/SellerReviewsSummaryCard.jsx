// src/components/new-dashboard/SellerReviewsSummaryCard.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SellerReviewsSummaryCard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("product");
  const [productReviews, setProductReviews] = useState([]);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [summary, setSummary] = useState({ avg: 0, count: 0, breakdown: {} });

  useEffect(() => {
    if (!token) return;

    const fetchProductReviews = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/my-product-reviews/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await res.json();
      setProductReviews(data.results || []);

      const ratings = data.results?.map(r => r.rating) || [];
      const count = ratings.length;
      const avg = count ? (ratings.reduce((a, b) => a + b, 0) / count) : 0;

      const breakdown = [5, 4, 3, 2, 1].reduce((acc, star) => {
        const percent = Math.round((ratings.filter(r => r === star).length / count) * 100);
        acc[star] = percent || 0;
        return acc;
      }, {});

      setSummary({ avg: avg.toFixed(1), count, breakdown });
    };

    const fetchSellerReviews = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/my-seller-reviews/`, {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await res.json();
      setSellerReviews(data.results || []);
    };

    fetchProductReviews();
    fetchSellerReviews();
  }, [token]);

  const displayedReviews = activeTab === "product" ? productReviews : sellerReviews;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Recent Customer Reviews
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("product")}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              activeTab === "product"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
            }`}
          >
            Product
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              activeTab === "seller"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
            }`}
          >
            Seller
          </button>
        </div>
      </div>

      {/* Summary Breakdown */}
      {activeTab === "product" && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          ⭐ <strong>{summary.avg}</strong> from <strong>{summary.count}</strong> reviews
          <div className="mt-2 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center text-xs gap-2">
                <span className="w-6">{star}★</span>
                <div className="flex-1 h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${summary.breakdown[star] || 0}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right">{summary.breakdown[star] || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Table */}
      <div className="overflow-x-auto max-h-[280px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2 pr-4">{activeTab === "product" ? "Product" : "Rating"}</th>
              <th className="py-2 pr-4">Comment</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {displayedReviews.slice(0, 5).map((r) => (
              <tr key={r.id}>
                <td className="py-3 pr-4 font-medium truncate max-w-[160px]">
                  {activeTab === "product" ? r.product_title : `⭐ ${r.rating}`}
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 italic truncate max-w-xs">
                  {r.comment?.slice(0, 100) ?? "No comment"}
                </td>
                <td className="py-3 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All */}
      <div className="text-right mt-3">
        <a
          href="/new-dashboard/seller/reviews"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All →
        </a>
      </div>
    </div>
  );
}