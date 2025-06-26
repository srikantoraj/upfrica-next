// src/components/new-dashboard/DynamicSidebarLayout.jsx
'use client';

import React from 'react';
import BuyerSidebar from './BuyerSidebar';
import SellerSidebar from './SellerSidebar';
import AgentSidebar from './AgentSidebar';
import { useRoleView } from '@/contexts/RoleViewContext';
import { normalizeRole } from '@/app/utils/roles';

export default function DynamicSidebarLayout({
  sidebarVisible,
  mobileOpen,
  toggleMobile,
  sidebarRef,
}) {
  const { roleView } = useRoleView();
  const normalizedRole = normalizeRole(roleView);

  const commonProps = {
    sidebarVisible,
    mobileOpen,
    toggleMobile,
    sidebarRef,
  };

  if (normalizedRole === 'seller') {
    return <SellerSidebar key="seller" {...commonProps} />;
  }

  if (normalizedRole === 'agent') {
    return <AgentSidebar key="agent" {...commonProps} />;
  }

  return <BuyerSidebar key="buyer" {...commonProps} />;
}