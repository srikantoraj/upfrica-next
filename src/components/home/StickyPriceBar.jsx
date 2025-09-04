// components/home/StickyPriceBar.jsx
'use client';

import React from 'react';
import { useLocalization } from '@/contexts/LocalizationProvider';

/**
 * Props
 * - symbol: string currency symbol to show (e.g. "GHS")
 * - activePrice: number | string
 *      If number: amount in *either* the user's currency or in `fromCurrency`
 *      If string: preformatted/rounded number (e.g. "13900.00") — shown as-is with `symbol`
 * - fromCurrency?: string ISO currency code of `activePrice` when it's a number in product currency
 * - onBuyNow: () => void
 * - ctaLabel?: string
 */
export default function StickyPriceBar({
  symbol,
  activePrice,
  fromCurrency,
  onBuyNow,
  ctaLabel = 'Buy Now',
}) {
  const { price: fxPrice } = useLocalization();

  // Normalize to a numeric amount in the user's currency.
  const amount = React.useMemo(() => {
    // If a number was passed, optionally convert using fromCurrency.
    if (typeof activePrice === 'number') {
      const n = Number.isFinite(activePrice) ? activePrice : 0;
      return fromCurrency ? fxPrice(n, fromCurrency) : n;
    }
    // If a string was passed (already converted/rounded), parse best-effort.
    const parsed = Number(String(activePrice).replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [activePrice, fromCurrency, fxPrice]);

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-[var(--line)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:bg-neutral-900/95">
      <div
        className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}
      >
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {symbol}
          {amount.toFixed(2)}
        </div>

        <button
          type="button"
          onClick={onBuyNow}
          className="px-5 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-500"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}