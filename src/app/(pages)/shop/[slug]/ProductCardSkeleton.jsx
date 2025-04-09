'use client';

import React from 'react';

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col justify-between h-[370px] font-sans animate-pulse">
            {/* Image Section */}
            <div className="relative w-full h-[230px] bg-gray-300">
                {/* For the favorite and sales icons, we add placeholder circles */}
                <div className="absolute top-2 right-2 bg-gray-300 rounded-full w-10 h-10" />
                <div className="absolute bottom-2 left-2 bg-gray-300 rounded-full w-16 h-6" />
            </div>

            {/* Product Details */}
            <div className="px-4 py-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>

            {/* Price & Cart Section */}
            <div className="border-t px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/3" />
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                </div>
            </div>
        </div>
    );
}
