"use client";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname from Next.js

const Users = () => {
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

  const pathname = usePathname(); // Get the current route pathname

  return (
    <div className="container flex mt-10 gap-5">
      <div className="lg:w-[300px] text-base space-y-8 cursor-pointer">
        <h2 className="flex items-center gap-2">
          <IoArrowBack />
          Back to App
        </h2>
        <hr />
        <div>
          {dashboardData.map((data) => (
            <Link href={`/${data.value}`} key={data.id} passHref>
              <p
                className={`${
                  pathname === `/${data.value}` ? "text-blue-500 font-bold" : ""
                } cursor-pointer pt-5`}
              >
                {data.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
