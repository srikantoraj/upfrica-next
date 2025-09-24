// src/components/ProductDetailSection/StickyPriceBar.jsx
'use client';

import React from 'react';

export default function StickyPriceBar({
  priceNode,                 // e.g. <Money ... />
  symbol = '₵',              // fallback symbol if priceNode not provided
  activeAmountOnly,          // fallback amount (already formatted)
  approx = false,            // show "≈ " when using fallback
  onBuyNow,                  // () => void
  disabled = false,
  blockedLabel = 'Not deliverable',
  onChangeLocation,          // optional: () => void (shows tiny "Change" link when disabled)
}) {
  // Hide if we have nothing to show in the enabled state
  const hasFallback =
    activeAmountOnly !== undefined &&
    activeAmountOnly !== null &&
    `${activeAmountOnly}` !== '';

  const showBar = priceNode || hasFallback || disabled; // show even if disabled to surface the message
  if (!showBar) return null;

  const handleClick = (e) => {
    if (disabled) { e.preventDefault(); return; }
    onBuyNow?.(e);
  };

  const priceArea = disabled ? (
    <div className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
      <span aria-live="polite">{blockedLabel}</span>
      {typeof onChangeLocation === 'function' && (
        <button
          type="button"
          onClick={onChangeLocation}
          className="text-[var(--violet-600,#7c3aed)] hover:underline"
        >
          Change
        </button>
      )}
    </div>
  ) : (
    <div className="text-base font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
      {priceNode ? (
        priceNode
      ) : (
        <>
          {approx ? '≈ ' : ''}{symbol}{activeAmountOnly}
        </>
      )}
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 border-t bg-white/95 dark:bg-neutral-900/95 backdrop-blur shadow-[0_-6px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center justify-between gap-3">
        {priceArea}

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-disabled={disabled}
          title={disabled ? blockedLabel : 'Buy Now (SafePay)'}
          className="shrink-0 px-5 py-2 rounded-full bg-[var(--violet-600,#7c3aed)] text-white font-semibold
                     hover:bg-[var(--violet-700,#6d28d9)]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? 'Unavailable' : 'Buy Now (SafePay)'}
        </button>
      </div>
      {/* iOS safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}