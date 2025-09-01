// src/components/new-dashboard/SellerProductReviewCard.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaStar, FaEdit, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { format, differenceInHours } from "date-fns";

export default function SellerProductReviewCard({ review }) {
  const {
    product = {},
    rating,
    text,
    comment,
    status,
    status_label,
    created_at,
    tags = [],
    media = [],
    editable_until,
    edit_deadline,
    is_editable,
    can_edit,
  } = review;

  const normalizedText = text || comment || "";
  const normalizedStatus =
    typeof status !== "undefined"
      ? status
      : status_label === "Approved"
      ? 1
      : status_label === "Pending"
      ? 0
      : -1;

  const editable = typeof is_editable !== "undefined" ? is_editable : can_edit;
  const editUntil = editable_until || edit_deadline;

  const [showAllTags, setShowAllTags] = useState(false);
  const displayTags = showAllTags ? tags : tags.slice(0, 5);
  const remainingTags = tags.length - displayTags.length;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, "dd MMM yyyy");
  };

  const getStatusLabel = () => {
    if (normalizedStatus === 1) return "✅ Approved";
    if (normalizedStatus === 0) return "⏳ Pending";
    return "❌ Rejected";
  };

  const isExpiringSoon = editUntil
    ? differenceInHours(new Date(editUntil), new Date()) <= 24
    : false;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const next = () => setActiveIndex((prev) => (prev + 1) % media.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + media.length) % media.length);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hadow-upfrica mb-6 p-4">

<Link
  href={review.product_frontend_url || "#"}
  target="_blank"
  rel="noopener noreferrer"
  className="text-gray-900 dark:text-white font-medium hover:underline line-clamp-2 leading-snug text-base"
>
  {review.product_title || review.product?.title || "Untitled Product"}
</Link>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        🕒 Reviewed on {formatDate(created_at)}
      </p>

      <div className="flex items-center mt-2 mb-1 space-x-2">
        <div className="flex items-center space-x-1 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-500" : "text-gray-400"}
            />
          ))}
          <span className="text-sm ml-2 text-white dark:text-gray-300">{rating}</span>
        </div>
        <span className="text-xs italic text-gray-500 dark:text-gray-400">
          — {getStatusLabel()}
        </span>
      </div>

      {normalizedText && (
        <p className="text-sm text-gray-800 dark:text-white mt-2">{normalizedText}</p>
      )}

      {tags?.length > 0 && (
        <div className="flex flex-wrap mt-3 gap-2">
          {displayTags.map((tag) => (
            <span
              key={tag.id || tag.label}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full"
            >
              ✅ {tag.label}
            </span>
          ))}
          {remainingTags > 0 && (
            <button
              onClick={() => setShowAllTags(true)}
              className="text-xs text-blue-400"
            >
              +{remainingTags} more
            </button>
          )}
        </div>
      )}

      {media?.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {media.map((item, idx) => {
            const mediaUrl = item.url?.startsWith("http")
              ? item.url
              : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${item.url}`;
            return item.media_type === "video" ? (
              <video
                key={idx}
                src={mediaUrl}
                controls
                onClick={() => openLightbox(idx)}
                className="w-24 h-24 rounded object-cover cursor-pointer"
              />
            ) : (
              <img
                key={idx}
                src={mediaUrl}
                alt={`review-media-${idx}`}
                className="w-24 h-24 object-cover rounded cursor-pointer"
                onClick={() => openLightbox(idx)}
              />
            );
          })}
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-2xl">
            <FaTimes />
          </button>

<button
  onClick={prev}
  className="absolute left-2 sm:left-4 text-white text-3xl px-3 py-2 bg-black/30 sm:bg-transparent sm:hover:bg-black/40 rounded-full z-50"
>
  <FaChevronLeft />
</button>

          <div className="max-w-[90%] max-h-[80%]">
            {media[activeIndex].media_type === "video" ? (
              <video
                src={
                  media[activeIndex].url?.startsWith("http")
                    ? media[activeIndex].url
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${media[activeIndex].url}`
                }
                controls
                autoPlay
                className="max-h-[80vh] rounded"
              />
            ) : (
              <img
                src={
                  media[activeIndex].url?.startsWith("http")
                    ? media[activeIndex].url
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${media[activeIndex].url}`
                }
                alt="preview"
                className="max-h-[80vh] rounded object-contain"
              />
            )}
          </div>

<button
  onClick={next}
  className="absolute right-2 sm:right-4 text-white text-3xl px-3 py-2 bg-black/30 sm:bg-transparent sm:hover:bg-black/40 rounded-full z-50"
>
  <FaChevronRight />
</button>
        </div>
      )}

      {editable && (
        <div className="mt-4 text-sm text-orange-400">
          <a
            href={`/write-review/${product?.slug || review.product_slug || product?.id}`}
            className="inline-flex items-center gap-1"
          >
            <FaEdit /> Edit Review
          </a>
          {editUntil && (
            <p
              className={`text-xs mt-1 ${
                isExpiringSoon ? "text-red-400" : "text-gray-400"
              }`}
            >
              🧭 Editable until {formatDate(editUntil)}
              {isExpiringSoon && " (expires soon!)"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}