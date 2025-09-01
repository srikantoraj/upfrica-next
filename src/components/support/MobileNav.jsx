"use client";
import React, { useState } from "react";
import { FaBook } from "react-icons/fa";
import Link from "next/link";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi"; // FiX for close icon

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for handling menu toggle

  return (
    <div className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-5 sm:py-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Book Icon and DOCS - Adjusted size for mobile */}
          <div className="flex items-center space-x-2">
            <FaBook className="text-blue-600 h-6 w-6 sm:h-9 sm:w-9" />{" "}
            {/* Smaller icon for mobile */}
            <span className="text-2xl sm:text-3xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300">
              DOCS
            </span>
          </div>

          {/* Vertical Divider (Hidden on Mobile) */}
          <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

          {/* Help Center (Hidden on Mobile) */}
          <span className="hidden sm:block text-gray-600 text-xl sm:text-2xl font-medium hover:text-blue-600 transition duration-300">
            Help Center
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6 sm:space-x-10 text-lg sm:text-xl font-medium">
          {/* 3-bar icon for Mobile */}
          <div
            className="lg:hidden cursor-pointer text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}{" "}
            {/* Show FiX icon if menu is open, else show FiMenu */}
          </div>

          {/* Links - Hidden on Mobile (Visible on medium and up devices) */}
          <div className={`hidden lg:flex items-center space-x-6`}>
            <Link href="#home">
              <span className="cursor-pointer text-gray-800 hover:text-blue-600 transition duration-300">
                Home
              </span>
            </Link>
            <Link href="#shop">
              <span className="cursor-pointer text-gray-800 hover:text-blue-600 transition duration-300">
                Shop
              </span>
            </Link>
            <Link href="#support">
              <span className="cursor-pointer text-gray-800 hover:text-blue-600 transition duration-300">
                Support
              </span>
            </Link>
            <Link href="#sell-online">
              <span className="flex gap-2 items-center cursor-pointer bg-[#EFEFFF] hover:bg-blue-600 text-gray-800 hover:text-white px-4 py-2 rounded-full transition duration-300">
                <BsBoxArrowUpRight />
                Sell Online
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Toggle when 3-bar icon is clicked */}
      {isMenuOpen && (
        <div
          className={`lg:hidden flex flex-col items-center space-y-4 py-4 bg-white border-t border-gray-300 transition-all duration-500 ease-in-out transform ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <Link href="#home">
            <span className="cursor-pointer text-gray-800 font-medium hover:text-blue-600 transition duration-300">
              Home
            </span>
          </Link>
          <Link href="#shop">
            <span className="cursor-pointer text-gray-800 font-medium hover:text-blue-600 transition duration-300">
              Shop
            </span>
          </Link>
          <Link href="#support">
            <span className="cursor-pointer text-gray-800 font-medium hover:text-blue-600 transition duration-300">
              Support
            </span>
          </Link>
          <Link href="#sell-online">
            <span className="flex gap-2 items-center cursor-pointer bg-[#EFEFFF] hover:bg-blue-600 text-gray-800 hover:text-white px-4 py-2 rounded-full transition duration-300">
              <BsBoxArrowUpRight />
              Sell Online
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
