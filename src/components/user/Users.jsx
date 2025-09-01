"use client";
import React, { useState } from "react";
import { IoArrowBack, IoMenu } from "react-icons/io5"; // 1) Import a hamburger icon or any icon you like
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMiniXMark } from "react-icons/hi2";

const Users = () => {
  const [isOpen, setIsOpen] = useState(false); // 2) Track whether mobile sidebar is open

  const dashboardData = [
    { id: 1, name: "Dashboard", value: "dashboard" },
    { id: 2, name: "Announcements", value: "announcements" },
    { id: 3, name: "Users", value: "users" },
    { id: 4, name: "User Connected Accounts", value: "userConnectedAccounts" },
    { id: 5, name: "Accounts", value: "accounts" },
    { id: 6, name: "Account Users", value: "accountUsers" },
    { id: 7, name: "Plans", value: "plans" },
    { id: 8, name: "Pay Customers", value: "payCustomers" },
    { id: 9, name: "Pay Charges", value: "payCharges" },
    { id: 10, name: "Pay Payment Methods", value: "payPaymentMethods" },
    { id: 11, name: "Pay Subscriptions", value: "paySubscriptions" },
    { id: 12, name: "Ads", value: "ads" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex">
      {/* 3) Mobile toggle button: hidden on lg screens */}
      <button
        className="lg:hidden p-4 text-gray-700"
        onClick={() => setIsOpen(true)} // open the sidebar
      >
        <IoMenu className="h-6 w-6" />
      </button>

      {/* 4) The Sidebar Container */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-screen lg:h-auto 
          w-64  bg-white border-r border-gray-200 p-4 
          transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        {/* "Back to App" row */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="flex items-center gap-2  text-base font-semibold w-[300px]">
            <IoArrowBack className="h-5 w-5" />
            Back
          </h2>
          {/* 6) Close button for mobile screens */}
          <button
            className="lg:hidden  text-sm text-gray-500 underline"
            onClick={() => setIsOpen(false)}
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </div>
        <hr />

        {/* 5) Links */}
        <div className="mt-4 space-y-4">
          {dashboardData.map((data) => (
            <Link href={`/${data.value}`} key={data.id} passHref>
              <p
                className={`cursor-pointer text-base lg:text-lg pb-2 font-medium 
                  ${pathname === `/${data.value}` ? "text-blue-500 font-bold" : "text-gray-700"} 
                  hover:text-blue-600
                `}
              >
                {data.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 7) Main Content Area (placeholder) */}
      {/* <div className="flex-1 ml-0 lg:ml-64 p-4">
        <h1 className="text-xl font-bold">Main Content</h1>
        <p className="mt-2 text-gray-600">
          This is where your page content goes.
        </p>
      </div> */}
    </div>
  );
};

export default Users;
