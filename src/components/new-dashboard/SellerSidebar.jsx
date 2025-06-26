// src/components/new-dashboard/SellerSidebar.jsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { clearToggle } from '@/app/store/slices/toggleSlice';
import RoleSwitcher from '@/components/new-dashboard/RoleSwitcher';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BarChart2,
  Target,
  Store,
  CreditCard,
  BadgeDollarSign,
  Layers,
  User,
  Heart,
  HelpCircle,
  Settings,
  X,
} from 'lucide-react';
import { useRoleView } from '@/contexts/RoleViewContext';

const sellerItems = [
  { label: 'Seller Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Products', href: '/products', icon: Package },
  { label: 'Sales Orders', href: '/orders/sales', icon: ShoppingCart },
  { label: 'Shipping Zones', href: '/shipping/zones', icon: Truck },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Marketing Tools', href: '/marketing', icon: Target },
  { label: 'Store Settings', href: '/store/settings', icon: Store },
  { label: 'Payouts', href: '/payouts', icon: BadgeDollarSign },
  { label: 'Plan & Add-ons', href: '/plans', icon: Layers },
];

const buyerItems = [
  { label: 'Buyer Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Saved Items', href: '/wishlist', icon: Heart },
  { label: 'BNPL Orders', href: '/bnpl', icon: CreditCard },
  { label: 'Profile Settings', href: '/settings/profile', icon: User },
  { label: 'Help Center', href: '/help', icon: HelpCircle },
];

export default function SellerSidebar({ sidebarVisible, mobileOpen, toggleMobile, sidebarRef }) {
  const toggle = useSelector((state) => state.toggle.toggle);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { roleView } = useRoleView();

  useEffect(() => {
    if (toggle) dispatch(clearToggle());
  }, [pathname]);

  const handleClose = () => {
    dispatch(clearToggle());
    if (toggleMobile) toggleMobile(false);
  };

  const navItems = roleView?.includes('seller') ? sellerItems : buyerItems;

  return (
    <aside
      ref={sidebarRef}
      className={clsx(
        `fixed md:static z-40 w-64 h-screen flex flex-col border-r shadow-lg transition-transform duration-300 bg-white dark:bg-[#111827]`,
        {
          'translate-x-0': mobileOpen,
          '-translate-x-full': !mobileOpen,
          'md:translate-x-0': true,
          'hidden': !sidebarVisible,
          'block': sidebarVisible,
        }
      )}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 pt-4 mb-2 md:hidden">
        <span className="font-bold text-gray-800 dark:text-white">Sidebar</span>
        <button onClick={handleClose}>
          <X className="w-5 h-5 text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Sidebar Content with footer pinned */}
      <div className="flex flex-col justify-between h-[70%]">
        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="font-semibold mb-4 hidden md:block text-gray-800 dark:text-white">Sidebar</div>
          <div className="md:hidden mb-4">
            <RoleSwitcher />
          </div>

          <nav className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-purple-100 text-purple-800 font-semibold dark:bg-purple-900 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <Link
            href="/settings"
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
