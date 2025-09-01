//src/common/AccountTypeBadge.jsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";
import classNames from "classnames";

const roleMap = {
  buyer: "Buyer",
  seller_private: "Seller (Private)",
  seller_business: "Seller (Business)",
  agent: "Sourcing Agent",
  affiliate: "Affiliate",
};

const badgeStyles = {
  buyer: "bg-green-100 text-green-800",
  seller_private: "bg-yellow-100 text-yellow-800",
  seller_business: "bg-blue-100 text-blue-800",
  agent: "bg-purple-100 text-purple-800",
  affiliate: "bg-pink-100 text-pink-800",
};

const activeStyles = {
  buyer: "bg-green-600 text-white",
  seller_private: "bg-yellow-600 text-white",
  seller_business: "bg-blue-600 text-white",
  agent: "bg-purple-600 text-white",
  affiliate: "bg-pink-600 text-white",
};

// Normalize for switching logic
const normalizeRole = (role) =>
  role === "seller_private" || role === "seller_business" ? "seller" : role;

// Safe parse helper
function parseAccountType(value) {
  if (!value) return [];

  if (
    Array.isArray(value) &&
    value.length > 1 &&
    typeof value[0] === "string" &&
    value.join("").startsWith("{") &&
    value.join("").endsWith("}")
  ) {
    const joined = value.join("");
    return joined
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""));
  }

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    if (value.startsWith("{") && value.endsWith("}")) {
      return value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""));
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    return [value];
  }

  return [];
}

export default function AccountTypeBadge() {
  const router = useRouter();
  const { user } = useAuth();
  const { roleView, setRoleView } = useRoleView();

  const roles = parseAccountType(user?.account_type);
  const pathname = usePathname();

  const handleSwitchRole = (role) => {
    const normalized = normalizeRole(role);

    if (roleView === normalized) return;

    setRoleView(normalized);
    localStorage.setItem("roleView", normalized);

    // 🧠 Determine correct redirect
    if (normalized === "buyer") {
      if (
        pathname.startsWith("/new-dashboard/seller") ||
        pathname.includes("products")
      ) {
        router.push("/new-dashboard/buyer");
      } else {
        router.push("/new-dashboard");
      }
    }

    if (normalized === "seller") {
      if (!pathname.startsWith("/new-dashboard/seller")) {
        router.push("/new-dashboard/seller");
      }
    }

    if (normalized === "agent") {
      if (!pathname.startsWith("/new-dashboard/agent")) {
        router.push("/new-dashboard/agent");
      }
    }

    if (normalized === "affiliate") {
      if (!pathname.startsWith("/new-dashboard/affiliate")) {
        router.push("/new-dashboard/affiliate");
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {roles.map((role) => {
        const normalized = normalizeRole(role);
        const isActive = roleView === normalized;

        return (
          <button
            key={role}
            onClick={() => handleSwitchRole(role)}
            className={classNames(
              "text-xs font-semibold px-3 py-1 rounded transition-all duration-150 shadow-sm",
              isActive
                ? activeStyles[role]
                : badgeStyles[role] || "bg-gray-100 text-gray-700",
            )}
          >
            {roleMap[role] || role}
          </button>
        );
      })}
    </div>
  );
}
