// src/components/new-dashboard/CompleteSetupBanner.jsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export default function CompleteSetupBanner() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [skipping, setSkipping] = useState(false);

  const ob = user?.onboarding;
  const roles = Array.isArray(user?.account_type) ? user.account_type : [];
  const hasAnyRole = roles.length > 0;

  // No onboarding object → nothing to show
  if (!ob) return null;

  const showSetup = ob.complete === false;     // user has steps to finish
  const showWelcome = !showSetup && ob.first_time === true; // first-time tour

  if (!showSetup && !showWelcome) return null;

  // Build a redirect back to where the user is now
  const returnTo = useMemo(() => {
    if (typeof window === "undefined") return "/new-dashboard";
    const loc = window.location;
    return `${loc.pathname}${loc.search || ""}`;
  }, []);

  // Compute target, always carrying a ?redirect=
  const target = useMemo(() => {
    const base = ob.target || (showSetup ? "/onboarding/checklist" : "/new-user/welcome");
    try {
      // Handle relative paths safely
      const u = new URL(base, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      if (!u.searchParams.has("redirect")) u.searchParams.set("redirect", returnTo);
      return `${u.pathname}${u.search}`;
    } catch {
      // Fallback if URL parsing fails
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}redirect=${encodeURIComponent(returnTo)}`;
    }
  }, [ob?.target, returnTo, showSetup]);

  const primaryCtaText = showSetup ? "Continue setup" : "Start tour";

  const handlePrimary = useCallback(() => {
    // If the user somehow reached here without a role yet, nudge them to account-type first.
    if (!hasAnyRole) {
      router.replace(`/onboarding/account-type?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }
    router.replace(target);
  }, [router, target, hasAnyRole, returnTo]);

  const handleDismissWelcome = useCallback(async () => {
    // Mark welcome seen (only when first_time)
    try {
      setBusy(true);
      await axiosInstance.post("/onboarding/welcome-seen/").catch(() => {});
      await refreshUser();
    } finally {
      setBusy(false);
    }
  }, [refreshUser]);

  const handleSkipSetup = useCallback(async () => {
    // Optionally mark onboarding complete & refresh; backend may ignore if not supported
    try {
      setSkipping(true);
      await axiosInstance.post("/onboarding/complete/").catch(() => {});
      await refreshUser();
    } finally {
      setSkipping(false);
    }
  }, [refreshUser]);

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          {showSetup ? (
            <>
              <div className="font-semibold">Finish setting up your account</div>
              <div className="text-sm opacity-90">
                You’re almost there. Complete the remaining steps to unlock all features.
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold">Welcome to Upfrica 🎉</div>
              <div className="text-sm opacity-90">
                We’ve prepared a quick tour based on your role. You can skip it anytime.
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrimary}
            className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-white text-sm font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {primaryCtaText}
          </button>

          {showSetup && (
            <button
              disabled={skipping}
              onClick={handleSkipSetup}
              className="inline-flex items-center rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-800/40 disabled:opacity-60"
              title="You can complete setup later"
            >
              {skipping ? "Saving…" : "Skip for now"}
            </button>
          )}

          {showWelcome && (
            <button
              disabled={busy}
              onClick={handleDismissWelcome}
              className="inline-flex items-center rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-800/40 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Dismiss"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}