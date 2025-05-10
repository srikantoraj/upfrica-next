
'use client'

import React, { useState } from 'react'
import { BiUser } from "react-icons/bi"
import { FaWhatsapp } from "react-icons/fa"
import { IoMdMenu } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import { useSelector, useDispatch } from 'react-redux'
import Navbar from "./Nav"           // Adjust paths as needed
import Link from "next/link"
import UserMenu from "./UserMenu"
import UserName from "./UserName"
import ShopingCart from "./ShopingCart"
import SearchBox from "./SearchBox"
import PhoneSlider from "./PhoneSlider"
import NavTitle from "./NavTitle"
import {
  selectCountryList,
  selectSelectedCountry,
  setSelectedCountry
} from '@/app/store/slices/countrySlice' 

export default function Header() {
  const dispatch = useDispatch()
  const countries = useSelector(selectCountryList)
  const selectedCountry = useSelector(selectSelectedCountry)
  console.log("selected country", selectedCountry)

  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)

  const handleCountryChange = (e) => {
    const code = e.target.value
    const country = countries.find(c => c.code === code)
    if (country) dispatch(setSelectedCountry(country))
  }

  return (
    <header className="bg-white">
      <div className="px-4 py-3 xl:py-1">
        <div className="relative">
          <div className="flex items-center justify-between xl:hidden">
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
              <UserMenu />
              {showMenu
                ? <IoClose onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
                : <IoMdMenu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
              }
            </div>
          </div>

          {/* Mobile nav titles */}
          {showMenu && <div className="px-0"><NavTitle isOpen={showMenu} /></div>}
        </div>

        {/* Mobile: Search, PhoneSlider, Country Dropdown & WhatsApp */}
        <div className="mt-3 xl:hidden space-y-2">
          <SearchBox />
          <PhoneSlider />

          <div className="flex items-center justify-between">
            {/* Country selector */}
            <div className="flex justify-center">
              <select
                value={selectedCountry?.code || ""}
                onChange={handleCountryChange}
                className="border border-violet-700 rounded-md px-3 py-2 ring-0 focus:ring-0 focus:border-violet-700"
              >
                <option value="" disabled>Select Country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp join */}
            <div className=" ml-5 flex-1 flex items-center justify-center bg-gray-100 p-2 rounded-md">
              <FaWhatsapp className="text-green-500 h-6 w-6" />
              <span className="text-purple-500 text-sm font-medium ml-2">
                Join the WhatsApp Group
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden xl:flex items-center justify-between w-full gap-5">
          <div className="flex items-center">
            <Link href="/">
              <img
                className="h-10 w-auto"
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
                alt="Upfrica Logo"
              />
            </Link>
            <div className="w-full"><SearchBox /></div>
          </div>

          <div className="flex items-center justify-between space-x-3">
            {/* Country selector */}
            <div>
              <select
                value={selectedCountry?.code || ""}
                onChange={handleCountryChange}
                className="border border-gray-300 rounded-md px-3 py-2 ring-0 focus:ring-0 focus:border-violet-700"
              >
                <option value="" disabled>Select Country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp join */}
            <div className="flex items-center bg-gray-50 py-2 px-3 rounded-md">
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

      <Navbar />
    </header>
  )
}

