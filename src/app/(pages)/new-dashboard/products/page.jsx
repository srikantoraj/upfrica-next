"use client";

import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import ProductsHeader from "@/components/new-dashboard/products/ProductsHeader";
import ProductSummaryPills from "@/components/new-dashboard/products/ProductSummaryPills";
import ProductListResponsive from "@/components/new-dashboard/products/ProductListResponsive";

export default function ProductsPage() {
  const [pillKey, setPillKey] = useState(null); // "approved" | "draft" | "out_of_stock" | "low_stock" | "needs_attention" | null

  return (
    <RoleGuard allowed={["seller"]} requirePlan>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductsHeader />
        <ProductSummaryPills onSelect={setPillKey} activeKey={pillKey} />
        <ProductListResponsive summaryKey={pillKey} />
      </div>
    </RoleGuard>
  );
}