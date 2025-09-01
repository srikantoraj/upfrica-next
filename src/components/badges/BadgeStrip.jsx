'use client';
import React from 'react';
import BadgePill from './BadgePill';

export default function BadgeStrip({ keys = [], className = '', onContactClick }) {
  if (!Array.isArray(keys) || !keys.length) return null;

  return (
    <div
      className={[
        // one horizontal row that can scroll; never wrap on md+
        'min-w-0 flex flex-nowrap whitespace-nowrap gap-2 md:gap-3',
        'overflow-x-auto',
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        'snap-x snap-mandatory',
        className,
      ].join(' ')}
      role="list"
      aria-label="Shop badges"
    >
      {keys.map((k) => (
        <div key={k} role="listitem" className="shrink-0 snap-start">
          <BadgePill
            type={k}
            asButton={k === 'contactVerified'}
            onClick={k === 'contactVerified' ? onContactClick : undefined}
          />
        </div>
      ))}
    </div>
  );
}