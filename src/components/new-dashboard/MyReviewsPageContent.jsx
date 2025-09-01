// src/components/new-dashboard/MyReviewsPageContent.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import toast from 'react-hot-toast';
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

export default function MyReviewsPageContent() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", comment: "", rating: 5, tags: [], seller_comment: "" });
  const [tagGroups, setTagGroups] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState([]);
  const [expandedTagsReviewId, setExpandedTagsReviewId] = useState(null);

  // ✅ Move the filter/sort logic here
  const [sortBy, setSortBy] = useState("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return new Date(a.created_at) - new Date(b.created_at);
      case "date_desc":
        return new Date(b.created_at) - new Date(a.created_at);
      case "rating_asc":
        return a.rating - b.rating;
      case "rating_desc":
        return b.rating - a.rating;
      case "product_asc":
        return a.product_title.localeCompare(b.product_title);
      case "product_desc":
        return b.product_title.localeCompare(a.product_title);
      default:
        return 0;
    }
  });



  useEffect(() => {
    if (!token) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/reviews/my-reviews/?page=${page}&page_size=10`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setReviews(data.results || []);
        setCount(data.count || 0);
      } catch (err) {
        console.error("❌ Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token, page]);

  useEffect(() => {
    if (!editingReview || !token) return;
    const fetchTags = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/review-tags/grouped/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.results)) {
          setTagGroups(data.results);
          setAllTags(data.results.flatMap(group => group.tags));
        }
      } catch (err) {
        console.error('❌ Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, [editingReview, token]);

  function startEditReview(review) {
    setEditingReview(review);
    setEditForm({
      title: review.title,
      comment: review.comment,
      rating: review.rating,
      seller_comment: review.seller_comment || "",
      tags: review.tags.map((t) => t.label),
    });
  }

  async function submitEdit() {
    if (!editingReview) return;
    try {
      const res = await fetch(`${BASE_API_URL}/api/reviews/${editingReview.id}/edit/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("✅ Review updated! Pending moderation.");
        setEditingReview(null);
        setPage(1);
      } else {
        const errorData = await res.json();
        console.error(errorData);
        toast.error("❌ Failed to update review.");
      }
    } catch (e) {
      console.error(e);
      toast.error("❌ Something went wrong.");
    }
  }

  const totalPages = Math.ceil(count / 10);

const availableTags = Array.from(
  new Set(
    reviews.flatMap((review) => review.tags?.map((t) => t.label) || [])
  )
);

const filteredReviews = sortedReviews.filter((review) => {
  const query = searchQuery.toLowerCase();
  const matchesQuery =
    review.product_title?.toLowerCase().includes(query) ||
    review.comment?.toLowerCase().includes(query);

  const matchesTags =
    activeTags.length === 0 ||
    (review.tags || []).some((tag) => activeTags.includes(tag.label));

  return matchesQuery && matchesTags;
});


return (
  <div className="p-0">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-600 dark:text-gray-300" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reviews by product name or comment..."
          className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand"
        />
        {searchQuery && (
          <AiOutlineClose
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-gray-300 cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="w-full md:w-auto">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="rating_asc">Lowest Rated</option>
          <option value="product_asc">Product A–Z</option>
          <option value="product_desc">Product Z–A</option>
        </select>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-2 py-1 text-xs rounded-full border ${
            activeTags.includes(tag)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>

    <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Reviews</h1>

    {loading ? (
      <p className="text-sm text-gray-500 dark:text-gray-300">Loading reviews...</p>
    ) : reviews.length === 0 ? (
      <p className="text-sm text-gray-500 dark:text-gray-300">No reviews found.</p>
    ) : (
      <>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>

        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hadow-upfrica mb-6 p-4"
          >
            <div className="flex gap-4 items-start">
              {review.product_image && (
                <Image
                  src={review.product_image}
                  alt={review.product_title || "Product"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              )}
              <div className="flex-1">
              
                <Link
                  href={review.product_frontend_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-white font-medium hover:underline line-clamp-2 leading-snug text-base"
                >
                  {review.product_title || "Untitled Product"}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  🕓 Reviewed on{" "}
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                  <p className={`${expandedReviewId === review.id ? "" : "line-clamp-3"} overflow-hidden`}>
                    {review.comment}
                  </p>
                  {review.comment.length > 100 && (
                    <button
                      onClick={() =>
                        setExpandedReviewId(
                          expandedReviewId === review.id ? null : review.id
                        )
                      }
                      className="text-xs text-blue-500 hover:underline mt-1"
                    >
                      {expandedReviewId === review.id ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ⭐ {review.rating} — <span className="italic">{review.status_label}</span>
                </p>

                {review.tags?.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {(expandedTagsReviewId === review.id
                        ? review.tags
                        : review.tags.slice(0, 5)
                      ).map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mt-1 mb-1"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    {review.tags.length > 5 && (
                      <button
                        onClick={() =>
                          setExpandedTagsReviewId(
                            expandedTagsReviewId === review.id ? null : review.id
                          )
                        }
                        className="text-xs text-blue-500 mt-1 hover:underline cursor-pointer"
                      >
                        {expandedTagsReviewId === review.id
                          ? "Show less tags"
                          : `+${review.tags.length - 5} more`}
                      </button>
                    )}
                  </div>
                )}

                {review.media?.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-3">
                    {review.media.map((m, idx) => {
                      const mediaUrl = m.url?.startsWith("http")
                        ? m.url
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${m.url}`;
                      return (
                        <button
                          key={m.id || m.filename}
                          onClick={() => {
                            setLightboxMedia(review.media);
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                          className="focus:outline-none"
                        >
                          <div className="relative w-24 h-24">
                            {m.media_type === "image" ? (
                              <img
                                src={mediaUrl}
                                alt={m.filename || "Review media"}
                                className="w-full h-full object-cover rounded-md border hover:scale-105 transition"
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video
                                  src={mediaUrl}
                                  className="w-full h-full object-cover rounded-md border"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white text-xl bg-black/50 rounded-full px-2">
                                    ▶
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {review.can_edit && (
                  <div className="mt-3">
                    <button
                      onClick={() => startEditReview(review)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      ✏️ Edit Review
                    </button>
                    {review.edit_deadline && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ⏰ Editable until{" "}
                        {new Date(review.edit_deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  i + 1 === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </>
    )}

    {/* Lightbox */}
    {lightboxOpen && lightboxMedia.length > 0 && (
      <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
        <div className="relative max-w-[90vw] max-h-[90vh] w-full flex flex-col items-center justify-center px-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full z-20"
          >
            ✖
          </button>
          {lightboxMedia[lightboxIndex]?.media_type === "image" ? (
            <img
              src={
                lightboxMedia[lightboxIndex].url?.startsWith("http")
                  ? lightboxMedia[lightboxIndex].url
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${lightboxMedia[lightboxIndex].url}`
              }
              alt="Preview"
              className="max-h-[80vh] max-w-full rounded shadow-lg"
            />
          ) : (
            <video
              src={
                lightboxMedia[lightboxIndex].url?.startsWith("http")
                  ? lightboxMedia[lightboxIndex].url
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${lightboxMedia[lightboxIndex].url}`
              }
              controls
              className="max-h-[80vh] max-w-full rounded shadow-lg"
            />
          )}
          {lightboxMedia.length > 1 && (
            <>
              <button
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + lightboxMedia.length) % lightboxMedia.length)
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white text-black shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % lightboxMedia.length)
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white text-black shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    )}
  </div>
); 
}