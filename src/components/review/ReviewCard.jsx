"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  CheckCircle,
} from "lucide-react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import StarRating from "@/components/common/StarRating";

export default function ReviewCard({ review }) {
  const {
    rating,
    title,
    comment,
    created_at,
    reviewer_username,
    tags = [],
    media = [],
    helpful_count = 0,
    not_helpful_count = 0,
    seller_badges = [],
    show_reviewer_city,
    reviewer_city,
    is_verified_buyer,
  } = review;

  const formattedDate = created_at
    ? format(new Date(created_at), "dd/MM/yyyy")
    : null;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getMediaUrl = (item) =>
    item?.url?.startsWith("http")
      ? item.url
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${item.url}`;

  const openLightbox = (idx) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const next = () => setActiveIndex((prev) => (prev + 1) % media.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + media.length) % media.length);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") closeLightbox();
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, handleKeyDown]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          {formattedDate && (
            <span className="text-gray-500 text-sm">— {formattedDate}</span>
          )}
        </div>
      </div>

      {/* Title */}
      {title && <h3 className="font-semibold text-md mb-1">{title}</h3>}

      {/* Comment */}
      <p className="text-gray-700 text-sm mb-2">
        {comment || "No comment provided."}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag.id || tag.slug}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag.label || tag.name || tag.slug}
            </span>
          ))}
        </div>
      )}

      {/* Media Thumbnails */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {media.map((item, idx) => {
            const url = getMediaUrl(item);
            return item.media_type === "video" ? (
              <video
                key={idx}
                src={url}
                onClick={() => openLightbox(idx)}
                className="w-full h-[120px] rounded object-cover cursor-pointer"
                muted
                playsInline
              />
            ) : (
              <img
                key={idx}
                src={url}
                alt={`Review image ${idx + 1}`}
                onClick={() => openLightbox(idx)}
                className="w-full h-[120px] object-cover rounded cursor-pointer"
              />
            );
          })}
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxOpen && media.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close preview"
          >
            <FaTimes />
          </button>

          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 text-white text-3xl px-3 py-2 bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Previous media"
          >
            <FaChevronLeft />
          </button>

          <div className="max-w-[90%] max-h-[80%] text-center">
            <div className="mb-2 text-sm text-white">
              {activeIndex + 1} of {media.length}
            </div>
            {media[activeIndex].media_type === "video" ? (
              <video
                src={getMediaUrl(media[activeIndex])}
                controls
                autoPlay
                className="max-h-[80vh] rounded"
              />
            ) : (
              <img
                src={getMediaUrl(media[activeIndex])}
                alt="Preview"
                className="max-h-[80vh] rounded object-contain"
              />
            )}
          </div>

          <button
            onClick={next}
            className="absolute right-2 sm:right-4 text-white text-3xl px-3 py-2 bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Next media"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 hover:text-black">
            <ThumbsUp size={16} />
            Helpful ({helpful_count})
          </button>
          <button className="flex items-center gap-1 hover:text-black">
            <ThumbsDown size={16} />
            Not Helpful ({not_helpful_count})
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button className="flex items-center gap-1 hover:text-black">
            <Flag size={15} />
            Report
          </button>
          <button className="flex items-center gap-1 hover:text-black">
            <Share2 size={15} />
            Share
          </button>
        </div>
      </div>

      {/* Reviewer Info */}
      <div className="mt-3 text-xs text-gray-500">
        {reviewer_username && (
          <span>
            Review by{" "}
            <span className="text-black font-medium">{reviewer_username}</span>
            {is_verified_buyer && (
              <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle size={14} /> Verified Buyer
              </span>
            )}
            {show_reviewer_city && reviewer_city && (
              <span className="ml-1 italic text-gray-400">
                from {reviewer_city}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Seller Badges */}
      {seller_badges.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {seller_badges.map((badge, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}