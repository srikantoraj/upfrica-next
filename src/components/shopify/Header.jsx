// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { FaChevronDown } from 'react-icons/fa';
// import { FiSearch } from 'react-icons/fi';

// const ShopifyHeader = () => {
//   const [showMore, setShowMore] = useState(false);

//   return (
//     <header className="sticky top-0 z-20 bg-white  border-black/20 text-black shadow-md">
//       <div className="max-w-7xl mx-auto flex items-center h-16 px-4 lg:px-0">
//         {/* Logo */}
//         <Link href="/" className="flex items-center">
//           <svg viewBox="0 0 56 64" className="w-8 h-9" fill="none">
//             <title>Shopify logo</title>
//             <path d="M..." fill="#95BF47" />
//             <path d="M..." fill="#5E8E3E" />
//             <path d="M..." fill="white" />
//           </svg>
//         </Link>

//         {/* Navigation */}
//         <nav className="hidden lg:flex items-center ml-8 gap-6">
//           <Link href="/blog" className="font-bold hover:underline">Blog</Link>
//           <Link href="/blog/topics/find-an-idea" className="hover:underline">Find an Idea</Link>
//           <Link href="/blog/topics/starting-up" className="hover:underline">Starting Up</Link>
//           <Link href="/blog/topics/marketing" className="hover:underline">Marketing</Link>
//           <Link href="/blog/latest" className="hover:underline">Latest</Link>

//           {/* Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowMore(!showMore)}
//               className="flex items-center hover:underline focus:outline-none"
//             >
//               More
//               <FaChevronDown className="ml-1 w-3 h-3" />
//             </button>
//             {showMore && (
//               <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded z-50">
//                 <Link href="/blog/topics/guides" className="block px-4 py-2 hover:bg-gray-100">Guides</Link>
//                 <Link href="/blog/topics/podcasts" className="block px-4 py-2 hover:bg-gray-100">The Shopify Podcast</Link>
//                 <Link href="/blog/topics/founder-stories" className="block px-4 py-2 hover:bg-gray-100">Founder Stories</Link>
//                 <Link href="/blog/topics/sell-online" className="block px-4 py-2 hover:bg-gray-100">Ecommerce Tips</Link>
//                 <Link href="/blog/topics" className="block px-4 py-2 hover:bg-gray-100">All Topics</Link>
//                 <Link href="/enterprise/blog" className="block px-4 py-2 hover:bg-gray-100">Enterprise Blog</Link>
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Right Side */}
//         <div className="ml-auto flex items-center gap-4">
//           {/* Search */}
//           <div className="hidden lg:flex items-center cursor-pointer">
//             <span>Search</span>
//             <FiSearch className="ml-2" />
//           </div>

//           {/* Login */}
//           {/* <Link href="/login" className="text-sm">Log in</Link> */}

//           {/* CTA Button */}
//           {/* <a
//             href="https://accounts.shopify.com/store-create"
//             className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
//           >
//             Start free trial
//           </a> */}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default ShopifyHeader;

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { FaChevronDown } from 'react-icons/fa';
// import { FiSearch } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';

