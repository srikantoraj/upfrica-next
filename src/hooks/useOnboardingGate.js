//src/hooks/useOnboardingGate.js
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const SAFE = [
  "/login",
  "/signup",
  "/onboarding/account-type",
  "/onboarding/seller-plans",
  "/onboarding/checklist",
  "/agent/onboarding",
  "/affiliate/onboarding",
];

export function useOnboardingGate() {
  const { hydrated, token, onboarding } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated || !token) return;
    if (SAFE.some((p) => pathname.startsWith(p))) return;

    if (onboarding && onboarding.complete === false && onboarding.target) {
      router.replace(onboarding.target);
    }
  }, [hydrated, token, onboarding, pathname, router]);
}