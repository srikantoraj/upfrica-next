// src/components/review/RatingPopover.jsx
'use client';

import React from 'react';
import Link from 'next/link';

function clampPct(n) {
  const x = Math.round(Number(n || 0));
  return Math.max(0, Math.min(100, x));
}

export default function RatingPopover({
  average = 0,
  count = 0,
  breakdown = {},           // {5: %, 4: %, ...} OR counts (we normalize)
  anchorHref = '#reviews',
  onRequestClose = () => {},
}) {
  // --- normalize: accept percentages or counts
  const data = React.useMemo(() => {
    const src = breakdown && typeof breakdown === 'object' ? breakdown : {};
    // Coerce to {1..5: number}
    const vals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.entries(src).forEach(([k, v]) => {
      const s = Number(String(k).match(/[1-5]/)?.[0]);
      if (s >= 1 && s <= 5) vals[s] = Number(v) || 0;
    });

    const sum = Object.values(vals).reduce((a, b) => a + b, 0);
    const isPercent = Math.abs(sum - 100) <= 1; // 99–101 ≈ 100
    if (isPercent) return Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, clampPct(v)]));

    const denom = sum > 0 ? sum : count || 0;
    if (!denom) return vals;
    return Object.fromEntries(
      Object.entries(vals).map(([k, v]) => [k, clampPct((Number(v) / denom) * 100)])
    );
  }, [breakdown, count]);

  const nf = React.useMemo(() => new Intl.NumberFormat(), []);
  const avg = Number(average || 0);

  // ESC to close
  const onKeyDown = (e) => e.key === 'Escape' && onRequestClose();

  return (
<div
  role="dialog"
  aria-label="Product rating details"
  className="absolute z-40 top-[calc(100%+8px)] left-0 sm:left-1/2 sm:-translate-x-1/2
             w-[min(28rem,92vw)] rounded-2xl bg-white dark:bg-slate-900
             shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-4 sm:p-5"
  onKeyDown={onKeyDown}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Overall rating
        </span>
        <span className="text-xs rounded-full px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
          {nf.format(count)} ratings
        </span>
      </div>

      {/* Grid: average (left) | breakdown (right) */}
      <div className="grid grid-cols-1 sm:grid-cols-[120px,1fr] gap-4 items-start">
        {/* Left: big number + stars */}
        <div className="space-y-1">
          <div className="text-3xl font-extrabold tabular-nums">{avg.toFixed(1)}</div>
          <div aria-hidden className="text-amber-500 text-lg leading-none">
            {/* simple “filled” stars: tweak if you have a star component */}
            {'★'.repeat(Math.floor(avg))}{avg % 1 >= 0.5 ? '½' : ''}{'☆'.repeat(5 - Math.ceil(avg))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            out of 5
          </div>
        </div>

        {/* Right: distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = data[star] ?? 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-6 text-right text-sm text-gray-700 dark:text-gray-300">
                  {star}★
                </span>
                <div
                  className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                  role="progressbar"
                  aria-label={`${star} star share`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <div
                    className="h-full rounded-full bg-[var(--violet-600,#7c3aed)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-gray-600 dark:text-gray-400 tabular-nums">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 text-center">
        <Link
          href={anchorHref}
          className="text-[var(--brand-700,#1246CA)] hover:underline font-medium"
        >
          See customer reviews →
        </Link>
      </div>
    </div>
  );
}