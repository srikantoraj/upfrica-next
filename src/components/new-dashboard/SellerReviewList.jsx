"use client";

import React, { useEffect, useState } from "react";
import { BASE_API_URL } from '@/app/constants';
import { getCleanToken } from '@/lib/getCleanToken';
import SellerReviewCard from "./SellerReviewCard";

export default function SellerReviewList() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
useEffect(() => {
  const fetchReviews = async () => {
    const token = getCleanToken();
    try {
      const res = await fetch(`${BASE_API_URL}/api/reviews/my-seller-reviews/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await res.json();
      console.log("Seller reviews:", data);

      if (Array.isArray(data.results)) {
        setReviews(data.results);
        setFiltered(data.results);
      } else {
        console.warn("Unexpected response structure", data);
        setReviews([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error("Failed to fetch seller reviews:", err);
      setReviews([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  fetchReviews();
}, []);


  useEffect(() => {
    let updated = [...reviews];

    if (query) {
      const q = query.toLowerCase();
      updated = updated.filter((r) =>
        r.text?.toLowerCase().includes(q)
      );
    }

    updated.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFiltered(updated);
  }, [query, sortOrder, reviews]);

  return (
    <div className="space-y-4">
      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Search seller reviews..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Review List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading seller reviews...</p>
      ) : Array.isArray(filtered) && filtered.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No seller reviews found.</p>
      ) : (
        filtered.map((review) => (
          <SellerReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
}