// src/components/ProductDetailSection/SellerCard.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/contexts/LocalizationProvider';
import { withCountryPrefix } from '@/lib/locale-routing';

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
  shop,          // { slug, name }
  user,          // { username, town, country }
  secondaryData, // { sold_count }
  reviewStats,   // { average_rating, review_count }
}) {
  const { country: cc, resolvedLanguage } = useLocalization();

  const sold = Number(secondaryData?.sold_count || 0);
  const rating = Number(reviewStats?.average_rating || 0);
  const count  = Number(reviewStats?.review_count || 0);

  const nf = React.useMemo(
    () => new Intl.NumberFormat(resolvedLanguage || 'en'),
    [resolvedLanguage]
  );

  const shopHref =
    shop?.slug ? withCountryPrefix(cc, `/shops/${shop.slug}`) : null;

  const sellerPlace =
    [user?.town, user?.country].filter(Boolean).join(', ') || '—';

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-900 border-[var(--line,#e5e7eb)] space-y-1">
      {/* Top meta row */}
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
          <Link
            className="text-[#8710D8] font-semibold hover:underline"
            href={shopHref}
          >
            Visit {shop.name} →
          </Link>
        ) : (
          <span className="font-semibold text-[#8710D8]">
            {user?.username || 'Seller'}
          </span>
        )}
      </div>

      {/* Rating */}
      {count > 0 && (
        <a
          href="#reviews"
          className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 hover:underline"
          aria-label={`Rating ${rating.toFixed(1)} out of 5 from ${nf.format(
            count
          )} reviews`}
        >
          <Stars rating={rating} />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-500 dark:text-gray-400">
            ({nf.format(count)} reviews)
          </span>
        </a>
      )}
    </div>
  );
}