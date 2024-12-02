// src/components/Header/Header.tsx
import { BiUser } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMenu, IoMdSearch } from "react-icons/io";
import Navbar from "./Nav";// Adjust the import path as needed
import Link from "next/link"; // Use Next.js's Link
import UserMenu from "./UserMenu"; // Import the Client Component
import UserName from "./UserName";
import ShopingCart from "./ShopingCart";
import SearchInpute from "./SearchInpute";
import PhoneSlider from "./PhoneSlider";
// import CustomSlider from "./CustomSlider";



export default function Header() {

  return (

    <div >
      <div className="xl:flex lg:gap-4 lg:justify-between   bg-white px-2 py-2">
        {/* Small & Medium Devices Layout */}
        <div className="xl:hidden flex flex-col w-full ">
          <div className="flex justify-between items-center w-full py-2">
            <Link href="/">
              <img
                className="h-8 w-24"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                alt="Upfrica Logo"
              />
            </Link>
            <Link href="/products/new">
              <button className="px-2 py-1 bg-purple-500 text-white rounded-md">
                Sell
              </button>
            </Link>
            <div className="flex items-center">
              <ShopingCart />
              <div className="flex gap-4">
                <BiUser className="h-6 w-6 text-purple-500" />
                {/* Additional icons or buttons can be added here */}
              </div>
              {/* <UserName /> */}
              <IoMdMenu className="h-6 w-6" />
            </div>
          </div>

          {/* Full Width Search Section */}
          <SearchInpute />

          <PhoneSlider/>
          {/* Swiper Slider Section (Visible Only on Mobile) */}
          {/* <CustomSlider /> */}

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
          <div className="xl:w-1/6 flex items-center justify-center bg-gray-100 py-2 rounded-md">
            <FaWhatsapp className="h-6 w-6 text-green-400" />
            <p className="text-purple-500 tracking-wide text-base">
              Join the WhatsApp Group
            </p>
          </div>

          {/* Shopping Cart Icon */}
          <ShopingCart />

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

          

          {/* User Section */}
          <div className="xl:w-1/6 flex items-center justify-end gap-4 text-base">
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
