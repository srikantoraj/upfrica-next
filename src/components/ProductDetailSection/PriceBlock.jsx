'use client';

import React from 'react';
import { FaTruck } from 'react-icons/fa';
import TrustBadges from './TrustBadges';

/* ---------- tiny helpers ---------- */
function parseAmountToNumber(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (!s) return null;
  let cleaned = s.replace(/[^\d.,-]/g, '');
  if (cleaned.includes('.') && cleaned.includes(',')) cleaned = cleaned.replace(/,/g, '');
  else if (cleaned.includes(',') && !cleaned.includes('.')) cleaned = cleaned.replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
const isPositive = (v) => {
  const n = parseAmountToNumber(v);
  return n != null && n > 0;
};

export default function PriceBlock({
  /** Display currency symbol for the product price (already chosen by pricing-mini). */
  symbol = '₵',

  /** Seller/origin currency code (postage is shown in this currency). */
  fromCurrency = null,

  /** Amount-only numbers/strings (already localized by pricing-mini). */
  activePrice,
  originalPrice = null,

  saleActive = false,
  timeRemaining = null, // {days,hours,minutes,seconds} | null

  /** Postage in **seller minor units** (cents). If null/undefined => unknown (show “calculated at checkout”). */
  postage_fee_cents = null,

  /** When false => show Amazon-style block (used to disable Buy in the parent). */
  shipAvailable = null,
}) {
  // Seller currency symbol (for postage + fallback)
  const sellerSymbol = React.useMemo(() => {
    if (!fromCurrency) return null;
    try {
      const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: fromCurrency }).formatToParts(1);
      return parts.find((p) => p.type === 'currency')?.value || fromCurrency;
    } catch {
      return fromCurrency;
    }
  }, [fromCurrency]);

  const priceSymbol = symbol || sellerSymbol || '₵';
  const postageSymbol = sellerSymbol || priceSymbol;

  const hasActive = isPositive(activePrice);
  const showOriginal =
    saleActive && isPositive(originalPrice) && String(originalPrice) !== String(activePrice);

  const tr = saleActive && timeRemaining ? timeRemaining : null;
  const days = Math.max(0, tr?.days ?? 0);
  const hours = Math.max(0, tr?.hours ?? 0);
  const minutes = Math.max(0, tr?.minutes ?? 0);
  const seconds = Math.max(0, tr?.seconds ?? 0);

  // Postage is in seller currency; format with that currency for clarity
  const postageKnown = postage_fee_cents != null; // strictly check, don't coerce to 0
  const postageMajor = postageKnown ? Math.max(0, Number(postage_fee_cents) / 100) : null;

  const formatPostage = React.useCallback(
    (n) => {
      if (!fromCurrency) return `${postageSymbol}${n.toFixed(2)}`;
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: fromCurrency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(n);
      } catch {
        return `${postageSymbol}${n.toFixed(2)}`;
      }
    },
    [fromCurrency, postageSymbol]
  );

  return (
    <div className="space-y-2">
      {/* Price */}
      <div>
        {hasActive ? (
          saleActive ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-700">
                {priceSymbol}
                {activePrice}
              </span>
              {showOriginal && (
                <del className="text-gray-400">
                  {priceSymbol}
                  {originalPrice}
                </del>
              )}
            </div>
          ) : (
            <span className="text-2xl font-bold text-green-700">
              {priceSymbol}
              {activePrice}
            </span>
          )
        ) : (
          <span className="text-lg font-semibold text-gray-500">Ask for price</span>
        )}
      </div>

      {/* Countdown */}
      {saleActive && tr && (
        <p className="text-sm text-red-700 font-medium" aria-live="polite">
          Sale ends in {days > 0 ? `${days}d ` : ''}
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </p>
      )}

      {/* Shipping availability / postage */}
      {shipAvailable === false ? (
        <div className="mt-1 text-sm p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          This item cannot be dispatched to your selected delivery location. Please choose a different
          delivery location.
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaTruck className="text-lg" />
          {!postageKnown ? (
            <span>Delivery fee calculated at checkout</span>
          ) : postageMajor === 0 ? (
            <span className="text-green-600 font-semibold">Free delivery</span>
          ) : (
            <span>Delivery from {formatPostage(postageMajor)}</span>
          )}
        </div>
      )}

      {/* Trust badges */}
      <TrustBadges />
    </div>
  );
}