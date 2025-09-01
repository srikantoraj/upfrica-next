"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import PlanComparisonModal from "@/components/ui/PlanComparisonModal";
import PlanToggleFilter from "@/components/ui/PlanToggleFilter";
import PlanCheckoutModal from "@/components/ui//PlanCheckoutModal";
import { CheckIcon } from "lucide-react";

const ROLE_OPTIONS = [
  { label: "Buy items", value: "buyer", group: "primary" },
  { label: "Become Upfrica sourcing agent", value: "agent", group: "primary" },
  { label: "Sell as an individual", value: "seller_private", group: "seller" },
  { label: "Sell as a company", value: "seller_business", group: "seller" },
];

export default function AccountTypeAndPlan() {
  const router = useRouter();
  const { token, user, refreshUser, hydrated } = useAuth();
  const searchParams = useSearchParams();

  const [selectedRoles, setSelectedRoles] = useState(["buyer"]);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const sellerSelected =
    selectedRoles.includes("seller_private") ||
    selectedRoles.includes("seller_business");

  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/api/seller-plans/", {
          headers: {
            Authorization: `Token ${token?.replace(/^"|"$/g, "")}`,
          },
        })
        .then((res) => {
          setPlans(res.data);
          setFilteredPlans(res.data);
        });
    }
  }, [token]);

  const toggleRole = (value) => {
    if (value === "buyer") return;
    const updated = selectedRoles.includes(value)
      ? selectedRoles.filter((r) => r !== value)
      : [...selectedRoles, value];

    const hasBothSellers =
      updated.includes("seller_private") && updated.includes("seller_business");
    const hasSellerAndAgent =
      (updated.includes("seller_private") ||
        updated.includes("seller_business")) &&
      updated.includes("agent");

    if (hasBothSellers || hasSellerAndAgent) {
      toast.error("❌ Can't combine seller types or seller + agent.");
      return;
    }

    if (!updated.includes("buyer")) updated.unshift("buyer");
    setSelectedRoles([...new Set(updated)]);
  };

  const handleSubmit = async () => {
    setError(null);

    const isSeller = sellerSelected;
    const isFreePlan =
      !selectedPlan ||
      Number(plans.find((p) => p.id === selectedPlan)?.price_per_month || 0) ===
        0;

    if (isSeller && !selectedPlan) {
      return setError("Please select a seller plan.");
    }

    const payload = {
      account_type: selectedRoles,
      seller_plan_id: isSeller ? selectedPlan : null,
      billing_cycle: billingCycle,
    };

    try {
      setLoading(true);
      await axiosInstance.patch("/api/users/me/", payload, {
        headers: {
          Authorization: `Token ${token?.replace(/^"|"$/g, "")}`,
        },
      });
      toast.success("✅ Roles and plan saved!");
      await refreshUser();
      router.push("/new-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Select Your Account Type</h1>
      <p className="text-gray-500 mb-6">
        Choose what you want to do on Upfrica.
      </p>

      <div className="space-y-4 mb-6">
        {ROLE_OPTIONS.map(({ label, value }) => {
          const isSelected = selectedRoles.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleRole(value)}
              className={`w-full px-4 py-3 rounded border flex justify-between items-center transition-all ${
                isSelected
                  ? "bg-purple-600 text-white font-semibold border-purple-600"
                  : "bg-white border-gray-300 hover:border-purple-500"
              }`}
            >
              <span>{label}</span>
              {isSelected && <CheckIcon className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {sellerSelected && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`text-sm font-medium ${billingCycle === "monthly" ? "text-black" : "text-gray-500"}`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() =>
                  setBillingCycle((prev) =>
                    prev === "monthly" ? "weekly" : "monthly",
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
      ${billingCycle === "weekly" ? "bg-purple-600" : "bg-gray-300"}
    `}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
        ${billingCycle === "weekly" ? "translate-x-6" : "translate-x-1"}
      `}
                />
              </button>
              <span
                className={`text-sm font-medium ${billingCycle === "weekly" ? "text-black" : "text-gray-500"}`}
              >
                Weekly
              </span>
            </div>

            <PlanComparisonModal />
          </div>

          <PlanToggleFilter plans={plans} setFilteredPlans={setFilteredPlans} />

          <h2 className="font-medium mb-2">Choose a Seller Plan</h2>
          <div className="grid gap-3">
            {filteredPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-4 rounded border transition-all ${
                  selectedPlan === plan.id
                    ? "bg-green-50 border-green-500 ring ring-green-300"
                    : "bg-white border-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{plan.label}</div>
                    <div className="text-sm text-gray-500">
                      GHS{" "}
                      {billingCycle === "weekly"
                        ? plan.price_per_week
                        : plan.price_per_month}
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <span className="text-green-600">✔ Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={(sellerSelected && !selectedPlan) || loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>

      <PlanCheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        planId={selectedPlan}
        billing={billingCycle}
      />
    </div>
  );
}
