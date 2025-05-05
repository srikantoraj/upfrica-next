"use client";

import { menuItems } from "@/components/menuItems";
import Link from "next/link";
import React, { useState } from "react";
import { FaChevronRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { usePathname } from "next/navigation"; // ✅ correct for Next.js
import { useDispatch } from "react-redux";
import { clearToggle } from "@/app/store/slices/toggleSlice";
import { RxCross2 } from "react-icons/rx";


const DashbordSearchBer = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname(); // ✅ replace useLocation
  const dispatch = useDispatch();

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleClose = () =>{
    dispatch(clearToggle())

  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen  pt-10 px-4">
      <div className="flex justify-between items-center ">
        <img
          className="h-auto w-[80px] md:w-[100px]"

          src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
          alt="Upfrica Logo"
        />
        <RxCross2 onClick={handleClose} className="h-5 w-5 cursor-pointer" />
      </div>
      <ul className="py-4 space-y-5">
        {menuItems.map((item, index) => {
          const isActive = pathname.startsWith(item.route);

          return (
            <li className="" key={index}>
              <div
                className={`flex items-center justify-between px-4 py-2  cursor-pointer hover:bg-gray-100 transition ${isActive ? "bg-gray-100 font-semibold" : ""
                  }`}
                onClick={() => toggleMenu(index)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="text-gray-600" />
                  <span>{item.label}</span>
                </div>
                {item.children && (
                  <FaChevronRight
                    className={`transition-transform duration-200 ${openMenu === index ? "rotate-90" : ""
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
                        className={`block px-2 py-1 rounded hover:bg-gray-200 ${pathname === child.route
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