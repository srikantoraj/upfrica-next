//src/components/new-dashboard/RequireRole.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleView } from "@/contexts/RoleViewContext";

export default function RequireRole({ need, children, fallback = "/unauthorized" }) {
  const router = useRouter();
  const { hydrated } = useAuth();
  const { displayRoles } = useRoleView();

  const allowed = Array.isArray(displayRoles) && displayRoles.includes(need);

  useEffect(() => {
    if (!hydrated) return;         // wait until /me is loaded
    if (!allowed) router.replace(fallback);
  }, [hydrated, allowed, router, fallback]);

  if (!hydrated) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading…</span>
      </div>
    );
  }

  // If not allowed we’ve already scheduled a redirect; render nothing to avoid flicker.
  if (!allowed) return null;

  return children;
}