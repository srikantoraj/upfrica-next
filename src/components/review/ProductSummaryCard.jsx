"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ LightboxModal: Simple image preview
function LightboxModal({ imageUrl, onClose }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Zoomed product image"
          className="max-h-[90vh] max-w-full object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ✅ Optional: Star rating component
function StarRating({ rating, total }) {
  return (
    <p className="text-sm text-yellow-500 mt-1">
      {"⭐".repeat(Math.floor(rating))}{" "}
      <span className="text-gray-500">
        ({total} review{total !== 1 ? "s" : ""})
      </span>
    </p>
  );
}

// ✅ Main Card Component
export default function ProductSummaryCard({
  title,
  image,
  price,
  condition,
  region,
  town,
  buyUrl,
  showBuyButton = true,
  showRating = false,
  rating = null,
  totalReviews = null,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageSrc = (() => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    if (image.startsWith("/media")) return image;
    return `https://d3q0odwafjkyv1.cloudfront.net/${image}`;
  })();

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* ✅ Image Preview */}
        <div
          className="w-full md:w-32 h-32 overflow-hidden rounded-md cursor-zoom-in bg-gray-100"
          onClick={() => imageSrc && setLightboxOpen(true)}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title || "Product image"}
              width={120}
              height={120}
              className="rounded-md object-cover w-[120px] h-[120px]"
            />
          ) : (
            <div className="w-[120px] h-[120px] flex items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div className="flex-1">
          {/*<h2 className="text-lg font-semibold leading-snug mb-1">{title}</h2>*/}

          {condition && (
            <span className="inline-block text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded mb-1">
              {condition}
            </span>
          )}

          {town && (
            <p className="text-sm text-gray-600 mt-1">📍 {town}</p>
          )}

          {showRating && rating && (
            <StarRating rating={rating} total={totalReviews} />
          )}

          {price && (
            <p className="text-xl font-bold text-black mt-2">₵{price}</p>
          )}

          {showBuyButton && buyUrl && (
            <Link
              href={buyUrl}
              className="inline-block mt-3 btn-primary text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              🛒 Buy Now
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Lightbox */}
      {lightboxOpen && (
        <LightboxModal
          imageUrl={imageSrc}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}