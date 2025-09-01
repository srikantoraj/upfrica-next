"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AccountTypeAndPlan from "@/components/onboarding/AccountTypeAndPlan";

export default function AccountTypePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentSuccess = searchParams.get("payment") === "success";
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (paymentSuccess) {
      toast.success("✅ Payment successful, your plan is active!");
      refreshUser();
      router.push("/new-dashboard");
    }
  }, [paymentSuccess, refreshUser, router]);

  return <AccountTypeAndPlan />;
}
