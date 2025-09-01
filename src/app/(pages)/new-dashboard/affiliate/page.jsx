// src/app/(pages)/new-dashboard/affiliate/page.jsx
"use client";

import { useEffect } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import AffiliateDashboardHome from "@/components/new-dashboard/AffiliateDashboardHome";
import { useRoleView } from "@/contexts/RoleViewContext";

export default function AffiliateDashboardPage() {
  const { setRoleView } = useRoleView();

  useEffect(() => {
    setRoleView("affiliate");
  }, []);

  return (
    <RoleGuard allowed={["affiliate"]}>
      <AffiliateDashboardHome />
    </RoleGuard>
  );
}
