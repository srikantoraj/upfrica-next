// src/components/ui/PlanComparisonModal.jsx
"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircle, XCircle, Star, Award, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import axiosInstance from "@/lib/axiosInstance";
import InfoTooltip from "@/components/ui/InfoTooltip";
import infoRegistry from "@/constants/infoRegistry";

const CORE_FEATURES = ["max_products", "allow_bnpl", "allow_display_seller_contact"];
const fmtPrice = (n) => (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

export default function PlanComparisonModal({
  onPick,
  open,                // controlled (optional)
  onOpenChange,        // controlled (optional)
  hideTrigger = false, // hide default trigger button
}) {
  const controlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlled ? open : internalOpen;
  const setOpen = (v) => (controlled ? onOpenChange?.(v) : setInternalOpen(v));

  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'weekly'

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: raw = [] } = await axiosInstance.get("/api/seller-plans/");

        const dyn = new Set();
        raw.forEach((p) => p.feature_matrix?.forEach((fm) => fm.feature?.name && dyn.add(fm.feature.name)));
        const dynamicFeatures = Array.from(dyn);

        const normalized = raw.map((p) => {
          const fm = {};
          dynamicFeatures.forEach((f) => {
            fm[f] = !!p.feature_matrix?.some((x) => x.feature?.name === f && x.enabled);
          });
          return {
            id: p.id,
            label: p.label,
            price_month: Number(p.price_per_month) || 0,
            price_week: Number(p.price_per_week) || 0,
            max_products: p.max_products,
            allow_bnpl: p.allow_bnpl,
            allow_display_seller_contact: p.allow_display_seller_contact,
            is_popular: !!p.is_popular,
            is_free: Number(p.price_per_month) === 0 || !!p.is_free,
            features: fm,
          };
        });

        if (!alive) return;
        setPlans(normalized);
        setFeatures(dynamicFeatures);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const columns = useMemo(
    () =>
      plans.map((p) => ({
        key: p.id,
        title: p.label,
        priceMonthly: p.price_month,
        priceWeekly: p.price_week,
        is_popular: p.is_popular,
        is_free: p.is_free,
        highlights: [
          { label: "Max listings", value: p.max_products, type: "number" },
          { label: "Buy Now Pay Later", value: p.allow_bnpl, type: "boolean" },
          { label: "Display phone number", value: p.allow_display_seller_contact, type: "boolean" },
        ],
      })),
    [plans]
  );

  // default trigger for uncontrolled use
  if (!controlled && !hideTrigger) {
    if (loading || plans.length === 0) {
      return <Button variant="outline" disabled className="opacity-60">Compare Plans</Button>;
    }
    return <Button variant="outline" onClick={() => setOpen(true)}>Compare Plans</Button>;
  }

  if (loading) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[120]" onClose={() => setOpen(false)}>
        {/* Backdrop */}
        <Transition.Child as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
        </Transition.Child>

        {/* Sheet */}
        <Transition.Child as={Fragment}
          enter="ease-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0"
          leave="ease-in duration-200" leaveFrom="translate-y-0" leaveTo="translate-y-full">
          <Dialog.Panel className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-5xl rounded-t-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#0f1115] dark:ring-white/10">
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-4 pb-3">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Compare Seller Plans</Dialog.Title>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Review features across plans and pick what fits your shop best.
                </p>
              </div>

              {/* Billing toggle */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${billing === "monthly" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>Monthly</span>
                <button
                  type="button"
                  onClick={() => setBilling((v) => (v === "monthly" ? "weekly" : "monthly"))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${billing === "weekly" ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
                  aria-label="Toggle billing cycle"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${billing === "weekly" ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className={`text-xs font-medium ${billing === "weekly" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>Weekly</span>

                <button
                  onClick={() => setOpen(false)}
                  className="ml-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Plan “cards” row inside the table header area */}
            <div className="-mx-4 overflow-x-auto px-4 md:mx-0">
              <div
                className="grid grid-cols-[112px_repeat(3,minmax(184px,1fr))] gap-3 px-4 pb-2"
                role="region"
                aria-label="Plan quick summary"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                  maskImage:
                    "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                }}
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">Feature</div>
                {columns.map((c) => {
                  const price = billing === "weekly" ? c.priceWeekly : c.priceMonthly;
                  const isFree = (billing === "weekly" ? c.priceWeekly : c.priceMonthly) === 0 || c.is_free;
                  return (
                    <div key={c.key} className={[
                      "rounded-2xl border p-3 bg-white dark:bg-[#0f1115]",
                      c.is_popular ? "border-purple-500 ring-1 ring-purple-200 dark:ring-purple-800/50" : "border-gray-200 dark:border-gray-700",
                    ].join(" ")}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{c.title}</span>
                          {c.is_popular && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-medium text-white">
                              <Star className="h-3 w-3" /> Popular
                            </span>
                          )}
                          {!c.is_popular && isFree && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                              <Award className="h-3 w-3" /> Free
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xl font-bold leading-5">
                        GHS {fmtPrice(price)}
                        <span className="ml-1 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                          /{billing === "weekly" ? "wk" : "mo"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Includes core selling tools</p>

                      {/* highlights */}
                      <ul className="mt-2 space-y-1.5 text-[13px]">
                        {c.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {h.type === "boolean" ? (
                              h.value ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-rose-500" />
                            ) : (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                            <span>
                              {h.label}
                              {" "}{h.type === "number" && <span className="font-semibold">{h.value ?? "—"}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className={[
                          "mt-3 w-full rounded-lg px-3 py-2 text-center text-sm font-semibold transition",
                          c.is_popular ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white",
                        ].join(" ")}
                        onClick={() => { onPick?.(c.key); setOpen(false); }}
                      >
                        {isFree ? "Get Started" : "Select plan"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison matrix */}
            <div
              className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                maskImage:
                  "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
              }}
            >
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm dark:bg-[#0f1115]/95">
                  <tr className="text-left text-sm">
                    <th className="sticky left-0 z-20 w-36 bg-white px-4 py-3 font-medium dark:bg-[#0f1115]">
                      Feature
                    </th>
                    {columns.map((c) => (
                      <th key={c.key} className="min-w-[184px] px-3 py-2 text-center text-sm font-semibold">
                        {c.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <RowGroupHeader label="Core limits" />
                  {CORE_FEATURES.map((k, i) => (
                    <FeatureRow
                      key={k}
                      zebra={i % 2 === 1}
                      label={infoRegistry[k]?.label || k}
                      info={infoRegistry[k]?.description}
                      plans={plans}
                      render={(p) => renderCell(p[k])}
                    />
                  ))}

                  {features.length > 0 && <RowGroupHeader label="Advanced" />}
                  {features.map((f, i) => (
                    <FeatureRow
                      key={f}
                      zebra={i % 2 === 1}
                      label={infoRegistry[f]?.label || f}
                      info={infoRegistry[f]?.description || `More about ${f}`}
                      plans={plans}
                      render={(p) =>
                        p.features[f] ? (
                          <CheckCircle className="mx-auto h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="mx-auto h-4 w-4 text-rose-500" />
                        )
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t bg-white/95 px-5 py-3 text-xs text-gray-600 backdrop-blur-sm dark:border-gray-800 dark:bg-[#0f1115]/95 dark:text-gray-400">
              <span>Tap a plan header or button to pick it.</span>
              <span className="hidden sm:inline rounded-full bg-purple-50 px-2 py-1 font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
                You can change plans anytime.
              </span>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

/* helpers */
function RowGroupHeader({ label }) {
  return (
    <tr>
      <td colSpan={999} className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-[#10141a] dark:text-gray-300">
        {label}
      </td>
    </tr>
  );
}

function FeatureRow({ label, info, render, plans, zebra }) {
  return (
    <tr className={zebra ? "bg-white dark:bg-[#0f1115]" : "bg-gray-50/70 dark:bg-[#10141a]/60"}>
      <td className="sticky left-0 z-10 w-36 bg-inherit px-4 py-3 text-[13px] font-medium">
        <div className="flex items-center gap-1">
          <span className="leading-4">{label}</span>
          {info && <InfoTooltip content={info} />}
        </div>
      </td>
      {plans.map((p, idx) => (
        <td
          key={p.id}
          className={`min-w-[184px] px-3 py-3 text-center text-sm ${idx > 0 ? "border-l border-gray-100 dark:border-gray-800" : ""}`}
        >
          {render(p)}
        </td>
      ))}
    </tr>
  );
}

function renderCell(val) {
  if (typeof val === "number") return <span className="text-sm font-semibold">{val}</span>;
  if (typeof val === "boolean") return val ? <CheckCircle className="mx-auto h-4 w-4 text-emerald-600" /> : <XCircle className="mx-auto h-4 w-4 text-rose-500" />;
  return <span>-</span>;
}