// const ShopifyStickyHeader = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [moreOpen, setMoreOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-20 text-black before:absolute before:top-0 before:left-0 before:pointer-events-none before:w-full before:h-14 before:z-20 after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-10 after:transition-opacity after:duration-200 after:bg-white before:border-y before:border-black/20 after:opacity-100 before:opacity-100 pointer-events-auto bg-white shadow-md">
//       <div className="relative z-20 flex items-center h-14 px-4 lg:px-8 max-w-7xl mx-auto">
//         {/* Logo */}
//         <Link href="/" className="flex items-center z-30">
//           <svg viewBox="0 0 56 64" className="w-8 h-9" fill="none">
//             <title>Shopify logo</title>
//             <path d="M..." fill="#95BF47" />
//             <path d="M..." fill="#5E8E3E" />
//             <path d="M..." fill="white" />
//           </svg>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden lg:flex items-center ml-10 gap-6 text-base font-medium">
//           <Link href="/blog" className="hover:underline">Blog</Link>
//           <Link href="/blog/topics/find-an-idea" className="hover:underline">Find an Idea</Link>
//           <Link href="/blog/topics/starting-up" className="hover:underline">Starting Up</Link>
//           <Link href="/blog/topics/marketing" className="hover:underline">Marketing</Link>
//           <Link href="/blog/latest" className="hover:underline">Latest</Link>
//           <div className="relative">
//             <button
//               onClick={() => setMoreOpen(!moreOpen)}
//               className="flex items-center hover:underline focus:outline-none"
//             >
//               More
//               <FaChevronDown className="ml-1 w-3 h-3" />
//             </button>
//             {moreOpen && (
//               <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded z-50">
//                 <Link href="/blog/topics/guides" className="block px-4 py-2 hover:bg-gray-100">Guides</Link>
//                 <Link href="/blog/topics/podcasts" className="block px-4 py-2 hover:bg-gray-100">Shopify Podcast</Link>
//                 <Link href="/blog/topics/founder-stories" className="block px-4 py-2 hover:bg-gray-100">Founder Stories</Link>
//                 <Link href="/blog/topics/sell-online" className="block px-4 py-2 hover:bg-gray-100">Ecommerce Tips</Link>
//                 <Link href="/blog/topics" className="block px-4 py-2 hover:bg-gray-100">All Topics</Link>
//                 <Link href="/enterprise/blog" className="block px-4 py-2 hover:bg-gray-100">Enterprise Blog</Link>
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Right Side */}
//         <div className="ml-auto flex items-center gap-4">
//           <div className="hidden lg:flex items-center text-sm cursor-pointer hover:text-gray-700">
//             Search <FiSearch className="ml-2" />
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="lg:hidden z-30"
//             aria-label="Toggle Menu"
//           >
//             {mobileMenuOpen ? <IoClose className="w-6 h-6" /> : <FaChevronDown className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden absolute top-14 left-0 right-0 w-full bg-white shadow-md z-10 transition-all duration-300 p-6 max-h-[80vh] overflow-y-scroll">
//           <ul className="space-y-6 text-base font-semibold">
//             <li><Link href="/blog">Overview</Link></li>
//             <li><Link href="/blog/topics/find-an-idea">Find an Idea</Link></li>
//             <li><Link href="/blog/topics/starting-up">Starting Up</Link></li>
//             <li><Link href="/blog/topics/marketing">Marketing</Link></li>
//             <li><Link href="/blog/latest">Latest</Link></li>
//             <li>
//               <span className="uppercase text-xs text-gray-400">More</span>
//               <ul className="pl-4 mt-2 space-y-2">
//                 <li><Link href="/blog/topics/guides">Guides</Link></li>
//                 <li><Link href="/blog/topics/podcasts">Shopify Podcast</Link></li>
//                 <li><Link href="/blog/topics/founder-stories">Founder Stories</Link></li>
//                 <li><Link href="/blog/topics/sell-online">Ecommerce Tips</Link></li>
//                 <li><Link href="/blog/topics">All Topics</Link></li>
//                 <li><Link href="/enterprise/blog">Enterprise Blog</Link></li>
//               </ul>
//             </li>
//           </ul>

//           {/* Mobile Search Bar */}
//           <form action="/blog/international-import-shipping" method="get" className="mt-6">
//             <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
//               <input
//                 type="text"
//                 name="header-search"
//                 placeholder="Search"
//                 className="w-full outline-none text-sm"
//               />
//               <button type="submit" aria-label="Search">
//                 <FiSearch className="ml-2" />
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </header>
//   );
// };

