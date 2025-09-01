"use client";

import React from "react";
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
  const { roleView } = useRoleView();
  const normalized = normalizeRole(roleView); // "seller", "buyer", "agent", "affiliate"

  const commonProps = {
    sidebarVisible,
    mobileOpen,
    toggleMobile,
    sidebarRef,
  };

  const renderSidebar = () => {
    if (normalized === "seller") {
      return <SellerSidebar key="seller" {...commonProps} />;
    }
    if (normalized === "agent") {
      return <AgentSidebar key="agent" {...commonProps} />;
    }
    if (normalized === "affiliate") {
      return <AffiliateSidebar key="affiliate" {...commonProps} />;
    }
    return <BuyerSidebar key="buyer" {...commonProps} />;
  };

  return <div key={normalized}>{renderSidebar()}</div>;
}
