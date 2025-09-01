//src/app/(pages)/new-dashboard/agent/page.jsx
// src/app/(pages)/new-dashboard/agent/page.jsx
"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import AgentDashboardHome from "@/components/new-dashboard/AgentDashboardHome";

export default function AgentDashboardPage() {
  return (
    <RoleGuard allowed={["agent"]}>
      <AgentDashboardHome />
    </RoleGuard>
  );
}
