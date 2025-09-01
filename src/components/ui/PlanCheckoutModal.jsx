"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PlanCheckoutModal({ open, onClose, planId, billing }) {
  const router = useRouter();

  const handleCheckout = () => {
    if (!planId) return;
    router.push(`/onboarding/checkout/${planId}?billing=${billing}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl font-bold mb-2">
          Confirm Plan
        </DialogTitle>
        <p className="text-gray-600 text-sm mb-4">
          You’re about to continue to payment for your selected seller plan.
          Would you like to proceed?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
