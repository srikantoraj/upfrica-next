// components/ProductDetailSection/SimplePrice.jsx
'use client';

import React from 'react';
import { FaTruck, FaExclamationTriangle } from 'react-icons/fa';

/* Parse amount-only strings like "1,234.56" or "0" safely */
function parseAmountToNumber(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  let s = String(v).trim();
  if (!s) return null;
  s = s.replace(/[^\d.,-]/g, '');
  if (s.includes('.') && s.includes(',')) s = s.replace(/,/g, '');
  else if (s.includes(',') && !s.includes('.')) s = s.replace(/,/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function SimplePrice({
  /** Display currency symbol for the **product price** (already final from pricing-mini) */
  symbol = '₵',

  /** Amount-only (already formatted) */
  activeAmountOnly,
  originalAmountOnly,
  saleActive = false,

  /**
   * Shipping display (always in **seller currency** — caller must pass correct symbol).
   * - Prefer `postageCents` (seller minor units).
   * - Or pass `postageAmountOnly` (amount-only string/number) with optional `postageSymbol`.
   * - If neither is provided, we show “Shipping at checkout”.
   *
   * IMPORTANT: default symbol is **empty** so we never borrow the UI price symbol.
   */
  postageAmountOnly = null,
  postageSymbol = '',          // ← do NOT default to `symbol` (prevents lying with a foreign symbol)
  postageCents = null,
  postageLabel = null,         // e.g., "Standard", "Express"
  etaDays = null,              // number | [min,max] | null

  /**
   * Shipping availability:
   *   false  -> show Amazon-style “cannot be dispatched” notice
   *   true   -> show postage line (or free / fallback)
   *   null/undefined -> treat as available (same as true)
   */
  shipAvailable = null,
}) {
  const hasActive = !!activeAmountOnly;
  const showOriginal =
    saleActive && originalAmountOnly && originalAmountOnly !== activeAmountOnly;

  // Build postage line (strict currency discipline: we render what we're given, no inference)
  const etaText =
    etaDays == null
      ? null
      : Array.isArray(etaDays)
      ? `${etaDays[0]}–${etaDays[1]} days`
      : `${etaDays} days`;

  let postageLine = 'Shipping at checkout';
  if (shipAvailable === false) {
    postageLine = null; // handled by the red notice below
  } else if (postageCents != null) {
    const major = Math.max(0, Number(postageCents) / 100);
    if (major === 0) {
      postageLine = 'Free delivery';
    } else {
      const parts = [
        `Delivery from ${postageSymbol}${major.toFixed(2)}`,
        postageLabel || null,
        etaText || null,
      ].filter(Boolean);
      postageLine = parts.join(' · ');
    }
  } else if (postageAmountOnly != null) {
    const n = parseAmountToNumber(postageAmountOnly);
    if (n === 0) {
      postageLine = 'Free delivery';
    } else if (n > 0) {
      const parts = [
        `Delivery from ${postageSymbol}${postageAmountOnly}`,
        postageLabel || null,
        etaText || null,
      ].filter(Boolean);
      postageLine = parts.join(' · ');
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
      {/* Price */}
      <div>
        {hasActive ? (
          saleActive ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#166534' }}>
                {symbol}{activeAmountOnly}
              </span>
              {showOriginal && (
                <del style={{ color: '#9CA3AF' }}>
                  {symbol}{originalAmountOnly}
                </del>
              )}
            </div>
          ) : (
            <span style={{ fontSize: 22, fontWeight: 700, color: '#166534' }}>
              {symbol}{activeAmountOnly}
            </span>
          )
        ) : (
          <span style={{ fontSize: 16, fontWeight: 600, color: '#6B7280' }}>Ask for price</span>
        )}
      </div>

      {/* Shipping availability / postage */}
      {shipAvailable === false ? (
        <div
          role="alert"
          style={{
            marginTop: 8,
            fontSize: 13,
            color: '#B91C1C',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <FaExclamationTriangle aria-hidden />
          <span>
            This item cannot be dispatched to your selected delivery location. Please choose a
            different delivery location.
          </span>
        </div>
      ) : (
        <div
          aria-live="polite"
          style={{
            marginTop: 6,
            fontSize: 13,
            color: '#4B5563',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <FaTruck aria-hidden />
          {postageLine === 'Free delivery' ? (
            <span style={{ color: '#16A34A', fontWeight: 600 }}>{postageLine}</span>
          ) : (
            <span>{postageLine}</span>
          )}
        </div>
      )}
    </div>
  );
}