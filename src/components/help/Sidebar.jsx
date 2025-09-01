"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/shop-management", label: "Shop Management" },
  { href: "/orders-shipping", label: "Orders & Shipping" },
  { href: "/listings", label: "Listings" },
  { href: "/finances", label: "Finances" },
  { href: "/marketing-promotions", label: "Marketing & Promotions" },
  { href: "/start-selling", label: "Start Selling on Etsy" },
  { href: "/your-etsy-account", label: "Your Etsy Account" },
];

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("/shop-management");

  const handleClick = (href) => {
    setActiveLink(href);
  };

  return (
    <aside className="lg:w-1/4" id="sect-sidebar">
      <div className="cat-sidebar list-unstyled ">
        <ul className="space-y-3 sidebar-list" id="sidebar-ul">
          {links.map((link) => {
            const isActive = activeLink === link.href;

            return (
              <li
                key={link.href}
                className={`pl-4 mb-3 border-l-2 ${
                  isActive ? "border-violet-700" : "border-transparent"
                }`}
              >
                <Link
                  href={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`transition ${
                    isActive
                      ? "font-semibold text-violet-700"
                      : "text-gray-700 hover:text-violet-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
