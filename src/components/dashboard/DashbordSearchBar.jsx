

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearToggle } from "@/app/store/slices/toggleSlice";
import { RxCross2 } from "react-icons/rx";
import { FaChevronRight } from "react-icons/fa";
import { menuItems } from "@/components/menuItems";

const DashbordSearchBar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleToggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleSidebarClose = () => {
    dispatch(clearToggle());
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg px-4 pt-10">
      {/* Logo & Close Button */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <img
            src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
            alt="Upfrica Logo"
            className="w-[80px] md:w-[100px] h-auto"
          />
        </Link>
        <RxCross2
          onClick={handleSidebarClose}
          className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500 transition"
        />
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-5">
        {menuItems.map((item, index) => {
          // const isActive = pathname.startsWith(item.route);
          const isOpen = openMenu === index;

          return (
            <li key={index}>
              <div
                className={`flex items-center justify-between px-4 py-2 cursor-pointer  transition rounded-md ${isOpen ? "bg-blue-100 font-semibold text-blue-400" :  ""
                  }`}
                onClick={() => handleToggleMenu(index)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="" />
                  <span>{item.label}</span>
                </div>
                {item.children && (
                  <FaChevronRight
                    className={`transition-transform duration-200 ${isOpen ? "rotate-90 " : ""
                      }`}
                  />
                )}
              </div>

              {/* Submenu */}
              {item.children && isOpen && (
                <ul className="ml-8 mt-1 space-y-1 text-gray-600 ">
                  {item.children.map((child, childIdx) => {
                    const isChildActive = pathname === child.route;
                    return (
                      <li className={`list-disc ${isChildActive ? "text-blue-600 font-medium" : ""
                        }`} key={childIdx}>
                        <Link
                          href={child.route}
                          className={`block px-2 py-1 rounded hover:bg-gray-200  `}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default DashbordSearchBar;
