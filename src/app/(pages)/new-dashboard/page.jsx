// app/(pages)/new-dashboard/Page.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";

import ConnectivityStrip from "@/components/new-dashboard/ConnectivityStrip";
import SellerDashboardHome from "@/components/new-dashboard/SellerDashboardHome";
import BuyerDashboardHome from "@/components/new-dashboard/BuyerDashboardHome";
import AgentDashboardHome from "@/components/new-dashboard/AgentDashboardHome";
import AffiliateDashboardHome from "@/components/new-dashboard/AffiliateDashboardHome";
import CompleteSetupBanner from "@/components/new-dashboard/CompleteSetupBanner";

function normalizeRole(v) {
  if (!v) return "";
  const s = String(v).toLowerCase();
  if (s === "seller" || s === "seller_private" || s === "seller_business") return "seller";
  if (s === "buyer") return "buyer";
  if (s === "agent") return "agent";
  if (s === "affiliate") return "affiliate";
  return "";
}

function arrayifyAccountType(account_type) {
  if (!account_type) return [];
  return Array.isArray(account_type) ? account_type : [String(account_type)];
}

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const { hydrated, user } = useAuth();
  const { roleView } = useRoleView() || {};
  const [redirecting, setRedirecting] = useState(false);

  // If the user has no account_type yet, send them to onboarding.
  useEffect(() => {
    if (!hydrated || !user) return;
    const roles = arrayifyAccountType(user.account_type);
    if (roles.length === 0) {
      setRedirecting(true);
      const redirectTarget =
        search?.get("redirect") ||
        (typeof window !== "undefined" ? window.location.pathname : "/new-dashboard");
      router.replace(`/onboarding/account-type?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [hydrated, user, search, router]);

  const effectiveRole = useMemo(() => {
    // 1) explicit context value
    const n = normalizeRole(roleView);
    if (n) return n;

    // 2) last chosen role (client-only)
    if (typeof window !== "undefined") {
      const fromLS = normalizeRole(localStorage.getItem("roleView"));
      if (fromLS) return fromLS;
    }

    // 3) infer from user account_type
    const roles = arrayifyAccountType(user?.account_type);
    if (roles.includes("seller_private") || roles.includes("seller_business")) return "seller";
    if (roles.includes("agent")) return "agent";
    if (roles.includes("affiliate")) return "affiliate";
    if (roles.includes("buyer")) return "buyer";

    // 4) default
    return "buyer";
  }, [roleView, user?.account_type]);

  if (!hydrated || !user || redirecting) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-700 dark:text-gray-300">
        <ConnectivityStrip />
        ⏳ Loading dashboard...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white">
      <ConnectivityStrip />

      <section className="mb-4">
        <CompleteSetupBanner />
      </section>

      {effectiveRole === "seller" && <SellerDashboardHome />}
      {effectiveRole === "buyer" && <BuyerDashboardHome />}
      {effectiveRole === "agent" && <AgentDashboardHome />}
      {effectiveRole === "affiliate" && <AffiliateDashboardHome />}

      {/* Fallback (shouldn’t be hit, but keeps UI graceful) */}
      {!(["seller", "buyer", "agent", "affiliate"].includes(effectiveRole)) && (
        <div className="mt-6 text-sm text-amber-600 dark:text-amber-300">
          Unknown role view. Showing buyer dashboard for now.
          <BuyerDashboardHome />
        </div>
      )}
    </main>
  );
}