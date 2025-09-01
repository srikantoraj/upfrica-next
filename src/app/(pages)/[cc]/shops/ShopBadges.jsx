'use client';

import React from 'react';
import BadgeStrip from '@/components/badges/BadgeStrip';

export default function ShopBadges({
  badgeKeys = ['verified','contactVerified','officialStore','secureSeller'],
  showContact = true,
  hasContact = false,
  onContactClick,
  className = '',
  sticky = true,
}) {
  const showBtn = Boolean((showContact ?? hasContact) && hasContact && onContactClick);

  return (
    <div
      className={[
        'mx-auto max-w-6xl w-full px-3 md:px-4',
        sticky ? 'sticky top-2 md:top-4 z-20' : '',
        className,
      ].join(' ')}
    >
      <div
        className={[
          // single line row; center vertically
          'flex items-center justify-between gap-3 md:gap-4',
          'bg-white/80 dark:bg-neutral-900/70 backdrop-blur',
          'rounded-full border border-neutral-200 dark:border-neutral-800',
          'px-3 md:px-4 py-2 shadow-sm',
          'min-h-[44px]',
        ].join(' ')}
        aria-label="Shop badges and contact"
      >
        {/* badges: flex-1 + min-w-0 so it scrolls instead of wrapping */}
        <BadgeStrip
          keys={badgeKeys}
          className="flex-1 min-w-0"
          onContactClick={onContactClick}
        />

        {/* CTA pinned right (desktop only) */}
        {showBtn && (
          <button
            type="button"
            onClick={onContactClick}
            className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-900/50 px-3 py-1.5 text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-haspopup="dialog"
            aria-controls="contact-sheet"
          >
            <span className="text-base leading-none">📞</span>
            Contact seller
          </button>
        )}
      </div>
    </div>
  );
}