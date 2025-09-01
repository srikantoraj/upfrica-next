// src/components/badges/BadgePill.jsx
'use client';
import React from 'react';

export default function BadgePill({
  type, asButton = false, onClick, className = '',
}) {
  const labelMap = {
    verified: 'Verified seller',
    contactVerified: 'Contact verified',
    officialStore: 'Official store',
    secureSeller: 'Secure seller',
  };
  const label = labelMap[type] ?? 'Badge';

  const base =
    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ' +
    'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900';

  const intent = {
    verified: 'ring-1 ring-green-200/70',
    contactVerified: 'ring-1 ring-cyan-200/70',
    officialStore: 'ring-1 ring-neutral-200/70',
    secureSeller: 'ring-1 ring-indigo-200/70',
  }[type] ?? '';

  const buttonish = asButton
    ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 ' +
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
    : '';

  const props = asButton
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(e);
          }
        },
      }
    : {};

  return (
    <span
      aria-label={label}
      className={[base, intent, buttonish, className].join(' ')}
      {...props}
    >
      {/* simple emoji glyphs for now */}
      {type === 'verified' && <span>✅</span>}
      {type === 'contactVerified' && <span>📞</span>}
      {type === 'officialStore' && <span>🏬</span>}
      {type === 'secureSeller' && <span>🛡️</span>}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}