"use client";

import React from "react";
import Link from "next/link";

export default function Breadcrumbs({ path = [], title, base = "/categories" }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 mb-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500 scrollbar-hide"
    >
      {/* Home link */}
      <Link href="/" className="text-blue-600 hover:underline">
        Upfrica
      </Link>

      {/* Category chain */}
      {path.map((c) => (
        <span key={c.id} className="flex items-center gap-2">
          <span className="text-gray-300">›</span>
          <Link
            href={`${base}/${c.path}`}
            className="text-blue-600 hover:underline"
          >
            {c.name}
          </Link>
        </span>
      ))}

      {/* Current page */}
      <span className="text-gray-300">›</span>
      <span className="font-semibold text-gray-700 truncate max-w-[50vw]">
        {title}
      </span>
    </nav>
  );
}