"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Home, Package, ShoppingCart } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ✨ Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity duration-300 md:hidden",
          isOpen ? "block" : "hidden",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-full w-64 border-r shadow-lg transition-transform duration-300 bg-white dark:bg-[#111827]",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "md:translate-x-0": true,
          },
        )}
      >
        {/* Logo or header */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
            Upfrica.com
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Package className="w-5 h-5" />
            Products
          </Link>

          <Link
            href="/orders"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
        </nav>
      </aside>
    </>
  );
}
