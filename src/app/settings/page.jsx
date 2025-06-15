'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const settings = [
  { label: 'Store Details', href: '/settings/store' },
  { label: 'Shipping', href: '/settings/shipping' },
  { label: 'Payments', href: '/settings/payments' },
  { label: 'Taxes', href: '/settings/taxes' },
];

export default function StoreSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 ">Settings</h1>
    <div className="bg-white p-4 rounded-xl border py-6 border-gray-200 dark:border-gray-800 shadow-md">
      <div className="space-y-4">
        {settings.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <span className="text-base font-medium text-gray-800">{item.label}</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}