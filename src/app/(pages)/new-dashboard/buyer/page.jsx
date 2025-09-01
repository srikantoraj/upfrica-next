// src/app/(pages)/new-dashboard/buyer/page.jsx
"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import BuyerDashboardHome from "@/components/new-dashboard/BuyerDashboardHome";

export default function BuyerDashboardPage() {
  return (
    <RoleGuard allowed={["buyer"]}>
      <BuyerDashboardHome />
    </RoleGuard>
  );
}
