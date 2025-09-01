// src/components/badges/TrustBadge.jsx
'use client';

import React from 'react';
import {
  FaCheckCircle, FaShieldAlt, FaBolt, FaStar, FaFire, FaLeaf,
  FaTruck, FaUndoAlt, FaCrown, FaMedal, FaPhoneAlt, FaStoreAlt,
} from 'react-icons/fa';

const ICONS = {
  verified: FaCheckCircle,
  contactVerified: FaPhoneAlt,
  sponsored: FaBolt,
  upfricaChoice: FaCrown,
  topRated: FaStar,
  bestSeller: FaMedal,
  limited: FaFire,
  eco: FaLeaf,
  fastDispatch: FaTruck,
  freeShipping: FaTruck,
  freeReturns: FaUndoAlt,
  officialStore: FaStoreAlt,
  secureSeller: FaShieldAlt,
};

const COLOR = {
  // bg / text colors are Tailwind classes
  verified:      { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-200/60 dark:ring-emerald-800' },
  contactVerified:{ bg: 'bg-teal-100 dark:bg-teal-900/30',      text: 'text-teal-700 dark:text-teal-300',         ring: 'ring-teal-200/60 dark:ring-teal-800' },
  sponsored:     { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-800 dark:text-amber-300',       ring: 'ring-amber-200/60 dark:ring-amber-800' },
  upfricaChoice: { bg: 'bg-violet-100 dark:bg-violet-900/30',   text: 'text-violet-800 dark:text-violet-300',     ring: 'ring-violet-200/60 dark:ring-violet-800' },
  topRated:      { bg: 'bg-yellow-100 dark:bg-yellow-900/30',   text: 'text-yellow-800 dark:text-yellow-300',     ring: 'ring-yellow-200/60 dark:ring-yellow-800' },
  bestSeller:    { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-800 dark:text-fuchsia-300',   ring: 'ring-fuchsia-200/60 dark:ring-fuchsia-800' },
  limited:       { bg: 'bg-rose-100 dark:bg-rose-900/30',       text: 'text-rose-800 dark:text-rose-300',         ring: 'ring-rose-200/60 dark:ring-rose-800' },
  eco:           { bg: 'bg-lime-100 dark:bg-lime-900/30',       text: 'text-lime-800 dark:text-lime-300',         ring: 'ring-lime-200/60 dark:ring-lime-800' },
  fastDispatch:  { bg: 'bg-sky-100 dark:bg-sky-900/30',         text: 'text-sky-800 dark:text-sky-300',           ring: 'ring-sky-200/60 dark:ring-sky-800' },
  freeShipping:  { bg: 'bg-sky-100 dark:bg-sky-900/30',         text: 'text-sky-800 dark:text-sky-300',           ring: 'ring-sky-200/60 dark:ring-sky-800' },
  freeReturns:   { bg: 'bg-cyan-100 dark:bg-cyan-900/30',       text: 'text-cyan-800 dark:text-cyan-300',         ring: 'ring-cyan-200/60 dark:ring-cyan-800' },
  officialStore: { bg: 'bg-neutral-100 dark:bg-neutral-800',    text: 'text-neutral-800 dark:text-neutral-200',   ring: 'ring-neutral-200/60 dark:ring-neutral-700' },
  secureSeller:  { bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-800 dark:text-blue-300',         ring: 'ring-blue-200/60 dark:ring-blue-800' },
};

const LABEL = {
  verified: 'Verified seller',
  contactVerified: 'Contact verified',
  sponsored: 'Sponsored',
  upfricaChoice: "Upfrica’s Choice",
  topRated: 'Top rated',
  bestSeller: 'Best seller',
  limited: 'Limited stock',
  eco: 'Eco friendly',
  fastDispatch: 'Fast dispatch',
  freeShipping: 'Free shipping',
  freeReturns: 'Free returns',
  officialStore: 'Official store',
  secureSeller: 'Secure seller',
};

export default function TrustBadge({ kind, label, className = '', compact = false, as = 'span', ...rest }) {
  const Tag = as;
  const Icon = ICONS[kind] ?? FaShieldAlt;
  const palette = COLOR[kind] ?? COLOR.secureSeller;
  const text = label ?? LABEL[kind] ?? 'Badge';

  return (
    <Tag
      className={[
        'inline-flex items-center gap-1.5 rounded-full',
        'px-2.5 py-1 text-[11px] font-semibold ring-1',
        palette.bg, palette.text, palette.ring,
        compact ? 'px-2 py-0.5 text-[10px]' : '',
        className,
      ].join(' ')}
      aria-label={text}
      {...rest}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="leading-none">{text}</span>
    </Tag>
  );
}