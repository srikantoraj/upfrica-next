// components/HeroSectionSkeleton.jsx
"use client";

import React from "react";

export default function HeroSectionSkeleton() {
  return (
    <div className="relative animate-pulse w-[500px] ">
      {/* banner placeholder */}
      <div className="h-[300px]  bg-gray-200" />

      {/* overlay card placeholder */}
      <div className="absolute bottom-0 left-10 bg-white backdrop-blur p-6 rounded-tl-lg rounded-tr-lg w-[calc(100%-2.5rem)] max-w-lg">
        {/* shop name */}
        <div className="h-8 bg-gray-200 rounded w-8 mb-4" />

        {/* verified badge + location */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* edit button placeholder */}
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
