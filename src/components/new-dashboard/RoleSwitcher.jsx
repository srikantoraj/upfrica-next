//src/components/new-dashboard/RoleSwitcher.jsx
'use client';
'use client';

import React, { useEffect } from 'react';

import { useRoleView } from '@/contexts/RoleViewContext';
import { useAuth } from '@/contexts/AuthContext';
import classNames from 'classnames';

const roleConfig = {
  buyer: {
    label: 'Buyer',
    emoji: '🛍️',
    active: 'bg-emerald-600 text-white',
    inactive: 'hover:bg-emerald-100 text-gray-700 dark:text-gray-200',
  },
  seller: {
    label: 'Seller',
    emoji: '🏪',
    active: 'bg-orange-600 text-white',
    inactive: 'hover:bg-orange-100 text-gray-700 dark:text-gray-200',
  },
  agent: {
    label: 'Agent',
    emoji: '🧭',
    active: 'bg-indigo-600 text-white',
    inactive: 'hover:bg-indigo-100 text-gray-700 dark:text-gray-200',
  },
};

export default function RoleSwitcher() {
const { roleView, setRoleView } = useRoleView();
const { user } = useAuth();

const roles = Array.isArray(user?.account_type)
  ? user.account_type
  : user?.account_type
  ? [user.account_type]
  : [];

const hasSeller = roles.includes('seller_private') || roles.includes('seller_business');
const hasAgent = roles.includes('agent');

const roleButtons = [];
if (roles.includes('buyer')) roleButtons.push('buyer');
if (hasSeller) roleButtons.push('seller');
if (hasAgent) roleButtons.push('agent');

// 🟢 Auto-set default if needed
useEffect(() => {
  if (!roleView && roleButtons.length > 0) {
    setRoleView(roleButtons[0]);
  }
}, [roleView, roleButtons]);

if (roleButtons.length === 0) return null;

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div className="flex rounded-full overflow-hidden border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm">
        {roleButtons.map((role) => (
          <button
            key={role}
            onClick={() => setRoleView(role)}
            className={classNames(
              'px-4 py-1 text-xs font-semibold transition-all duration-200 ease-in-out flex items-center gap-1',
              roleView === role
                ? `${roleConfig[role].active} ring-2 ring-offset-1 ring-${role === 'buyer' ? 'emerald' : role === 'seller' ? 'orange' : 'indigo'}-300`
                : roleConfig[role].inactive
            )}
          >
            <span>{roleConfig[role].emoji}</span>
            <span>{roleConfig[role].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}