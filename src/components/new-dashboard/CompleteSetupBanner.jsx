//src/components/new-dashboard/CompleteSetupBanner.jsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export default function CompleteSetupBanner() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const ob = user?.onboarding;
  if (!ob) return null;

  const showSetup = ob.complete === false;           // needs to finish onboarding
  const showWelcome = !showSetup && ob.first_time;   // first welcome route

  if (!showSetup && !showWelcome) return null;

  const primaryCtaText = showSetup ? "Continue setup" : "Start tour";
  const target = ob.target || "/onboarding/checklist";

  const handlePrimary = useCallback(async () => {
    router.replace(target);
  }, [router, target]);

  const handleDismissWelcome = useCallback(async () => {
    // Mark welcome seen (only when first_time)
    try {
      setBusy(true);
      await axiosInstance.post("/onboarding/welcome-seen/");
      await refreshUser();
    } finally {
      setBusy(false);
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

          {showWelcome && (
            <button
              disabled={busy}
              onClick={handleDismissWelcome}
              className="inline-flex items-center rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-800/40"
            >
              {busy ? "Saving…" : "Dismiss"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}