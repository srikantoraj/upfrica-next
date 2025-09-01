// src/components/pricing/UpfricaPricing.jsx
"use client";

import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { CheckCircle2, XCircle, Star, Award, Info, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const fmtPrice = (n) =>
  (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

const FEATURE_GROUPS = [
  {
    key: "core",
    label: "Core limits",
    items: [
      { key: "max_products", label: "Max Listings", type: "number", info: "Maximum active product listings." },
      { key: "allow_bnpl", label: "Buy Now Pay Later", type: "boolean", info: "Offer BNPL to increase conversions." },
      { key: "allow_display_seller_contact", label: "Display Phone Number", type: "boolean", info: "Show your contact on product pages." },
    ],
  },
];

export default function UpfricaPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'weekly'
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState(null);

  // carousel refs
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  // fetch plans
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axiosInstance
      .get("/api/seller-plans/")
      .then((res) => {
        if (!mounted) return;
        const raw = res.data || [];
        const normalized = raw.map((p) => ({
          id: p.id,
          label: p.label,
          badge: p.is_popular ? "Most Popular" : p.is_free ? "Free" : null,
          priceMonthly: p.price_per_month,
          priceWeekly: p.price_per_week,
          max_products: p.max_products,
          allow_bnpl: p.allow_bnpl,
          allow_display_seller_contact: p.allow_display_seller_contact,
          feature_matrix: Array.isArray(p.feature_matrix) ? p.feature_matrix : [],
        }));
        setPlans(normalized);
      })
      .catch((e) => setError(e?.message || "Failed to load plans"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const priceKey = billing === "weekly" ? "priceWeekly" : "priceMonthly";
  const popularIndex = useMemo(
    () => Math.max(0, plans.findIndex((p) => p.badge === "Most Popular")),
    [plans]
  );

  /** ---------- Carousel controls (mobile) ---------- */
  // Keep active index in sync as the user scrolls by touch
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handler = () => {
      const children = Array.from(el.children);
      // find the card whose left edge is closest to the track's scrollLeft
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - el.scrollLeft);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      setActiveIdx(best);
    };

    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollToIndex = (idx) => {
    const el = trackRef.current;
    const card = cardRefs.current[idx];
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" }); // -16 to account for padding
  };

  const prev = () => scrollToIndex(Math.max(0, activeIdx - 1));
  const next = () => scrollToIndex(Math.min(plans.length - 1, activeIdx + 1));

  /** ---------- UI ---------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-gray-700 dark:text-gray-200">
        <div className="mb-3 h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-8 h-4 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 w-full max-w-sm shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="mx-auto max-w-4xl p-6 text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose the plan that fits your growth</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
          Start free. Upgrade anytime. All plans include core selling tools.
        </p>

        {/* Billing toggle */}
        <div className="mt-4 flex items-center gap-3">
          <span className={billing === "monthly" ? "text-sm font-medium" : "text-sm font-medium text-gray-500 dark:text-gray-400"}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBilling((v) => (v === "monthly" ? "weekly" : "monthly"))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              billing === "weekly" ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label="Toggle billing cycle"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                billing === "weekly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={billing === "weekly" ? "text-sm font-medium" : "text-sm font-medium text-gray-500 dark:text-gray-400"}>
            Weekly
          </span>

          <span className="ml-3 hidden rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 sm:inline">
            No credit card needed
          </span>
        </div>
      </header>

      {/* Plan cards */}
      <section
        className="-mx-4 mb-3 sm:mx-0"
        aria-roledescription="carousel"
        aria-label="Upfrica plans"
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0"
          role="group"
        >
          {plans.map((p, idx) => {
            const price = p[priceKey];
            const popular = idx === popularIndex;
            return (
              <article
                ref={(el) => (cardRefs.current[idx] = el)}
                key={p.id}
                tabIndex={0}
                className={[
                  "min-w-[86%] snap-start rounded-2xl border p-5 transition sm:min-w-0",
                  popular
                    ? "border-purple-500 shadow-[0_8px_30px_rgb(88_28_135_/_0.25)] ring-1 ring-purple-200 dark:ring-purple-800/50"
                    : "border-gray-200 dark:border-gray-800",
                  "bg-white dark:bg-[#0f1115]/90",
                ].join(" ")}
                aria-label={`${p.label} plan`}
                onFocus={() => setActiveIdx(idx)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{p.label}</h3>
                  {p.badge && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        p.badge === "Most Popular"
                          ? "bg-purple-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {p.badge === "Most Popular" ? <Star className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    GHS {fmtPrice(price)}
                    <span className="ml-1 align-middle text-sm font-medium text-gray-600 dark:text-gray-400">
                      /{billing === "weekly" ? "wk" : "mo"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Includes core selling tools</p>
                </div>

                <ul className="mb-5 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Max listings: <span className="ml-1 font-semibold">{p.max_products ?? "—"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {p.allow_bnpl ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                    Buy Now Pay Later
                  </li>
                  <li className="flex items-center gap-2">
                    {p.allow_display_seller_contact ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                    Display phone number
                  </li>
                </ul>

                <button
                  className={[
                    "w-full rounded-lg px-4 py-2 text-center font-semibold transition",
                    popular
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white",
                  ].join(" ")}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("upfrica:plan-picked", { detail: { planId: p.id } }));
                  }}
                >
                  {p.badge === "Free" ? "Get Started" : "Start free trial"}
                </button>

                <div className="mt-3 hidden text-xs text-gray-600 underline decoration-dotted hover:no-underline dark:text-gray-400 sm:block">
                  Scroll down to compare all features
                </div>
              </article>
            );
          })}

          {/* mobile arrows */}
          {plans.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous plan"
                className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white dark:bg-gray-900/90 dark:ring-white/10 sm:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next plan"
                className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white dark:bg-gray-900/90 dark:ring-white/10 sm:hidden"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* dots */}
        {plans.length > 1 && (
          <div className="mt-2 flex justify-center gap-2 sm:hidden">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to plan ${i + 1}`}
                aria-current={activeIdx === i ? "true" : "false"}
                className={[
                  "h-2 w-2 rounded-full transition",
                  activeIdx === i ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature comparison */}
      <section aria-labelledby="compare-plans" className="mb-10">
        <h2 id="compare-plans" className="mb-3 text-xl font-semibold">
          Compare features
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f1115]">
          <div className="sticky top-0 z-10 grid grid-cols-[1fr_repeat(3,minmax(140px,1fr))] gap-3 border-b bg-white/90 p-3 backdrop-blur dark:bg-[#0f1115]/90">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Feature</div>
            {plans.map((p) => (
              <div key={p.id} className="text-center text-sm font-semibold">
                {p.label}
              </div>
            ))}
          </div>

          <div className="divide-y dark:divide-gray-800">
            {FEATURE_GROUPS.map((group) => (
              <Disclosure as={Fragment} key={group.key}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold">
                      <span className="uppercase tracking-wide text-gray-600 dark:text-gray-300">
                        {group.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {open ? "Hide" : "Show"}
                      </span>
                    </Disclosure.Button>

                    <Transition
                      enter="transition duration-150 ease-out"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition duration-100 ease-in"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Disclosure.Panel>
                        {group.items.map((f, idx) => (
                          <div
                            key={f.key}
                            className={`grid grid-cols-[1fr_repeat(3,minmax(140px,1fr))] items-center gap-3 px-4 py-3 ${
                              idx % 2 ? "bg-gray-50 dark:bg-[#12151c]" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <span>{f.label}</span>
                              {f.info && (
                                <span
                                  title={f.info}
                                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  <Info className="h-3 w-3" />
                                </span>
                              )}
                            </div>

                            {plans.map((p) => {
                              const value = p[f.key];
                              return (
                                <div key={`${p.id}-${f.key}`} className="text-center">
                                  {f.type === "number" ? (
                                    <span className="text-sm font-semibold">{value ?? "—"}</span>
                                  ) : f.type === "boolean" ? (
                                    value ? (
                                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <XCircle className="mx-auto h-4 w-4 text-rose-500" />
                                    )
                                  ) : (
                                    <span className="text-sm">—</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Tip: on mobile, swipe the plan cards above.</span>
            <span className="hidden sm:block">You can change plans anytime.</span>
          </div>
        </div>
      </section>
    </div>
  );
}