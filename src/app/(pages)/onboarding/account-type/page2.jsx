'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const accountTypes = [
  {
    key: 'buyer',
    title: 'Buyer',
    description: 'Browse and buy products, save items, and track orders easily.',
    emoji: '🛍️',
    badge: 'Most Common',
  },
  {
    key: 'seller_private',
    title: 'Seller (Private)',
    emoji: '👩🏾‍💼',
    badge: 'Most Common',
  },
  {
    key: 'seller_business',
    title: 'Seller (Business)',
    description: 'List bulk or professional inventory, access advanced tools.',
    emoji: '🏢',
    badge: 'Most Common',
  },
  {
    key: 'agent',
    title: 'Sourcing Agent',
    description: 'Help buyers collect or verify items and earn commissions.',
    emoji: '🚚',
  },
];

export default function AccountTypePage() {
  const router = useRouter();
  const { user, token, refreshUser } = useAuth();
  const [selected, setSelected] = useState(null);

  const handleSelect = (type) => {
    setSelected(type);
  };

  const handleContinue = async () => {
    if (!selected) return;
    try {
      const res = await fetch('/api/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ account_type: selected }),
      });

      if (res.ok) {
        await refreshUser();
        router.push('/dashboard');
      } else {
        console.error('❌ Failed to update account type');
      }
    } catch (err) {
      console.error('❌ Error:', err);
    }
  };

  // ⬇️ Auto-scroll to button after selection
  useEffect(() => {
    if (selected) {
      const el = document.getElementById('continue-btn');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selected]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-12 pb-24 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-2">Welcome to <span className="text-purple-600">Upfrica!</span></h1>
      <p className="text-gray-600 mb-8 text-center">What do you want to do today?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {accountTypes.map((type) => (
          <div
            key={type.key}
            onClick={() => handleSelect(type.key)}
            className={`cursor-pointer border rounded-2xl p-6 text-center transition-all duration-300 ${
              selected === type.key
                ? 'border-purple-500 ring-2 ring-purple-500 bg-white'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="text-5xl mb-3">{type.emoji}</div>
            <h3 className="text-lg font-semibold">{type.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            {type.badge && (
              <div className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {type.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⬇️ Sticky bottom continue button */}
      <div
        id="continue-btn"
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-4 shadow-lg flex justify-center z-50"
      >
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full max-w-xs py-3 rounded-full font-semibold text-white transition ${
            selected
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}