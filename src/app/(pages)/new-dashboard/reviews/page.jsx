// src/app/(pages)/new-dashboard/reviews/page.jsx
"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import MyReviewsPageContent from "@/components/new-dashboard/MyReviewsPageContent";

export default function BuyerReviewsPage() {
  return (
    <RoleGuard allowed={["buyer"]}>
      <MyReviewsPageContent />
    </RoleGuard>
  );
}