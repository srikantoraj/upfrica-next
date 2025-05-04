"use client";

import { menuItems } from "@/components/menuItems";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { usePathname } from "next/navigation"; // ✅ correct for Next.js

const DashbordSearchBer = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname(); // ✅ replace useLocation

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen overflow-y-auto pt-10">
      <ul className="py-4 space-y-5">
        {menuItems.map((item, index) => {
          const isActive = pathname.startsWith(item.route);

          return (
            <li className="" key={index}>
              <div
                className={`flex items-center justify-between px-4 py-2  cursor-pointer hover:bg-gray-100 transition ${
                  isActive ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => toggleMenu(index)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="text-gray-600" />
                  <span>{item.label}</span>
                </div>
                {item.children && (
                  <FaChevronRight
                    className={`transition-transform duration-200 ${
                      openMenu === index ? "rotate-90" : ""
                    }`}
                  />
                )}
              </div>

              {item.children && openMenu === index && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.children.map((child, childIdx) => (
                    <li key={childIdx}>
                      <Link
                        href={child.route}
                        className={`block px-2 py-1 rounded hover:bg-gray-200 ${
                          pathname === child.route
                            ? "text-blue-600 font-medium"
                            : ""
                        }`}
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
  );
};

export default DashbordSearchBer;