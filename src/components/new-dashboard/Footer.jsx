"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-12 xl:px-40 py-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Upfrica. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs md:text-sm">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/help" className="hover:underline">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
