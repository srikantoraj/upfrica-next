'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Bell, Sun, Moon, ChevronDown, Globe, Settings,
  CheckCircle2, AlertTriangle, Check, PanelLeft, PanelLeftOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useTheme from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleView } from '@/contexts/RoleViewContext';
import AccountTypeBadge from '@/components/common/AccountTypeBadge';

const TopBar = ({ toggleMobileSidebar, toggleDesktopSidebar, sidebarVisible }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { roleView } = useRoleView();
  const { user } = useAuth();

  const [themeDropdown, setThemeDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = (setter) => setter((prev) => !prev);
  const closeAll = () => {
    setThemeDropdown(false);
    setLangDropdown(false);
    setNotifDropdown(false);
    setProfileDropdown(false);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const notifications = [
    { id: 1, type: 'info', message: 'You have 2 new orders.' },
    { id: 2, type: 'success', message: 'Product uploaded successfully!' },
    { id: 3, type: 'warning', message: 'Low stock on 5 products.' },
  ];

  const logoSrc =
    theme === 'dark'
      ? 'https://upfrica-production.s3.eu-west-2.amazonaws.com/upfrica-com-logo-white_170x.webp'
      : 'https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp';

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-upfrica px-4 py-2">
      <div className="flex justify-between items-center w-full">
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            onClick={() => toggleMobileSidebar(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={toggleDesktopSidebar}
            className="hidden md:flex items-center gap-1 px-2 py-1 text-sm rounded-md border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {sidebarVisible ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>

          <Link href="/">
            <img src={logoSrc} alt="Upfrica Logo" className="w-[80px] md:w-[100px] h-auto" />
          </Link>
        </div>

        {/* Center: Search */}
        <form className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded px-3 py-1 w-full max-w-md mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-3 relative text-gray-700 dark:text-gray-200" ref={dropdownRef}>
          {roleView && (
            <div className="hidden md:block">
              <AccountTypeBadge />
            </div>
          )}

          {/* Theme Switch */}
          <div className="relative">
            <button onClick={() => toggle(setThemeDropdown)} className="p-1">
              <Sun className="w-5 h-5" />
            </button>
            {themeDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow z-50">
                {['dark', 'light', 'system'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {mode === 'dark' && <Moon className="w-4 h-4" />}
                      {mode === 'light' && <Sun className="w-4 h-4" />}
                      {mode === 'system' && <span className="text-lg">🖥️</span>}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
                    {theme === mode && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button onClick={() => toggle(setLangDropdown)} className="p-1">
              <Globe className="w-5 h-5" />
            </button>
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow z-50">
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">English (UK)</button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">Français (FR)</button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => toggle(setNotifDropdown)} className="p-1 relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {notifDropdown && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 bg-white dark:bg-gray-800 border rounded shadow z-50 flex flex-col">
                <div className="px-3 py-2 font-semibold text-sm border-b">Notifications</div>
                <div className="flex-1 overflow-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />}
                      {n.type === 'info' && <Bell className="w-4 h-4 text-blue-500 mt-1" />}
                      <span>{n.message}</span>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => router.push('/notifications')}
                  className="px-3 py-2 text-xs text-brand hover:underline cursor-pointer border-t"
                >
                  View all notifications →
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-1" onClick={() => router.push('/settings')}>
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => toggle(setProfileDropdown)} className="flex items-center gap-1 p-1 hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-bold flex items-center justify-center text-gray-800 dark:text-white">
                {(user?.first_name?.[0] || 'U') + (user?.last_name?.[0] || '')}
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded shadow z-50">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold">{user?.first_name || 'User'} {user?.last_name || ''}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => router.push('/logout')}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;