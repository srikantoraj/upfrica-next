//src/app/(pages)/new-dasboard/products/page.jsx

"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import ProductSummaryPills from "@/components/new-dashboard/products/ProductSummaryPills";
import ProductListResponsive from "@/components/new-dashboard/products/ProductListResponsive";

export default function ProductsPage() {
  return (
    <RoleGuard allowed={["seller"]} requirePlan>
      <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductSummaryPills />
        <ProductListResponsive />
      </div>
    </RoleGuard>
  );
}