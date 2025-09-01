// src/components/auth/RoleGuard.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";
import AccessDeniedScreen from "./AccessDeniedScreen";

const SELLER_ANY = ["seller", "seller_private", "seller_business"];

const normalizeAllowed = (allowed) =>
  Array.isArray(allowed) ? allowed : allowed ? [allowed] : [];

const hasField = (obj, key) =>
  !!obj && Object.prototype.hasOwnProperty.call(obj, key);

const userHasPlan = (user) =>
  !!(user?.seller_plan && (user.seller_plan.id ?? user.seller_plan));

const matchRole = (userRoles = [], role) => {
  if (!Array.isArray(userRoles)) return false;
  if (role === "seller") return SELLER_ANY.some((r) => userRoles.includes(r));
  return userRoles.includes(role);
};

const pickBestRoleForUser = (userRoles = []) => {
  if (userRoles.some((r) => SELLER_ANY.includes(r))) return "seller";
  if (userRoles.includes("buyer")) return "buyer";
  if (userRoles.includes("agent")) return "agent";
  if (userRoles.includes("affiliate")) return "affiliate";
  return null;
};

export default function RoleGuard({ allowed = [], requirePlan = false, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, refreshUser } = useAuth();
  const { roleView, setRoleView } = useRoleView();

  const [checking, setChecking] = useState(true);
  const [granted, setGranted] = useState(false);
  const didRedirectRef = useRef(false);
  const didTryRefreshRef = useRef(false);

  const allowedList = useMemo(() => normalizeAllowed(allowed), [allowed]);
  const rolesReady = hasField(user, "account_type");
  const planFieldReady = !requirePlan || hasField(user, "seller_plan");

  const userRoles = useMemo(
    () => (Array.isArray(user?.account_type) ? user.account_type : []),
    [user?.account_type]
  );

  const okByRole = useMemo(
    () => (allowedList.length === 0 ? true : allowedList.some((r) => matchRole(userRoles, r))),
    [allowedList, userRoles]
  );

  const isSeller = useMemo(
    () => userRoles.some((r) => SELLER_ANY.includes(r)),
    [userRoles]
  );

  const needsPlanDecision =
    hydrated && !!user && requirePlan && isSeller && planFieldReady && !userHasPlan(user);

  const shouldAttemptRefresh =
    hydrated && !!user && requirePlan && isSeller && !didTryRefreshRef.current &&
    (!planFieldReady || !userHasPlan(user));

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      if (!didRedirectRef.current) {
        didRedirectRef.current = true;
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
      setGranted(false);
      setChecking(false);
      return;
    }

    if (shouldAttemptRefresh && typeof refreshUser === "function") {
      didTryRefreshRef.current = true;
      (async () => { try { await refreshUser(); } catch {} })();
      setChecking(true);
      setGranted(false);
      return;
    }

    const roleCheckPending = allowedList.length > 0 && !rolesReady;
    const planCheckPending = requirePlan && isSeller && !planFieldReady;
    if (roleCheckPending || planCheckPending) {
      setChecking(true);
      setGranted(false);
      return;
    }

    if (allowedList.length === 0) {
      setGranted(true);
      setChecking(false);
      return;
    }

    if (!okByRole) {
      const best = pickBestRoleForUser(userRoles);
      if (best && roleView !== best) setRoleView(best);
      if (!didRedirectRef.current) {
        didRedirectRef.current = true;
        router.replace("/unauthorized");
      }
      setGranted(false);
      setChecking(false);
      return;
    }

    if (needsPlanDecision) {
      if (!didRedirectRef.current) {
        didRedirectRef.current = true;
        router.replace("/onboarding/account-type");
      }
      setGranted(false);
      setChecking(false);
      return;
    }

    if (roleView && !allowedList.includes(roleView)) {
      const fallback = allowedList.find((r) => matchRole(userRoles, r));
      if (fallback) setRoleView(fallback);
    }

    setGranted(true);
    setChecking(false);
  }, [
    hydrated,
    user,
    pathname,
    allowedList,
    rolesReady,
    planFieldReady,
    okByRole,
    isSeller,
    needsPlanDecision,
    shouldAttemptRefresh,
    roleView,
    userRoles,
    router,
    setRoleView,
    refreshUser,
  ]);

  if (checking) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-600 dark:text-gray-300">
        <span className="animate-pulse">
          {requirePlan ? "Checking plan…" : "Checking access…"}
        </span>
      </div>
    );
  }

  return granted ? children : <AccessDeniedScreen />;
}