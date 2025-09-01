// src/components/new-dashboard/RoleSwitcher.jsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import classNames from "classnames";
import { useRoleView } from "@/contexts/RoleViewContext";
import { useAuth } from "@/contexts/AuthContext";

const roleConfig = {
  buyer: { label: "Buyer", emoji: "🛍️", active: "bg-emerald-600 text-white",
    inactive: "hover:bg-emerald-100 text-gray-700 dark:text-gray-200",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    ring: "ring-emerald-300" },
  seller: { label: "Seller", emoji: "🏪", active: "bg-orange-600 text-white",
    inactive: "hover:bg-orange-100 text-gray-700 dark:text-gray-200",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    ring: "ring-orange-300" },
  agent: { label: "Agent", emoji: "🧭", active: "bg-indigo-600 text-white",
    inactive: "hover:bg-indigo-100 text-gray-700 dark:text-gray-200",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    ring: "ring-indigo-300" },
  affiliate: { label: "Affiliate", emoji: "💸", active: "bg-pink-600 text-white",
    inactive: "hover:bg-pink-100 text-gray-700 dark:text-gray-200",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ring: "ring-pink-300" },
};

export default function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { roleView, setRoleView, displayRoles, roles } = useRoleView();
  const { refreshUser } = useAuth();

  // Prefer provider's displayRoles (now sourced from backend)
  const roleButtons = useMemo(() => {
    if (Array.isArray(displayRoles) && displayRoles.length) return displayRoles;

    // Fallback compute (should rarely run now)
    const hasSeller =
      Array.isArray(roles) && (roles.includes("seller_private") || roles.includes("seller_business"));
    const out = [];
    if (roles?.includes?.("buyer")) out.push("buyer");
    if (hasSeller) out.push("seller");
    if (roles?.includes?.("agent")) out.push("agent");
    if (roles?.includes?.("affiliate")) out.push("affiliate");
    return out.length ? out : ["buyer"];
  }, [displayRoles, roles]);

  // keep a valid roleView
  useEffect(() => {
    if (!roleButtons.length) return;
    if (!roleView || !roleButtons.includes(roleView)) {
      const next = roleButtons[0];
      setRoleView(next);
      if (typeof window !== "undefined") localStorage.setItem("roleView", next);
    }
  }, [roleView, roleButtons, setRoleView]);

  const handleSwitch = async (newRole) => {
    if (!newRole || newRole === roleView) return;
    setRoleView(newRole);
    if (typeof window !== "undefined") localStorage.setItem("roleView", newRole);

    try { await refreshUser?.(); } catch {}

    const target =
      newRole === "buyer" ? "/new-dashboard/buyer" :
      newRole === "seller" ? "/new-dashboard/seller" :
      newRole === "agent" ? "/new-dashboard/agent" :
      "/new-dashboard/affiliate";

    if (pathname === target) {
      router.replace("/new-dashboard/temp");
      setTimeout(() => router.replace(target), 30);
    } else {
      router.push(target);
    }
  };

  if (!roleButtons.length) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-2 space-y-2">
      <div className="flex rounded-full overflow-hidden border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm">
        {roleButtons.map((role) => {
          const isActive = roleView === role;
          return (
            <button
              key={role}
              onClick={() => handleSwitch(role)}
              className={classNames(
                "px-4 py-1 text-xs font-semibold transition-all duration-200 ease-in-out flex items-center gap-1",
                isActive ? roleConfig[role].active : roleConfig[role].inactive,
                isActive && "ring-2 ring-offset-1",
                isActive && roleConfig[role].ring
              )}
            >
              <span>{roleConfig[role].emoji}</span>
              <span>{roleConfig[role].label}</span>
            </button>
          );
        })}
      </div>

      {roleView && (
        <span
          className={classNames(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            roleConfig[roleView]?.badge ||
              "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          )}
        >
          Active Role: {roleConfig[roleView]?.label || roleView}
        </span>
      )}
    </div>
  );
}