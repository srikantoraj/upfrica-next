// src/components/new-dashboard/RequireRole.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";

/**
 * Gate a subtree by role(s).
 *
 * Props:
 * - roles: string | string[]   (any-of by default)
 * - need:  string              (legacy alias for single role)
 * - requireAll: boolean        (if true, user must have ALL roles)
 * - fallback: string           (route to redirect to when unauthorized)
 */
export default function RequireRole({
  roles,
  need,
  requireAll = false,
  fallback = "/unauthorized",
  children,
}) {
  const router = useRouter();
  const { hydrated } = useAuth();
  const { displayRoles } = useRoleView();

  // Normalize required roles from props
  const required = useMemo(() => {
    const r = roles ?? need ?? [];
    return Array.isArray(r) ? r.filter(Boolean) : [r].filter(Boolean);
  }, [roles, need]);

  // Compute allowance
  const allowed = useMemo(() => {
    if (!Array.isArray(displayRoles) || displayRoles.length === 0) return false;
    if (required.length === 0) return true; // no requirement => allow
    return requireAll
      ? required.every((r) => displayRoles.includes(r))
      : required.some((r) => displayRoles.includes(r));
  }, [displayRoles, required, requireAll]);

  // Redirect once auth is hydrated and user is not allowed
  useEffect(() => {
    if (!hydrated) return;
    if (!allowed) router.replace(fallback);
  }, [hydrated, allowed, router, fallback]);

  if (!hydrated) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading…</span>
      </div>
    );
  }

  // If not allowed, we already scheduled a redirect—render nothing to avoid flicker.
  if (!allowed) return null;

  return <>{children}</>;
}