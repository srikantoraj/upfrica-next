//components/review/ProductReviewModal.jsx
'use client';

import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import ReviewListInfinite from './ReviewListInfinite';

export default function ProductReviewModal({ product, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 overflow-y-auto">
  <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg mx-4 sm:mx-6">
    {/* Modal Header */}
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">
        All Reviews for {product.title}
      </h2>
      <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
        &times;
      </button>
    </div>

    {/* Infinite ReviewList */}
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <ReviewListInfinite productId={product.id} isOpen={isOpen} />
    </div>
  </div>
</div>
  );
}
