// src/components/new-dashboard/DashboardLayout.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";
import TopBar from "./TopBar";
import SellerSidebar from "./SellerSidebar";
import BuyerSidebar from "./BuyerSidebar";
import AgentSidebar from "./AgentSidebar";
import Footer from "./Footer";
import { normalizeRole } from "@/app/utils/roles";
import { useSearchParams } from "next/navigation";

// Placeholder affiliate
const AffiliateSidebar = ({ isOpen }) => (
  <div className="w-64 bg-pink-100 dark:bg-pink-900 p-4">Affiliate Sidebar</div>
);

function InnerDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { roleView, displayRoles } = useRoleView();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const normalizedRole = normalizeRole(roleView);
  const paymentSuccess = searchParams.get("payment") === "success";

  const acct = user?.account_type;
  const isBuyerOnly = Array.isArray(acct)
    ? acct.length === 1 && acct.includes("buyer")
    : acct === "buyer";

  useEffect(() => {
    if (paymentSuccess) {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [paymentSuccess]);

  const renderSidebar = () => {
    if (normalizedRole === "seller") {
      return (
        <SellerSidebar
          key="seller"
          roleView={normalizedRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    if (normalizedRole === "agent") {
      return (
        <AgentSidebar
          key="agent"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    if (normalizedRole === "affiliate") {
      return <AffiliateSidebar key="affiliate" isOpen={sidebarOpen} />;
    }
    return <BuyerSidebar key="buyer" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar toogleMobileSidebarHide={() => setSidebarOpen(!sidebarOpen)} />

      {isBuyerOnly && (
        <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 text-sm px-4 py-2 text-center shadow-sm">
          🚀 Want to earn on Upfrica?{" "}
          <a href="/onboarding/account-type" className="underline font-semibold hover:text-indigo-700 dark:hover:text-white">
            Become a Seller, Agent or Affiliate
          </a>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}

        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 bg-green-50 dark:bg-[#0e1e1e] px-4 sm:px-6 lg:px-12 xl:px-40 py-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
              {/* tiny debug pill (remove later) */}
              <div className="text-xs opacity-70 mb-2">roles: {JSON.stringify(displayRoles)} | active: {normalizedRole}</div>
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { hydrated } = useAuth();
  if (!hydrated) return null;
  // RoleViewProvider is applied in app/(pages)/new-dashboard/layout.js
  return <InnerDashboardLayout>{children}</InnerDashboardLayout>;
}