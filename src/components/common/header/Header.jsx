// src/components/Header/Header.tsx
import { BiUser } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import Navbar from "./Nav";// Adjust the import path as needed
import Link from "next/link"; // Use Next.js's Link
import UserMenu from "./UserMenu"; // Import the Client Component
import UserName from "./UserName";
import LogoutButton from "./LogoutButton";
import ShopingCart from "./ShopingCart";
import SearchInpute from "./SearchInpute";

export default function Header() {

  return (

    <div className="">

      <div className="xl:flex lg:gap-4 lg:justify-between  shadow-2xl bg-white px-2 py-2">
        {/* Small & Medium Devices Layout */}
        <div className="xl:hidden flex flex-col w-full ">
          <div className="flex justify-between items-center w-full">
            <Link href="/">
              <img
                className="h-8 w-24"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                alt="Upfrica Logo"
              />

            </Link>
            <div className="flex  items-center">
              <Link href="/products/new">
                <button className="px-2 py-1 bg-purple-500 text-white rounded-md">
                  Sell
                </button>
              </Link>
              <ShopingCart />
              <div className="flex gap-4">
                <BiUser className="h-6 w-6 text-purple-500" />
                {/* You can add additional icons or buttons here */}
              </div>
              <UserName />
            </div>
          </div>

          {/* Full Width Search Section */}
          {/* <div className="mt-4 w-full flex items-center border rounded-xl py-2 px-2">
            <input
              className="w-full border-none focus:outline-none focus:ring-0 pl-3"
              type="text"
              placeholder="Search Upfrica BD"
            />
            <IoMdSearch className="h-8 w-8 text-purple-500" />
          </div> */}
          <SearchInpute/>

          {/* Full Width WhatsApp Section */}
          <div className="mt-2 w-full flex items-center justify-center bg-gray-100 p-4">
            <FaWhatsapp className="h-6 w-6 text-green-400" />
            <p className="text-purple-500 tracking-wide text-base">
              Join the WhatsApp Group
            </p>
          </div>
        </div>

        {/* Large Devices Layout */}
        <div className="hidden xl:flex lg:w-full lg:gap-4 items-center">
          {/* Profile Image */}
          <div className="lg:w-1/6 flex justify-start">
            <Link href="/">
              <img
                className="h-10 w-26"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                alt="Upfrica Logo"
              />
            </Link>
          </div>

          {/* Search Section */}
          <SearchInpute />

          {/* WhatsApp Section */}
          <div className="xl:w-2/6 flex items-center justify-center bg-gray-100 p-2 rounded-md">
            <FaWhatsapp className="h-6 w-6 text-green-400" />
            <p className="text-purple-500 tracking-wide text-base">
              Join the WhatsApp Group
            </p>
          </div>

          {/* Sell Button */}
          <div className="flex items-center justify-center">
            <div className="border border-gray-400 rounded-md">
              <Link href="/products/new">
                <p className="font-bold text-purple-500 px-2 tracking-wide text-xl py-1">
                  Sell
                </p>
              </Link>
            </div>
          </div>

          {/* Shopping Cart Icon */}
          <ShopingCart />

          {/* User Section */}
          <div className="xl:w-2/6 flex items-center justify-end gap-4 text-base">
            <UserMenu />
            <div className="flex gap-2 tracking-wide items-center">
              <UserName />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <Navbar />
      <hr />
    </div>
  );
}
