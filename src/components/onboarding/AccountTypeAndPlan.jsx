// src/components/onboarding/AccountTypeAndPlan.jsx
"use client";

import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import PlanComparisonModal from "@/components/ui/PlanComparisonModal";
import PlanToggleFilter from "@/components/ui/PlanToggleFilter";
import PlanCheckoutModal from "@/components/ui/PlanCheckoutModal";
import { CheckIcon, ChevronLeft, ChevronRight } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────── */
/* Small inline component that renders the TradingView-style plan carousel    */
/* ────────────────────────────────────────────────────────────────────────── */
function PlanCardsInline({
  plans = [],
  billing = "monthly",
  selectedPlan,
  onPick,
}) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // keep dots in sync while user swipes
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children);
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const d = Math.abs(child.offsetLeft - el.scrollLeft);
        if (d < bestDist) { best = i; bestDist = d; }
      });
      setActiveIdx(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const priceKey = billing === "weekly" ? "price_per_week" : "price_per_month";
  const scrollToIndex = (idx) => {
    const el = trackRef.current;
    const card = cardRefs.current[idx];
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
  };
  const prev = () => scrollToIndex(Math.max(0, activeIdx - 1));
  const next = () => scrollToIndex(Math.min(plans.length - 1, activeIdx + 1));

  const fmtPrice = (n) =>
    (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <section
      className="-mx-4 mb-3 sm:mx-0"
      aria-roledescription="carousel"
      aria-label="Seller plan options"
    >
      <div
        ref={trackRef}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0"
        role="group"
      >
        {plans.map((p, idx) => {
          const price = p[priceKey];
          const popular = p.is_popular;
          const isSelected = selectedPlan === p.id;

          return (
            <article
              key={p.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              tabIndex={0}
              className={[
                "min-w-[86%] snap-start rounded-2xl border p-5 transition sm:min-w-0",
                popular
                  ? "border-purple-500 shadow-[0_8px_30px_rgb(88_28_135_/_0.25)] ring-1 ring-purple-200 dark:ring-purple-800/50"
                  : "border-gray-200 dark:border-gray-800",
                isSelected ? "outline outline-2 outline-green-500" : "",
                "bg-white dark:bg-[#0f1115]/90",
              ].join(" ")}
              aria-label={`${p.label} plan`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.label}</h3>
                {p.is_popular && (
                  <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[11px] font-medium text-white">
                    Most Popular
                  </span>
                )}
                {p.is_free && !p.is_popular && (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white">
                    Free
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
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Includes core selling tools
                </p>
              </div>

              <ul className="mb-5 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Max listings: <span className="ml-1 font-semibold">{p.max_products ?? "—"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-block h-2 w-2 rounded-full",
                      p.allow_bnpl ? "bg-emerald-500" : "bg-rose-500",
                    ].join(" ")}
                  />
                  Buy Now Pay Later
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-block h-2 w-2 rounded-full",
                      p.allow_display_seller_contact ? "bg-emerald-500" : "bg-rose-500",
                    ].join(" ")}
                  />
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
                onClick={() => onPick?.(p.id)}
              >
                {p.is_free ? (isSelected ? "Selected" : "Get Started") : (isSelected ? "Selected" : "Start free trial")}
              </button>

              {isSelected && (
                <div className="mt-2 text-center text-xs font-medium text-green-600 dark:text-green-400">
                  ✔ Selected
                </div>
              )}
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
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

const ROLE_OPTIONS = [
  { label: "Buy items", value: "buyer" },
  { label: "Sell as an individual", value: "seller_private" },
  { label: "Sell as a company", value: "seller_business" },
  { label: "Become Upfrica sourcing agent", value: "agent" },
  { label: "Become an affiliate", value: "affiliate", sellerConflict: true },
];

export default function AccountTypeAndPlan() {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const searchParams = useSearchParams();

  const [selectedRoles, setSelectedRoles] = useState(["buyer"]);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'weekly'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleError, setRoleError] = useState(null);

  // 🔐 Modal state lives here (parent)
  const [plansOpen, setPlansOpen] = useState(false);

  const sellerSelected =
    selectedRoles.includes("seller_private") ||
    selectedRoles.includes("seller_business");

  const currentStep = !sellerSelected ? 1 : !selectedPlan ? 2 : 3;

  useEffect(() => {
    if (!token) return;
    axiosInstance
      .get("/api/seller-plans/", {
        headers: { Authorization: `Token ${token?.replace(/^"|"$/g, "")}` },
      })
      .then((res) => {
        const list = res.data || [];
        setPlans(list);
        setFilteredPlans(list);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("🎉 Payment successful! Redirecting...");
      router.push("/new-dashboard");
    } else if (paymentStatus === "cancel") {
      toast.error("⚠️ Payment cancelled. Try again.");
    }
  }, [searchParams, router]);

  const toggleRole = (value) => {
    if (value === "buyer") return;
    let next = [...selectedRoles];
    const isSelected = next.includes(value);
    const isIndividual = value === "seller_private";
    const isCompany = value === "seller_business";

    if (isSelected) next = next.filter((r) => r !== value);
    else {
      next.push(value);
      if (isIndividual && next.includes("seller_business"))
        next = next.filter((r) => r !== "seller_business");
      if (isCompany && next.includes("seller_private"))
        next = next.filter((r) => r !== "seller_private");
    }

    const isSeller = next.includes("seller_private") || next.includes("seller_business");
    const isAgent = next.includes("agent");
    const isAffiliate = next.includes("affiliate");
    if (isSeller && isAgent) return toast.error("❌ You can’t combine seller and sourcing agent.");
    if (isSeller && isAffiliate) return toast.error("❌ You can’t be a seller and an affiliate.");
    if (isAgent && isAffiliate) return toast.error("❌ You can’t be an agent and an affiliate.");

    if (!next.includes("buyer")) next.unshift("buyer");
    setRoleError(null);
    setSelectedRoles([...new Set(next)]);
  };

  const handleSubmit = async () => {
    setError(null);
    if (sellerSelected && !selectedPlan) return setError("Please select a seller plan.");

    const patchPayload = {
      account_type: selectedRoles,
      ...(sellerSelected && selectedPlan && { seller_plan_id: selectedPlan }),
    };

    try {
      setLoading(true);
      await axiosInstance.patch("/api/users/me/", patchPayload, {
        headers: { Authorization: `Token ${token?.replace(/^"|"$/g, "")}` },
      });
      await refreshUser();

      if (sellerSelected && selectedPlan) {
        const plan = plans.find((p) => p.id === selectedPlan);
        if (!plan) return toast.error("❌ Could not find plan details.");

        const priceRaw =
          billingCycle === "weekly" ? plan.price_per_week : plan.price_per_month;
        const price = Number.parseFloat(priceRaw || 0) || 0;

        const res = await axiosInstance.post(
          "/api/seller/subscribe/",
          { plan_id: selectedPlan, billing_cycle: billingCycle || "monthly" },
          { headers: { Authorization: `Token ${token?.replace(/^"|"$/g, "")}` } }
        );

        if (price === 0) {
          toast.success("✅ Free plan activated immediately!");
          router.push("/new-dashboard");
        } else if (res.data?.checkout_url) {
          window.location.href = res.data.checkout_url;
        } else {
          toast.error("❌ Stripe checkout session failed.");
        }
      } else {
        toast.success("✅ Roles updated!");
        router.push("/new-dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 text-gray-900 dark:text-gray-100">
      {/* progress */}
      <div className="mb-6">
        <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">Step {currentStep} of 3</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-2 bg-purple-600 transition-all" style={{ width: `${(currentStep / 3) * 100}%` }} />
        </div>
      </div>

      {/* title */}
      <h1 className="mb-1 text-2xl font-bold">Select Your Account Type</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Choose what you want to do on Upfrica.</p>

      {/* roles */}
      <div className="mb-2 space-y-3">
        {ROLE_OPTIONS.map(({ label, value }) => {
          const isSelected = selectedRoles.includes(value);
          const isSellerSelected = selectedRoles.includes("seller_private") || selectedRoles.includes("seller_business");
          const isAgentSelected = selectedRoles.includes("agent");
          const sellerOrAgentConflict = value === "affiliate" && (isSellerSelected || isAgentSelected);
          const disableThis = sellerOrAgentConflict;

          return (
            <div key={value} className="space-y-1">
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => !disableThis && toggleRole(value)}
                disabled={disableThis}
                className={[
                  "flex w-full items-center justify-between rounded border px-4 py-3 transition",
                  isSelected
                    ? "border-purple-600 bg-purple-600 text-white shadow-md"
                    : "border-gray-300 bg-white hover:border-purple-500 dark:border-gray-700 dark:bg-gray-800",
                  disableThis ? "cursor-not-allowed opacity-50" : "",
                ].join(" ")}
              >
                <span>{label}</span>
                {isSelected && <CheckIcon className="h-5 w-5" />}
              </button>
              {disableThis && (
                <div className="ml-2 text-xs text-gray-400">
                  Cannot combine with seller or agent account.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {roleError && (
        <div className="mt-2 mb-4 text-sm font-medium text-red-600 dark:text-red-400">{roleError}</div>
      )}

      {/* seller step */}
      {sellerSelected && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={billingCycle === "monthly" ? "text-sm font-medium" : "text-sm font-medium text-gray-500 dark:text-gray-400"}>Monthly</span>
              <button
                type="button"
                onClick={() => setBillingCycle((b) => (b === "monthly" ? "weekly" : "monthly"))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  billingCycle === "weekly" ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label="Toggle billing cycle"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    billingCycle === "weekly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={billingCycle === "weekly" ? "text-sm font-medium" : "text-sm font-medium text-gray-500 dark:text-gray-400"}>Weekly</span>
            </div>

            {/* Compare Plans trigger */}
            <button
              type="button"
              onClick={() => setPlansOpen(true)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:border-purple-500 dark:border-gray-700 dark:bg-gray-800"
            >
              Compare Plans
            </button>
          </div>

          {/* Controlled PlanComparisonModal */}
          <PlanComparisonModal
            open={plansOpen}
            onOpenChange={setPlansOpen}
            hideTrigger
            onPick={(planId) => {
              setSelectedPlan(planId);
              setPlansOpen(false);
            }}
          />

          {/* optional filters */}
          <div className="mb-3 -mx-4 overflow-x-auto px-4">
            <PlanToggleFilter plans={plans} setFilteredPlans={setFilteredPlans} />
          </div>

          <h2 className="mb-2 font-medium">Choose a Seller Plan</h2>

          {/* Pricing cards */}
          <PlanCardsInline
            plans={filteredPlans}
            billing={billingCycle}
            selectedPlan={selectedPlan}
            onPick={setSelectedPlan}
          />
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {/* primary action */}
      <div className="sticky bottom-3 z-10 mt-6">
        <button
          onClick={handleSubmit}
          disabled={(sellerSelected && !selectedPlan) || loading}
          className="w-full rounded bg-purple-600 py-3 text-white transition hover:bg-purple-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : sellerSelected && !selectedPlan
            ? "Select a Plan to Continue"
            : "Continue"}
        </button>
      </div>

      <PlanCheckoutModal open={false} onClose={() => {}} planId={selectedPlan} billing={billingCycle} />
    </div>
  );
}