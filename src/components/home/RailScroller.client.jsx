// components/home/RailScroller.client.jsx
"use client";

import React, { useRef } from "react";

export default function RailScroller({ children, className = "" }) {
  const ref = useRef(null);
  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * 600, behavior: "smooth" });
  };
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 shadow p-2 hidden md:inline-flex"
      >
        ‹
      </button>
      <div ref={ref} className="overflow-x-auto no-scrollbar">
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 shadow p-2 hidden md:inline-flex"
      >
        ›
      </button>
    </div>
  );
}