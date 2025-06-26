'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleView } from '@/contexts/RoleViewContext';
import classNames from 'classnames';

const roleMap = {
  buyer: 'Buyer',
  seller_private: 'Seller (Private)',
  seller_business: 'Seller (Business)',
  agent: 'Sourcing Agent',
};

const badgeStyles = {
  buyer: 'bg-green-100 text-green-800',
  seller_private: 'bg-yellow-100 text-yellow-800',
  seller_business: 'bg-blue-100 text-blue-800',
  agent: 'bg-purple-100 text-purple-800',
};

const activeStyles = {
  buyer: 'bg-green-600 text-white',
  seller_private: 'bg-yellow-600 text-white',
  seller_business: 'bg-blue-600 text-white',
  agent: 'bg-purple-600 text-white',
};

// Normalize seller roles for switching logic
const normalizeRole = (role) =>
  role === 'seller_private' || role === 'seller_business' ? 'seller' : role;

// Parse account_type safely
function parseAccountType(value) {
  if (!value) return [];

  // If accidentally passed as ['{', 'b', 'u', 'y', 'e', 'r', '}']
  if (
    Array.isArray(value) &&
    value.length > 1 &&
    typeof value[0] === 'string' &&
    value.join('').startsWith('{') &&
    value.join('').endsWith('}')
  ) {
    const joined = value.join('');
    return joined
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^"|"$/g, ''));
  }

  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    if (value.startsWith('{') && value.endsWith('}')) {
      return value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''));
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    return [value];
  }

  return [];
}

export default function AccountTypeBadge() {
  const { user } = useAuth();
  const { roleView, setRoleView } = useRoleView();

  const roles = parseAccountType(user?.account_type);
  console.log('Raw account_type:', user?.account_type, typeof user?.account_type);
  console.log('Parsed roles:', roles); // ✅ Helpful for debug

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {roles.map((role) => {
        const normalized = normalizeRole(role);
        const isActive = roleView === normalized;

        return (
          <button
            key={role}
            onClick={() => {
              console.log(`[Switch] ${role} → ${normalized}`);
              setRoleView(normalized);
            }}
            className={classNames(
              'text-xs font-semibold px-3 py-1 rounded transition-all duration-150 shadow-sm',
              isActive ? activeStyles[role] : badgeStyles[role] || 'bg-gray-100 text-gray-700'
            )}
          >
            {roleMap[role] || role}
          </button>
        );
      })}
    </div>
  );
}