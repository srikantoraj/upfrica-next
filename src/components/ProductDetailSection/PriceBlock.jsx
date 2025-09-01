'use client';

import React from 'react';
import { FaTruck } from 'react-icons/fa';
import TrustBadges from './TrustBadges';

export default function PriceBlock({
  symbol = '₵',
  activePrice,            // string: "123.45"
  originalPrice = null,   // string | null
  saleActive = false,
  timeRemaining = {},     // {days,hours,minutes,seconds}
  postage_fee_cents = 0,
}) {
  return (
    <div className="space-y-2">
      {/* Price */}
      <div>
        {saleActive ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-700">
              {symbol}{activePrice}
            </span>
            {originalPrice && (
              <del className="text-gray-400">
                {symbol}{originalPrice}
              </del>
            )}
          </div>
        ) : (
          <span className="text-2xl font-bold text-green-700">
            {symbol}{activePrice}
          </span>
        )}
      </div>

      {/* Countdown */}
      {saleActive && (
        <p className="text-sm text-red-700 font-medium">
          Sale ends in{' '}
          {timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ''}
          {String(timeRemaining.hours ?? 0).padStart(2, '0')}:
          {String(timeRemaining.minutes ?? 0).padStart(2, '0')}:
          {String(timeRemaining.seconds ?? 0).padStart(2, '0')}
        </p>
      )}

      {/* Delivery */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaTruck className="text-lg" />
        {postage_fee_cents > 0 ? (
          <span>Postage fee: {symbol}{(postage_fee_cents / 100).toFixed(2)}</span>
        ) : (
          <span className="text-green-600 font-semibold">Free delivery</span>
        )}
      </div>

      {/* Trust badges */}
      <TrustBadges />
    </div>
  );
}