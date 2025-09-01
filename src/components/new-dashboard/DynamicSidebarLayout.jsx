// src/components/new-dashboard/DynamicSidebarLayout.jsx
"use client";

import React, { useMemo, useEffect } from "react";
import BuyerSidebar from "./BuyerSidebar";
import SellerSidebar from "./SellerSidebar";
import AgentSidebar from "./AgentSidebar";
import AffiliateSidebar from "./AffiliateSidebar";
import { useRoleView } from "@/contexts/RoleViewContext";
import { normalizeRole } from "@/app/utils/roles";

export default function DynamicSidebarLayout({
  sidebarVisible,
  mobileOpen,
  toggleMobile,
  sidebarRef,
}) {
  const { roleView, roles } = useRoleView();

  // Derive a stable role to use if roleView is empty (first load, cleared LS, etc.)
  const effectiveRole = useMemo(() => {
    // 1) explicit roleView wins
    const n = normalizeRole(roleView);
    if (n) return n;

    // 2) try localStorage (user last choice)
    if (typeof window !== "undefined") {
      const fromLS = normalizeRole(localStorage.getItem("roleView"));
      if (fromLS) return fromLS;
    }

    // 3) infer from actual account roles
    if (Array.isArray(roles) && roles.length) {
      if (roles.includes("seller_private") || roles.includes("seller_business")) return "seller";
      if (roles.includes("agent")) return "agent";
      if (roles.includes("affiliate")) return "affiliate";
      if (roles.includes("buyer")) return "buyer";
    }

    // 4) default to buyer UI if truly unknown
    return "buyer";
  }, [roleView, roles]);

  const commonProps = { sidebarVisible, mobileOpen, toggleMobile, sidebarRef };

  let SidebarComponent = BuyerSidebar;
  if (effectiveRole === "seller") SidebarComponent = SellerSidebar;
  else if (effectiveRole === "agent") SidebarComponent = AgentSidebar;
  else if (effectiveRole === "affiliate") SidebarComponent = AffiliateSidebar;

  useEffect(() => {
    // Debug only; remove or gate by NODE_ENV in prod
    // console.log("[Sidebar DEBUG]", { roles, roleView, effectiveRole, ls: typeof window !== "undefined" ? localStorage.getItem("roleView") : null });
  }, [roleView, roles, effectiveRole]);

  // Key forces a clean remount when role changes (prevents stale menu state)
  return <SidebarComponent key={effectiveRole} {...commonProps} />;
}