// export default ShopifyStickyHeader;

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const ShopifyStickyHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 text-black bg-white shadow-md before:absolute before:top-0 before:left-0 before:pointer-events-none before:w-full before:h-14 before:z-20 after:absolute after:top-0 after:left-0 after:will-change-[opacity] after:pointer-events-none after:h-full after:w-full after:z-10 after:transition-opacity after:duration-200 after:bg-white before:border-y before:border-black/20 after:opacity-100 pointer-events-auto before:opacity-100">
      <div className="relative z-20 flex items-center h-14 px-4  container">
        {/* LEFT: Logo + Title (only visible on small screens) */}
        <div className="flex items-center w-full sm:w-auto">
          <Link href="/" className="flex items-center mr-3 sm:mr-5">
            <svg viewBox="0 0 56 64" className="w-8 h-9" fill="none">
              <title>Shopify logo</title>
              <path d="M..." fill="#95BF47" />
              <path d="M..." fill="#5E8E3E" />
              <path d="M..." fill="white" />
            </svg>
          </Link>

          {/* Mobile / Tablet Menu Title */}
          <button
            type="button"
            className="flex flex-col gap-y-0.5 leading-tight lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-xs font-bold uppercase text-gray-500">
              Blog
            </span>
            <span className="text-base font-bold flex items-center">
              Menu
              <FaChevronDown
                className={`ml-1 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </span>
          </button>
        </div>

        {/* NAVIGATION - Desktop only */}
        <nav className="hidden lg:flex items-center ml-10 gap-6 text-base font-medium">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/blog/topics/find-an-idea" className="hover:underline">
            Find an Idea
          </Link>
          <Link href="/blog/topics/starting-up" className="hover:underline">
            Starting Up
          </Link>
          <Link href="/blog/topics/marketing" className="hover:underline">
            Marketing
          </Link>
          <Link href="/blog/latest" className="hover:underline">
            Latest
          </Link>
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center hover:underline focus:outline-none"
            >
              More
              <FaChevronDown className="ml-1 w-3 h-3" />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded z-50">
                <Link
                  href="/blog/topics/guides"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Guides
                </Link>
                <Link
                  href="/blog/topics/podcasts"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Shopify Podcast
                </Link>
                <Link
                  href="/blog/topics/founder-stories"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Founder Stories
                </Link>
                <Link
                  href="/blog/topics/sell-online"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Ecommerce Tips
                </Link>
                <Link
                  href="/blog/topics"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  All Topics
                </Link>
                <Link
                  href="/enterprise/blog"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Enterprise Blog
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Search + Mobile Toggle */}
        <div className="ml-auto flex items-center gap-4">
          {/* Desktop Search */}
          <div className="hidden lg:flex items-center text-sm cursor-pointer hover:text-gray-700">
            Search <FiSearch className="ml-2" />
          </div>

          {/* Mobile Toggle Button (Right Side) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <IoClose className="w-6 h-6" />
            ) : (
              <FaChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 w-full bg-white shadow-md z-10 transition-all duration-300 p-6 max-h-[80vh] overflow-y-auto">
          <ul className="space-y-6 text-base font-semibold">
            <li>
              <Link href="/blog">Overview</Link>
            </li>
            <li>
              <Link href="/blog/topics/find-an-idea">Find an Idea</Link>
            </li>
            <li>
              <Link href="/blog/topics/starting-up">Starting Up</Link>
            </li>
            <li>
              <Link href="/blog/topics/marketing">Marketing</Link>
            </li>
            <li>
              <Link href="/blog/latest">Latest</Link>
            </li>
            <li>
              <span className="uppercase text-xs text-gray-400">More</span>
              <ul className="pl-4 mt-2 space-y-2">
                <li>
                  <Link href="/blog/topics/guides">Guides</Link>
                </li>
                <li>
                  <Link href="/blog/topics/podcasts">Shopify Podcast</Link>
                </li>
                <li>
                  <Link href="/blog/topics/founder-stories">
                    Founder Stories
                  </Link>
                </li>
                <li>
                  <Link href="/blog/topics/sell-online">Ecommerce Tips</Link>
                </li>
                <li>
                  <Link href="/blog/topics">All Topics</Link>
                </li>
                <li>
                  <Link href="/enterprise/blog">Enterprise Blog</Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Search Field for Mobile */}
          <form
            action="/blog/international-import-shipping"
            method="get"
            className="mt-6"
          >
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <input
                type="text"
                name="header-search"
                placeholder="Search"
                className="w-full outline-none text-sm"
              />
              <button type="submit" aria-label="Search">
                <FiSearch className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default ShopifyStickyHeader;
