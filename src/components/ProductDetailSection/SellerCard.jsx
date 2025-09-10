// src/components/ProductDetailSection/SellerCard.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/contexts/LocalizationProvider';
import { withCountryPrefix } from '@/lib/locale-routing';
import RatingPopover from '@/components/review/RatingPopover';
import { FiChevronDown } from 'react-icons/fi';

function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span aria-hidden className="text-yellow-500">
      {'★'.repeat(full)}
      {half ? '☆' : ''}
      {'✩'.repeat(empty)}
    </span>
  );
}

export default function SellerCard({
  shop,
  user,
  secondaryData,
  reviewStats, // { average_rating, review_count, rating_percent? }
}) {
  const { country: cc, resolvedLanguage } = useLocalization();

  const sold = Number(secondaryData?.sold_count || 0);
  const rating = Number(reviewStats?.average_rating || 0);
  const count  = Number(reviewStats?.review_count || 0);
  const breakdown = reviewStats?.rating_percent || reviewStats?.distribution || {};

  const nf = React.useMemo(
    () => new Intl.NumberFormat(resolvedLanguage || 'en'),
    [resolvedLanguage]
  );

  const shopHref = shop?.slug ? withCountryPrefix(cc, `/shops/${shop.slug}`) : null;
  const sellerPlace = [user?.town, user?.country].filter(Boolean).join(', ') || '—';

  // popover state + hover intent timer
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef(null);
  const closeTimer = React.useRef(null);

  const openNow = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);
  const closeSoon = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, []);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 border-[var(--line,#e5e7eb)] space-y-1">
      {/* Top meta */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {sold > 0 && (
          <>
            <b>{nf.format(sold)} sold</b>
            <span className="mx-1">•</span>
          </>
        )}
        <span>Ships from {sellerPlace}</span>
      </div>

      {/* Shop link / seller name */}
      <div className="text-sm">
        {shopHref ? (
          <Link className="text-[#8710D8] font-semibold hover:underline" href={shopHref}>
            Visit {shop.name} →
          </Link>
        ) : (
          <span className="font-semibold text-[#8710D8]">
            {user?.username || 'Seller'}
          </span>
        )}
      </div>

      {/* Rating trigger + sticky popover */}
      {count > 0 && (
        <div
          ref={wrapperRef}
          className="relative inline-block"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}         // tap on mobile
            onFocus={openNow}
            onBlur={closeSoon}
            className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 hover:underline"
            aria-haspopup="dialog"
            aria-expanded={open ? 'true' : 'false'}
            aria-controls="rating-breakdown"
          >
            <Stars rating={rating} />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500 dark:text-gray-400">
              ({nf.format(count)} reviews)
            </span>
            <FiChevronDown
              aria-hidden
              className={`ml-0.5 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div
              id="rating-breakdown"
              // Keep open while hovering the panel
              onMouseEnter={openNow}
              onMouseLeave={closeSoon}
            >
              <RatingPopover
                average={rating}
                count={count}
                breakdown={breakdown}
                anchorHref="#reviews"
                onRequestClose={() => setOpen(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}