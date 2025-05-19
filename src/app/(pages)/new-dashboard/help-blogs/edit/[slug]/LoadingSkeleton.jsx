"use client";

import React from "react";

const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 container mx-auto p-20">
            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-6"></div>

                <div className="space-y-6">
                    {/* Title Field Skeleton */}
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>

                    {/* Summary Field Skeleton */}
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-20 bg-gray-300 rounded"></div>
                    </div>

                    {/* Tags Field Skeleton */}
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="flex space-x-2">
                            <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                        </div>
                    </div>

                    {/* Sections Skeleton */}
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="border border-gray-300 rounded-md p-4 bg-gray-100 mb-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-5 bg-gray-300 rounded w-8"></div>
                                </div>
                                <div className="mb-2">
                                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button Skeleton */}
                    <div className="flex justify-center">
                        <div className="h-12 w-40 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
