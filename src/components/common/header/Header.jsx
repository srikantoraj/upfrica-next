import { BiUser } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import Navbar from "./Nav"; // Adjust the import path as needed
import Link from "next/link";
import UserMenu from "./UserMenu";
import UserName from "./UserName";
import ShopingCart from "./ShopingCart";
import SearchBox from "./SearchBox";
import PhoneSlider from "./PhoneSlider";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className=" px-4 py-3">
        <div className="flex items-center justify-between md:hidden">
          <Link href="/">
            <img
              className="h-8 w-auto"
              src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
              alt="Upfrica Logo"
            />
          </Link>
          <Link href="/products/new">
            <button className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-md">
              Sell
            </button>
          </Link>
          <div className="flex items-center space-x-3">
            <ShopingCart />
            <BiUser className="text-purple-500 h-6 w-6" />
            <IoMdMenu className="h-6 w-6" />
          </div>
        </div>

        {/* Mobile: Search, PhoneSlider & WhatsApp */}
        <div className="mt-3 md:hidden">
          <SearchBox />
          <PhoneSlider />
          <div className="mt-2 flex items-center justify-center bg-gray-100 p-3 rounded-md">
            <FaWhatsapp className="text-green-500 h-6 w-6" />
            <span className="text-purple-500 text-sm font-medium ml-2">
              Join the WhatsApp Group
            </span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <img
                className="h-10 w-auto"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                alt="Upfrica Logo"
              />
            </Link>
            {/* The search box now takes at least 40% of the width */}
            <div className="w-full ">
              <SearchBox />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-gray-100 py-2 px-4 rounded-md">
              <FaWhatsapp className="text-green-500 h-6 w-6" />
              <span className="text-purple-500 text-sm font-medium ml-2">
                Join the WhatsApp Group
              </span>
            </div>
            <ShopingCart />
            <Link href="/products/new">
              <button className="border border-gray-400 rounded-md px-4 py-2 text-purple-500 font-bold text-sm">
                Sell
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <UserMenu />
              <UserName />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <Navbar />
      <hr />
    </header>
  );
}
