'use client'
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
import Image from "next/image";
import { useState } from "react";
import NavTitle from "./NavTitle";
import { IoClose } from "react-icons/io5";

export default function Header() {

  const [showMenu, setShowMenu] = useState(false);
  console.log("state", showMenu);


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <header className="bg-white ">
      <div className=" px-4 py-3 xl:py-1 ">
        <div className="relative">
          <div className=" flex items-center justify-between xl:hidden">
            <Link href="/">
              <img
                className="h-auto w-[80px] md:w-[100px] ml-4"

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
              {/* <BiUser className="text-purple-500 h-6 w-6" /> */}
              <UserMenu />
              { showMenu ? <IoClose onClick={toggleMenu} className="h-6 w-6 cursor-pointer" /> :
               <IoMdMenu className="h-6 w-6 cursor-pointer" onClick={toggleMenu} />}
            </div>
          </div>

          {/* Show NavTitle when showMenu is true */}
          <div className="px-0">
          {showMenu && <NavTitle isOpen={showMenu} />}
          </div>
        </div>



        {/* Mobile: Search, PhoneSlider & WhatsApp */}
        <div className="mt-3 xl:hidden">
          <SearchBox />
          <PhoneSlider />
          <div className="mt-2 flex items-center justify-center bg-gray-100 p-2 py-2 lg:py-4 rounded-md">
            <FaWhatsapp className="text-green-500 h-6 w-6" />
            <span className="text-purple-500 text-sm font-medium ml-2 2xl:hidden">
              Join the WhatsApp Group
            </span>

          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden xl:flex items-center gap-5">
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
          <div className="flex items-center justify-between space-x-3 ">
            <div className="flex items-center bg-gray-50 py-2 px-1 rounded-md">
              <FaWhatsapp className="text-green-500 h-6 w-6" />
              <span className="text-purple-500 text-sm font-medium ml-2">
                Join WhatsApp Group
              </span>
            </div>
            <ShopingCart />
            <Link href="/products/new">
              
              <button className="border border-gray-400 rounded-md px-2 py-1 text-purple-500 font-bold text-sm">
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
      {/* <hr /> */}
      <Navbar />

    </header>
  );
}
