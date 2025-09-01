"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// React Icons (Font Awesome)
import {
  FaHome,
  FaRegEdit,
  FaThLarge,
  FaSignInAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaChevronRight,
  FaTable,
  FaCog,
  FaEllipsisH,
  FaChartBar,
} from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion import
import { clearToggle } from "@/app/store/slices/toggleSlice";

export default function Sidebar() {
  const pathname = usePathname();
  const toggle = useSelector((state) => state.toggle.toggle);
  const dispatch = useDispatch();

  // যেসব আইটেমে সাবমেনু আছে, সেগুলো ট্র্যাক রাখার জন্য
  const [openDropdown, setOpenDropdown] = useState("");

  // মেনু আইটেম লিস্ট
  const menuItems = [
    {
      label: "Dashboard",
      route: "/dashboard/chart",
      icon: FaHome,
      children: [
        { label: "Sales & Revenue", route: "/dashboard/revenue" },
        { label: "Live Tour Items", route: "/dashboard/live-tour-items" },
        { label: "Live Hotel Items", route: "/dashboard/live-hotel-items" },
        { label: "All Bookings", route: "/dashboard/all-bookings" },
        { label: "All Payments", route: "/dashboard/all-payments" },
        { label: "Visa manament", route: "/dashboard/visa-management" },
        { label: "All Users", route: "/dashboard/all-users" },
        { label: "All Stories", route: "/dashboard/stories" },
        { label: "All Videos", route: "/dashboard/videos" },
      ],
    },

    {
      label: "Profile",
      route: "/profile",
      icon: FaUserCircle,
    },
    {
      label: "Create Itineraries",
      route: "#",
      icon: FaRegEdit,
      children: [
        {
          label: "Create Tour Itinerary",
          route: "/dashboard/create-tour-itienrary",
        },
        { label: "Add new Hotel", route: "/dashboard/create-hotel-itienrary" },
        { label: "Add new Story", route: "/dashboard/add-new-story" },
        { label: "Add new Video", route: "/dashboard/add-new-video" },
      ],
    },

    {
      label: "Settings",
      route: "/settings",
      icon: FaCog,
    },
    {
      label: "Others",
      route: "/others",
      icon: FaEllipsisH,
    },
    {
      label: "Analytics",
      route: "/dashboard/chart",
      icon: FaChartBar,
    },
    {
      label: "Upadte Pages UI",
      route: "#",
      icon: FaThLarge,
      // children: [
      //   { label: "Buttons", route: "/ui/buttons" },
      //   { label: "Alerts", route: "/ui/alerts" },
      // ],
    },
    {
      label: "Sign Out",
      route: "#",
      icon: FaSignInAlt,
    },
  ];

  // Dropdown টগল
  const handleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? "" : label));
  };

  // Route active চেক
  const isActive = (route) => {
    return pathname === route;
  };

  // মোবাইল সাইডবার বন্ধ করা
  const handleCloseSidebar = () => {
    dispatch(clearToggle());
  };

  return (
    <>
      {/* Small & Medium Device Sidebar (toggle===true হলে দেখাবে) */}
      <AnimatePresence>
        {toggle && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-64 fixed min-h-screen top-0 bg-gray-50 border-r border-gray-200 shadow-md xl:hidden flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4">
              <div className="text-xl font-semibold">My Sidebar</div>
              {/* Close Button */}
              <div onClick={handleCloseSidebar}>
                <FiArrowLeft className="h-5 w-5 cursor-pointer" />
              </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item, index) => {
                const hasChildren = !!item.children;
                const isDropdownOpen = openDropdown === item.label;

                return (
                  <div key={index}>
                    {/* যদি children থাকে: একটা button দেখাবো; নেই তো সরাসরি Link */}
                    {hasChildren ? (
                      <button
                        onClick={() => handleDropdown(item.label)}
                        className={`w-full flex items-center justify-between
                          px-3 py-3 rounded-md text-gray-700 hover:bg-gray-200 
                          transition-colors ${
                            isActive(item.route) && !hasChildren
                              ? "bg-gray-200 font-bold py-2"
                              : ""
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        <FaChevronUp
                          className={`w-3 h-3 transition-transform ${
                            isDropdownOpen ? "rotate-180" : "rotate-180"
                          }`}
                        />
                      </button>
                    ) : (
                      /* children না থাকলে সরাসরি Link ব্যবহার করে, 
                         লিঙ্কে onClick={() => handleCloseSidebar()} */
                      <Link
                        href={item.route}
                        onClick={handleCloseSidebar}
                        className={`flex items-center gap-4 px-3 py-3 
                          rounded-md text-gray-700 hover:bg-gray-200 
                          transition-colors ${
                            isActive(item.route) ? "bg-gray-200 font-bold" : ""
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    )}

                    {/* সাবমেনু (dropdown) */}
                    {hasChildren && isDropdownOpen && (
                      <div className="ml-7 mt-1 space-y-3">
                        {item.children.map((child, cIndex) => (
                          <Link
                            key={cIndex}
                            href={child.route}
                            // এখানে onClick={handleCloseSidebar} দিলে
                            // লিঙ্কে ক্লিক করলেই মোবাইল সাইডবার বন্ধ হবে
                            onClick={handleCloseSidebar}
                            className={`
                              block px-3 py-1 rounded-md text-sm 
                              text-gray-600 hover:bg-gray-100 hover:text-gray-900 
                              ${
                                isActive(child.route)
                                  ? "bg-gray-100 font-semibold py-2"
                                  : ""
                              }
                            `}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Large Device Sidebar */}
      <aside
        className={`w-64 fixed min-h-screen top-0 bg-gray-50 border-r border-gray-200 hidden xl:flex flex-col`}
      >
        {/* Sidebar Header (optional) */}
        {/* <div className="p-4 border-b text-xl font-semibold">My Sidebar</div> */}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const hasChildren = !!item.children;
            const isDropdownOpen = openDropdown === item.label;

            return (
              <div key={index}>
                {/* আবার একই লজিক, বড় স্ক্রিনের জন্য */}
                {hasChildren ? (
                  <button
                    onClick={() => handleDropdown(item.label)}
                    className={`w-full flex items-center justify-between
                      px-3 py-3 rounded-md text-gray-700 hover:bg-gray-200 
                      transition-colors ${
                        isActive(item.route) && !hasChildren
                          ? "bg-gray-200 font-bold py-2"
                          : ""
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <FaChevronUp
                      className={`w-3 h-3 transition-transform ${
                        isDropdownOpen ? "rotate-180" : "rotate-180"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.route}
                    className={`flex items-center gap-4 px-3 py-3 
                      rounded-md text-gray-700 hover:bg-gray-200 
                      transition-colors ${
                        isActive(item.route) ? "bg-gray-200 font-bold" : ""
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )}

                {/* সাবমেনু (ড্রপডাউন) */}
                {hasChildren && isDropdownOpen && (
                  <div className="ml-7 mt-1 space-y-3">
                    {item.children.map((child, cIndex) => (
                      <Link
                        key={cIndex}
                        href={child.route}
                        className={`
                          block px-3 py-1 rounded-md text-sm 
                          text-gray-600 hover:bg-gray-100 hover:text-gray-900 
                          ${
                            isActive(child.route)
                              ? "bg-gray-100 font-semibold py-2"
                              : ""
                          }
                        `}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
