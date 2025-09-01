// src/components/new-dashboard/products/ProductListResponsive.jsx
"use client";

import { useEffect, useState } from "react";
import ProductListTable from "./ProductListTable";
import ProductListCards from "./ProductListCards";

export default function ProductListResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [manualOverride, setManualOverride] = useState(null); // null, 'table', or 'card'

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showTableView = manualOverride ? manualOverride === "table" : !isMobile;

  const toggleView = () => {
    setManualOverride((prev) => (prev === "table" ? "card" : "table"));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={toggleView}
          className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded"
        >
          {showTableView ? "🔁 Switch to Card View" : "🔁 Switch to Table View"}
        </button>
      </div>
      {showTableView ? <ProductListTable /> : <ProductListCards />}
    </div>
  );
}
