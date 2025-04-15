'use client';
import React from 'react';

export default function ProductCardSkeleton() {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm border-b border-gray-200 animate-pulse">
            {/* Image Placeholder */}
            <div className="mx-auto h-36 w-36 rounded bg-gray-300" />

            {/* Title Placeholder */}
            <div className="mt-4 h-4 bg-gray-300 rounded w-3/4 mx-auto" />

            {/* Price Placeholder */}
            <div className="mt-1 h-4 bg-gray-300 rounded w-1/3 mx-auto" />
        </div>
    );
}
