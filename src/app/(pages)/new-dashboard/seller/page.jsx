// src/app/(pages)/new-dashboard/seller/page.jsx
"use client";

import RequireRole from "@/components/new-dashboard/RequireRole";
import SellerDashboardHome from "@/components/new-dashboard/SellerDashboardHome";

export default function Page() {
  return (
    <RequireRole need="seller">
      <SellerDashboardHome />
    </RequireRole>
  );
}
