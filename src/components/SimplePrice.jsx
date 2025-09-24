// components/SimplePrice.jsx
'use client';

import React from 'react';

/**
 * SUPER SIMPLE TEST VIEW
 * - Shows the price as <symbol><activeAmountOnly>
 * - Optionally shows the struck-through original price if `saleActive`
 * - Shows a shipping line only when it's explicitly safe to do so
 *
 * NOTE: All FX conversion must already be done UPSTREAM in ProductDetailSection.
 * This component just displays what it receives.
 */
export default function SimplePrice({
  symbol = '₵',
  activeAmountOnly,       // amount-only string already in the UI currency
  originalAmountOnly,     // optional amount-only string
  saleActive = false,

  // shipping display (only render when explicitly deliverable & known)
  postageCents = null,    // integer (minor units) or null/undefined
  postageSymbol = '',
  shipAvailable = null,   // true | false | null
  deliverCc = '',         // e.g. "GB", "GH" for "Not deliverable to GB"
}) {
  const DEBUG =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('debug');

  const n = Number(postageCents);
  const hasKnownPostage = Number.isFinite(n);
  const isTrulyFree = hasKnownPostage && n === 0;

  // Decide what (if anything) to show for shipping
  let shippingLine = null;

  if (shipAvailable === false) {
    const to = deliverCc ? ` to ${String(deliverCc).toUpperCase()}` : '';
    shippingLine = `Not deliverable${to}`;
  } else if (shipAvailable === true && hasKnownPostage) {
    const major = Math.max(0, n) / 100;
    shippingLine = isTrulyFree
      ? 'Free delivery'
      : `Delivery from ${postageSymbol}${major.toFixed(2)}`;
  }
  // else: unknown availability/fee → render nothing (avoid implying “Free”)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Price */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>
          {symbol}{activeAmountOnly ?? '—'}
        </span>
        {saleActive &&
          originalAmountOnly &&
          originalAmountOnly !== activeAmountOnly && (
            <del style={{ color: '#9CA3AF' }}>
              {symbol}{originalAmountOnly}
            </del>
          )}
      </div>

      {/* Shipping (only when we have something meaningful to say) */}
      {shippingLine && (
        <div style={{ marginTop: 6, fontSize: 13, color: '#4B5563' }} aria-live="polite">
          {shippingLine}
        </div>
      )}

      {/* Tiny debug echo of the props */}
      {DEBUG && (
        <pre
          style={{
            marginTop: 8,
            fontSize: 10,
            lineHeight: 1.3,
            background: '#f8fafc',
            color: '#0f172a',
            padding: 6,
            borderRadius: 6,
            overflowX: 'auto',
          }}
        >
{JSON.stringify(
  {
    symbol,
    activeAmountOnly,
    originalAmountOnly,
    saleActive,
    postageCents,
    postageSymbol,
    shipAvailable,
    deliverCc,
  },
  null,
  2
)}
        </pre>
      )}
    </div>
  );
}