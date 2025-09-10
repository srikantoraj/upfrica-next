// app/(pages)/new-dashboard/Page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";

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
  if (Array.isArray(account_type)) return account_type;
  return [String(account_type)];
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
      // Preserve a redirect back to the dashboard after onboarding
      const redirectTarget =
        search?.get("redirect") || (typeof window !== "undefined" ? window.location.pathname : "/new-dashboard");
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
      <div className="w-full p-6 text-center text-gray-600 dark:text-gray-300">
        ⏳ Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <CompleteSetupBanner />

      {effectiveRole === "seller" && <SellerDashboardHome />}
      {effectiveRole === "buyer" && <BuyerDashboardHome />}
      {effectiveRole === "agent" && <AgentDashboardHome />}
      {effectiveRole === "affiliate" && <AffiliateDashboardHome />}
    </div>
  );
}