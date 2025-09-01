"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const accountTypes = [
  {
    key: "buyer",
    title: "Buyer",
    emoji: "🛍️",
    description:
      "Browse and buy products, save items, and track orders easily.",
  },
  {
    key: "seller_private",
    title: "Seller (Private)",
    emoji: "👩🏾",
    description: "Sell personal or small business items with flexible plans.",
  },
  {
    key: "seller_business",
    title: "Seller (Business)",
    emoji: "🏢",
    description: "List bulk or professional inventory, access advanced tools.",
  },
  {
    key: "agent",
    title: "Sourcing Agent",
    emoji: "🚚",
    description: "Help buyers collect or verify items and earn commissions.",
  },
  {
    key: "affiliate",
    title: "Affiliate Marketer",
    emoji: "💸",
    description:
      "Promote products and earn commission when someone buys through your link.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, token, refreshUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sellerPlans, setSellerPlans] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isSeller =
    selectedRole === "seller_private" || selectedRole === "seller_business";

  useEffect(() => {
    if (isSeller && token) {
      fetch(`${BASE_API_URL}/api/seller-plans/`, {
        headers: {
          Authorization: `Token ${token?.replace(/^"|"$/g, "")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSellerPlans(data);
          } else if (Array.isArray(data.results)) {
            setSellerPlans(data.results);
          } else {
            setSellerPlans([]);
          }
        })
        .catch((err) => {
          console.error("❌ Failed to load seller plans", err);
          setError("Failed to load seller plans.");
        });
    }
  }, [selectedRole, token]);

  useEffect(() => {
    if ((selectedRole === "buyer" || selectedRole === "agent") && token) {
      handleSubmit();
    }
  }, [selectedRole]);

  const handleSubmit = async () => {
    setError("");
    if (!selectedRole || (isSeller && !selectedPlan)) {
      setError("Please select an account type and seller plan.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token?.replace(/^"|"$/g, "")}`,
        },
        body: JSON.stringify({
          account_type: selectedRole,
          seller_plan_id: isSeller ? selectedPlan.id : null,
        }),
      });

      if (res.ok) {
        await refreshUser();
        router.push("/new-dashboard");
      } else {
        setError("Failed to update your account.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Welcome to <span className="text-purple-600">Upfrica!</span>
      </h1>
      <p className="text-center text-gray-600 mb-8">
        What do you want to do today?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {accountTypes.map((type) => (
          <div
            key={type.key}
            className={`relative cursor-pointer border rounded-2xl p-6 text-center transition ${
              selectedRole === type.key
                ? "border-purple-500 bg-purple-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setSelectedRole(type.key);
              setSelectedPlan(null);
            }}
          >
            <div className="text-3xl mb-2">{type.emoji}</div>
            <h3 className="font-semibold text-lg">{type.title}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
            {selectedRole === type.key && (
              <div className="absolute top-4 right-4 text-purple-500 text-xl">
                ✔️
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isSeller && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            <h2 className="text-xl font-bold mb-4">Choose a Seller Plan</h2>
            <div className="space-y-4">
              {sellerPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative border p-4 rounded-xl cursor-pointer transition ${
                    selectedPlan?.id === plan.id
                      ? "border-purple-500 bg-purple-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h4 className="font-semibold">{plan.label}</h4>
                  <p className="text-sm text-gray-600">
                    {plan.description || "Flexible plan for sellers."}
                  </p>
                  <p className="text-md mt-1 font-bold">
                    {plan.price_per_month === "0.00"
                      ? "Free"
                      : `GHS ${plan.price_per_month}/month`}
                  </p>
                  {selectedPlan?.id === plan.id && (
                    <div className="absolute top-3 right-3 text-purple-500">
                      ✔️
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="text-red-600 text-sm text-center mt-6">{error}</div>
      )}

      <div className="mt-12 text-center">
        <Button
          disabled={submitting || !selectedRole || (isSeller && !selectedPlan)}
          onClick={handleSubmit}
          className="w-full max-w-md mx-auto"
        >
          {submitting ? "Submitting..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
