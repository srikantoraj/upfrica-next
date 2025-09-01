// src/components/new-dashboard/RoleViewContext.js
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/** Map any backend role to a UI role */
function normalizeOne(r) {
  if (!r) return null;
  if (r === "seller_private" || r === "seller_business") return "seller";
  if (["buyer", "seller", "agent", "affiliate"].includes(r)) return r;
  return null;
}

const RoleViewContext = createContext(null);

export function RoleViewProvider({ roles: rolesProp, defaultRole, children }) {
  const { user } = useAuth();

  // 1) Prefer roles from backend user
  const backendRoles = useMemo(() => {
    const raw = user?.account_type;
    const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return arr.filter(Boolean);
  }, [user?.account_type]);

  // 2) Fallback: roles passed via props
  const propRoles = useMemo(() => {
    const input = Array.isArray(rolesProp) ? rolesProp : rolesProp ? [rolesProp] : [];
    return input.filter(Boolean);
  }, [rolesProp]);

  // 3) Last resort: roles from cached user in localStorage
  const cachedRoles = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("user") || "null");
      const raw = saved?.account_type;
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return arr.filter(Boolean);
    } catch {
      return [];
    }
  }, []);

  // Choose first non-empty source
  const rawRoles = useMemo(() => {
    return (backendRoles?.length && backendRoles)
      || (propRoles?.length && propRoles)
      || (cachedRoles?.length && cachedRoles)
      || [];
  }, [backendRoles, propRoles, cachedRoles]);

  // Collapse → UI roles (seller_* → seller), de-dupe, ensure at least buyer
  const displayRoles = useMemo(() => {
    const mapped = rawRoles.map(normalizeOne).filter(Boolean);
    const out = mapped.length ? mapped : ["buyer"];
    return Array.from(new Set(out));
  }, [rawRoles]);

  // Pick an initial valid role
  const pickInitial = () => {
    if (defaultRole && displayRoles.includes(defaultRole)) return defaultRole;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("roleView");
      if (saved && displayRoles.includes(saved)) return saved;
    }
    return displayRoles[0];
  };

  const [roleView, setRoleView] = useState(pickInitial);

  // Keep roleView valid when roles change
  useEffect(() => {
    if (!displayRoles.length) return;
    if (!roleView || !displayRoles.includes(roleView)) {
      const next = pickInitial();
      setRoleView(next);
      if (typeof window !== "undefined") localStorage.setItem("roleView", next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayRoles.join("|")]);

  // Dev logs (toggle off if noisy)
  useEffect(() => {
    console.log("🟢 RoleViewProvider rawRoles (chosen):", rawRoles);
    console.log("   ↳ from backend:", backendRoles, "prop:", propRoles, "cache:", cachedRoles);
    console.log("🔹 displayRoles (UI):", displayRoles);
    console.log("📌 roleView:", roleView);
  }, [rawRoles, backendRoles, propRoles, cachedRoles, displayRoles, roleView]);

  const value = useMemo(
    () => ({ roles: rawRoles, displayRoles, roleView, setRoleView }),
    [rawRoles, displayRoles, roleView]
  );

  return <RoleViewContext.Provider value={value}>{children}</RoleViewContext.Provider>;
}

export function useRoleView() {
  const ctx = useContext(RoleViewContext);
  if (!ctx) throw new Error("useRoleView must be used inside <RoleViewProvider>");
  return ctx;
}