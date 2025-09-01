"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { clearToggle } from "@/app/store/slices/toggleSlice";
import AccountTypeBadge from "../common/AccountTypeBadge";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "My Orders", href: "/orders", icon: "📦" },
  { label: "Saved Items", href: "/saved", icon: "❤️" },
  { label: "BNPL Orders", href: "/bnpl/orders", icon: "🧾" },
  { label: "Profile Settings", href: "/settings/profile", icon: "👤" },
  { label: "Help Center", href: "/help", icon: "🆘" },
];

const BuyerSidebar = () => {
  const toggle = useSelector((state) => state.toggle.toggle);
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Auto-close on route change
  useEffect(() => {
    if (toggle) {
      dispatch(clearToggle());
    }
  }, [pathname]);

  return (
    <>
      {/* Backdrop only on mobile */}
      {toggle && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={() => dispatch(clearToggle())}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 z-50 h-screen overflow-y-auto bg-white shadow-md transition-all duration-300 ease-in-out",
          "xl:relative xl:z-auto xl:opacity-100 xl:translate-x-0",
          toggle
            ? "w-64 opacity-100 translate-x-0"
            : "w-0 -translate-x-full xl:w-64",
        )}
      >
        <div className="p-4 text-sm text-gray-800">
          <AccountTypeBadge />

          <ul className="mt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => dispatch(clearToggle())}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                      isActive
                        ? "bg-purple-100 text-purple-800 font-semibold"
                        : "hover:bg-gray-100 text-gray-800",
                    )}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BuyerSidebar;
