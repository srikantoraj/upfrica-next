// src/(pages)/new-dashboard/page.jsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRoleView } from '@/contexts/RoleViewContext';

import SellerDashboardHome from '@/components/new-dashboard/SellerDashboardHome';
import BuyerDashboardHome from '@/components/new-dashboard/BuyerDashboardHome';
import AgentDashboardHome from '@/components/new-dashboard/AgentDashboardHome';

export default function Page() {
  const { hydrated } = useAuth();
  const { roleView } = useRoleView();

  if (!hydrated) return null;

  if (roleView === 'seller') {
    return <SellerDashboardHome />;
  }

  if (roleView === 'agent') {
    return <AgentDashboardHome />;
  }

  // fallback for buyer (or unknown)
  return <BuyerDashboardHome />;
}