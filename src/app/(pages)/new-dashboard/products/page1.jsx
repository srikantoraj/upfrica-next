//src/app/(pages)/new-dasboard/products/page.jsx

"use client";
import React from "react";
import ProductSummaryPills from "@/components/new-dashboard/products/ProductSummaryPills"; // overview cards
import ProductListTable from "@/components/new-dashboard/products/ProductListTable"; // product table

export default function ProductDashboard() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductSummaryPills />
      <ProductListTable />
    </div>
  );
}
