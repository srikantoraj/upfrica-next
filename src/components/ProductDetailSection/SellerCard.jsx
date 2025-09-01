'use client';

import React from 'react';
import Link from 'next/link';

export default function SellerCard({
  shop,          // { slug, name }
  user,          // { username, town, country }
  secondaryData, // { sold_count }
  reviewStats,   // { average_rating, review_count }
}) {
  const sold = secondaryData?.sold_count;
  const rating = Number(reviewStats?.average_rating || 0);
  const count  = Number(reviewStats?.review_count || 0);

  return (
    <div className="p-4 border rounded-xl bg-white space-y-1">
      <div className="text-sm text-gray-600">
        {sold > 0 && <b>{sold} sold</b>} {sold > 0 && ' — '}
        {shop ? (
          <>Visit <Link className="text-[#8710D8] font-semibold hover:underline" href={`/shops/${shop.slug}`}>{shop.name}</Link></>
        ) : (
          <b className="text-[#8710D8]">{user?.username}</b>
        )}{' '}
        — {user?.town}, {user?.country}
      </div>

      {count > 0 && (
        <a href="#reviews" className="inline-flex items-center gap-1 text-sm text-gray-700 hover:underline">
          <span className="text-yellow-500">
            {'⭐'.repeat(Math.floor(rating))}
            {rating % 1 >= 0.5 && '☆'}
          </span>
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-500">({count} reviews)</span>
        </a>
      )}
    </div>
  );
}