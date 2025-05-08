"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { RxCross2 } from "react-icons/rx";
import { FaChevronRight } from "react-icons/fa";

import { menuItems } from "@/components/menuItems";
import { clearToggle } from "@/app/store/slices/toggleSlice";

const DashbordSearchBer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.toggle.toggle);
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (idx) =>
    setOpenMenu((prev) => (prev === idx ? null : idx));
  const handleClose = () => dispatch(clearToggle());

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-20 h-screen pt-10 px-4",
          // animate transform over 700ms
          "transform transition-transform duration-700 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img
            src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
            alt="Upfrica Logo"
            className="w-20 md:w-24"
          />
          <RxCross2
            onClick={handleClose}
            className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
          />
        </div>

        {/* Menu */}
        <ul className="space-y-4">
          {menuItems.map((item, idx) => {
            const isActive = pathname.startsWith(item.route);
            return (
              <li key={idx}>
                <div
                  onClick={() => toggleMenu(idx)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors",
                    isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="text-gray-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.children && (
                    <FaChevronRight
                      className={clsx(
                        "transition-transform duration-200",
                        openMenu === idx && "rotate-90"
                      )}
                    />
                  )}
                </div>
                {item.children && openMenu === idx && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.children.map((child, cidx) => (
                      <li key={cidx}>
                        <Link
                          href={child.route}
                          className={clsx(
                            "block px-3 py-1 rounded hover:bg-gray-200 transition-colors",
                            pathname === child.route &&
                            "text-blue-600 font-medium"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black bg-opacity-30 z-10",
          // animate opacity over 500ms
          "transition-opacity duration-500 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />
    </>
  );
};

export default DashbordSearchBer;
