//src/components/product/ShippingPreview.jsx  // for get a quote maybe can be used for big amounts like machines
"use client";

import React from "react";
import Link from "next/link";
import { useLocalization } from "@/contexts/LocalizationProvider";
import Money from "@/components/common/Money";
import { previewProductShipping, pickCheapestFastest, formatEta } from "@/lib/shipping";

// tiny
const cls = (...a) => a.filter(Boolean).join(" ");
const slugify = (s="") => s.toString().toLowerCase().trim()
  .replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g,"-").replace(/^-+|-+$/g,"");

export default function ShippingPreview({
  productId,
  productTitle,
  originCountryCode = "GH",
  originCity,
  className = "",
  /** Optional: override where the “similar in NG” link points */
  similarHref,
  /** Optional: let parent know if deliverable */
  onStateChange,
}) {
  const { country: deliverCC, city, currency: uiCurrency } = useLocalization();
  const [loading, setLoading] = React.useState(true);
  const [state, setState] = React.useState({ available: null, currency: null, options: [] });

  const isCrossBorder = String(originCountryCode || "").toLowerCase() !== String(deliverCC || "").toLowerCase();

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    previewProductShipping({
      productId,
      deliverCC,
      city,
    })
      .then((res) => {
        if (!active) return;
        setState(res || { available: null, currency: null, options: [] });
        onStateChange?.(!!(res?.options?.length));
      })
      .catch(() => active && setState({ available: null, currency: null, options: [] }))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [productId, deliverCC, city]); // eslint-disable-line

  const { options = [] } = state || {};
  const { cheapest, fastest } = pickCheapestFastest(options);
  const deliverable = options.length > 0;

  const titleSlug = slugify(productTitle || "");
  const toNG = (p) => (p || "").replace(/^\/[a-z]{2}(?=\/|$)/i, "/ng");
  const similar = similarHref || (titleSlug ? toNG(`/${deliverCC}/search?q=${encodeURIComponent(productTitle)}`) : toNG(`/${deliverCC}/search?sort=trending`));
  const sourcingHref = toNG(`/${deliverCC}/sourcing?intent=${encodeURIComponent(productTitle || "Help me find this")}`);

  return (
    <div className={cls("rounded-xl border border-[var(--line)] p-3 space-y-3", className)}>
      {/* Badge stack */}
      <div className="flex flex-wrap gap-2 text-[12px]">
        {isCrossBorder ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            🌍 Ships from {originCity ? `${originCity}, ` : ""}{String(originCountryCode).toUpperCase()} → {String(deliverCC).toUpperCase()}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            🏠 Local delivery in {String(deliverCC).toUpperCase()}
          </span>
        )}

        {deliverable && (fastest || cheapest) && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            🚚 Estimated delivery: {formatEta(fastest || cheapest) || "—"}
          </span>
        )}

        {isCrossBorder && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
            🧾 Duties collected at checkout
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-sm text-[var(--ink-2)]">Checking delivery options…</div>
      ) : deliverable ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cheapest && (
              <div className="rounded-lg border border-[var(--line)] p-2">
                <div className="text-xs text-[var(--ink-3)] mb-0.5">Cheapest</div>
                <div className="text-sm font-semibold">
                  <Money
                    amount={cheapest._price}
                    from={cheapest.currency || state.currency || uiCurrency}
                    approx
                    digits={0}
                  />
                </div>
                <div className="text-xs text-[var(--ink-2)]">{formatEta(cheapest) || "ETA —"}</div>
              </div>
            )}
            {fastest && (
              <div className="rounded-lg border border-[var(--line)] p-2">
                <div className="text-xs text-[var(--ink-3)] mb-0.5">Fastest</div>
                <div className="text-sm font-semibold">
                  <Money
                    amount={fastest._price}
                    from={fastest.currency || state.currency || uiCurrency}
                    approx
                    digits={0}
                  />
                </div>
                <div className="text-xs text-[var(--ink-2)]">{formatEta(fastest) || "ETA —"}</div>
              </div>
            )}
          </div>

          {/* Checkout expectations */}
          <div className="rounded-lg bg-[var(--alt-surface)] p-2 text-[12px]">
            <div>Primary payment: <strong>Buy Now (SafePay)</strong>{isCrossBorder ? " • Cross-border orders don’t support Cash on Delivery." : ""}</div>
            <div className="text-[var(--ink-2)]">Totals show item price, shipping, and estimated duties in your currency.</div>
          </div>
        </>
      ) : state.available === false ? (
        /* Not deliverable */
        <div className="space-y-2">
          <div className="text-sm">Not currently shipping to <strong>{String(deliverCC).toUpperCase()}</strong>.</div>
          <div className="flex flex-wrap gap-2">
            <Link href={similar} className="px-3 py-1.5 rounded-lg border text-sm">See similar in Nigeria</Link>
            <Link href={sourcingHref} className="px-3 py-1.5 rounded-lg bg-[var(--brand-600)] text-white text-sm">Source it for me</Link>
          </div>
        </div>
      ) : (
        /* Probably deliverable (unknown) */
        <div className="space-y-2">
          <div className="text-sm">Likely deliverable — get a shipping quote.</div>
          <div className="flex flex-wrap gap-2">
            <a href="#contact" className="px-3 py-1.5 rounded-lg border text-sm">Message seller</a>
            <Link href={sourcingHref} className="px-3 py-1.5 rounded-lg bg-[var(--brand-600)] text-white text-sm">Get a shipping quote</Link>
          </div>
        </div>
      )}

      {/* City hint */}
      {!city && (
        <div className="text-[11px] text-[var(--ink-3)]">Add your city for accurate ETA and fees.</div>
      )}
    </div>
  );
}