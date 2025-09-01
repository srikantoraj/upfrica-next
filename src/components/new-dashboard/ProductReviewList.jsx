"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_API_URL } from '@/app/constants';
import { getCleanToken } from '@/lib/getCleanToken';
import { useAuth } from "@/contexts/AuthContext";
import SellerProductReviewCard from "./SellerProductReviewCard";

export default function ProductReviewList() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (!token) return;

    const cleanToken = getCleanToken();

const fetchReviews = async () => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/reviews/my-product-reviews/`, {
      headers: {
        Authorization: `Token ${cleanToken}`,
      },
    });

    const data = await res.json();
    console.log("Fetched reviews:", data);

    const reviewsArray = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
      ? data.results
      : [];

    setReviews(reviewsArray);
    setFiltered(reviewsArray);
  } catch (err) {
    console.error("Failed to fetch product reviews:", err);
    setReviews([]);
    setFiltered([]);
  } finally {
    setLoading(false);
  }
};

    fetchReviews();
  }, [token]);

  useEffect(() => {
    let updated = [...reviews];

    if (search) {
      const q = search.toLowerCase();
      updated = updated.filter(
        (r) =>
          r.product?.title?.toLowerCase().includes(q) ||
          r.text?.toLowerCase().includes(q)
      );
    }

    if (sort === "newest") {
      updated.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sort === "oldest") {
      updated.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    setFiltered(updated);
  }, [search, sort, reviews]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading product reviews...</div>;
  }

  return (
    <div>
      {/* Search & Sort Controls */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="🔍 Search product reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {Array.isArray(filtered) && filtered.length === 0 ? (
          <div className="text-sm text-gray-500">No product reviews found.</div>
        ) : (
          Array.isArray(filtered) &&
          filtered.map((review) => (
            <SellerProductReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}