"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import axiosInstance from "@/lib/axiosInstance";
import InfoTooltip from "@/components/ui/InfoTooltip";
import infoRegistry from "@/constants/infoRegistry";

const CORE_FEATURES = [
  "max_products",
  "allow_bnpl",
  "allow_display_seller_contact",
];

export default function PlanComparisonModal() {
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/seller/plan-matrix/")
      .then((res) => {
        const rawPlans = res.data;

        const allFeaturesSet = new Set();
        rawPlans.forEach((plan) =>
          (plan.features || []).forEach((f) => allFeaturesSet.add(f)),
        );
        const allFeatures = Array.from(allFeaturesSet);

        const normalizedPlans = rawPlans.map((plan) => {
          const featureMap = {};
          allFeatures.forEach((f) => {
            featureMap[f] = plan.features?.includes(f) || false;
          });
          return {
            id: plan.id,
            name: plan.name,
            label: plan.label,
            price: plan.price_per_month,
            price_weekly: plan.price_per_week,
            max_products: plan.max_products,
            allow_bnpl: plan.allow_bnpl,
            allow_display_seller_contact: plan.allow_display_seller_contact,
            badge: plan.badge,
            features: featureMap,
          };
        });

        setFeatures(allFeatures);
        setPlans(normalizedPlans);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || plans.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Compare Plans</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-xl font-bold mb-4">
          Compare Seller Plans
        </DialogTitle>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full table-auto text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center p-2 border-b">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{plan.label}</span>
                      <span className="text-xs text-muted-foreground">
                        GHS {plan.price}
                      </span>
                      {plan.badge && (
                        <span className="mt-1 text-[10px] font-medium text-white bg-purple-600 rounded px-2 py-0.5">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORE_FEATURES.map((key) => (
                <tr key={key} className="border-t">
                  <td className="p-2 font-medium">
                    <div className="flex items-center gap-1">
                      {infoRegistry[key]?.label || key}
                      <InfoTooltip content={infoRegistry[key]?.description} />
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td key={`${plan.id}-${key}`} className="text-center p-2">
                      {typeof plan[key] === "boolean" ? (
                        plan[key] ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold">
                          {plan[key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {features.map((feature) => (
                <tr key={feature} className="border-t">
                  <td className="p-2 font-medium">
                    <div className="flex items-center gap-1">
                      {infoRegistry[feature]?.label || feature}
                      <InfoTooltip
                        content={
                          infoRegistry[feature]?.description ||
                          `More about ${feature}`
                        }
                      />
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={`${plan.id}-${feature}`}
                      className="text-center p-2"
                    >
                      {plan.features[feature] ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
