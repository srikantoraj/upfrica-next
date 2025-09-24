// src/components/common/Money.jsx
// usage in Product card: <Money amount={product.price} currency={product.currency} />
"use client";

import React, { useMemo } from "react";
import { useLocalization } from "@/contexts/LocalizationProvider";

/**
 * <Money amount={199} from="USD" />
 * - amount: number in the item’s ORIGINAL currency
 * - from / currency: 3-letter ISO code the amount is denominated in (e.g., "USD", "GHS")
 * - approx: when true, prefixes "≈ " **only if** a conversion occurred
 * - digits: override fraction digits; if omitted we use the currency’s natural digits
 * - className: optional class names for the wrapper <span>
 */
export default function Money({
  amount,
  from,
  currency: fromProp, // alias for convenience
  approx = false,
  digits,
  className,
}) {
  const {
    loading,
    convertOnce, // { amount, converted, toCurrency }
    format,
    currency: uiCurrency,
  } = useLocalization();

  const sourceCcy = String(from || fromProp || uiCurrency || "").toUpperCase();
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;

  // convert exactly once toward current UI currency
  const res = convertOnce(n, sourceCcy, uiCurrency);
  const displayCcy = res.converted ? uiCurrency : sourceCcy;

  // only lock fraction digits if caller provided `digits`
  const nfOpts = useMemo(() => {
    if (typeof digits === "number") {
      return {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      };
    }
    // let Intl pick the right digits for the currency (0/2/3…)
    return {};
  }, [digits]);

  const text = format(res.amount, displayCcy, nfOpts);

  // Accessible title (helpful on converted prices)
  const title =
    res.converted && sourceCcy !== displayCcy
      ? `Converted from ${n.toLocaleString()} ${sourceCcy} to ${displayCcy}`
      : `${displayCcy}`;

  // mask only numerals while hydrating to avoid SSR/CSR mismatch jitter
  const skeleton = useMemo(
    () => (loading ? text.replace(/[0-9]/g, "–") : text),
    [loading, text]
  );

  return (
    <span className={`tabular-nums ${className || ""}`} title={title} aria-label={text}>
      {approx && res.converted ? "≈ " : ""}
      {skeleton}
    </span>
  );
}