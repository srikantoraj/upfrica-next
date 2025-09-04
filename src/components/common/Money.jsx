// src/components/common/Money.jsx
// usage in Product card: <Money amount={product.price} currency={product.currency} />
"use client";

import React from "react";
import { useLocalization } from "@/contexts/LocalizationProvider";

/**
 * <Money amount={199} from="USD" />
 * - amount: number in the item’s ORIGINAL currency
 * - from/currency: 3-letter ISO code the amount is denominated in (e.g., "USD", "GHS")
 * - approx: when true, prefixes "≈ " **only if** a conversion occurred
 * - digits: override fraction digits (default: 0)
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

  // Convert once toward UI currency; if FX fails we keep the original amount & currency.
  const res = convertOnce(n, sourceCcy, uiCurrency);
  const displayCcy = res.converted ? uiCurrency : sourceCcy;

  const text = format(res.amount, displayCcy, {
    maximumFractionDigits: typeof digits === "number" ? digits : 0,
    minimumFractionDigits: typeof digits === "number" ? digits : 0,
  });

  return (
    <span className={className}>
      {approx && res.converted ? "≈ " : ""}
      {/* Keep server/client stable during boot: mask digits while i18n/FX hydrate */}
      {loading ? text.replace(/[0-9]/g, "–") : text}
    </span>
  );
}