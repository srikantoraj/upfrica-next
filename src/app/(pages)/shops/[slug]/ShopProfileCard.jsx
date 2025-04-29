'use client';

import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { FiShare2 } from 'react-icons/fi';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ShopProfileCard({ shop, user, setIsEditOpen }) {
  const [isFollowing, setIsFollowing] = useState(false);

  // 🔥 Only calculate shopType safely AFTER component mounted
  const shopType = shop?.shoptype?.name || 'General Goods';

  if (!shop || !shop.name) {
    // 🔥 Show a safe fallback if shop is not ready
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-400 animate-pulse">Loading shop...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full animate-fadeInUp">
      {/* Background Cover */}
      <img
        src={shop.top_banner || 'https://images.pexels.com/photos/34577/pexels-photo.jpg'}
        alt="Shop Banner"
        className="w-full object-cover h-[240px] md:h-[320px] rounded-lg"
      />

      {/* Profile Card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
  


  {/* Main Card */}
  <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-1 w-full max-w-md flex flex-col items-center text-center gap-1 mb-4 mt-4 md:mt-0">

          {/* Logo */}
          <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {shop?.shop_logo ? (
  <img
    src={shop.shop_logo}
    alt="Shop Logo"
    className="object-cover w-full h-full"
    onError={(e) => e.currentTarget.style.display = 'none'}
  />
) : (
  <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
    Logo
  </div>
)}
          </div>

          {/* Shop Name */}
{/* Shop Name */}
<div className="flex items-center justify-center gap-2">
  <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>

  {/* Edit Button only if user exists */}
  {user && (
    <motion.button
  onClick={() => setIsEditOpen(true)}
  className="p-1 rounded-full hover:bg-gray-200"
  title="Edit Shop"
  whileTap={{ scale: 0.9 }} // 🔥 this adds the click animation
>
  <FaEdit className="text-gray-500 text-sm" />
</motion.button>
  )}
</div>

          {/* Shop Category */}
          <p className="text-gray-600 text-sm">{shopType}</p>

          {/* Follow Button + Share */}
          <div className="flex items-center gap-4 mt-2 text-gray-700 text-sm">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-violet-600 text-white'
              }`}
            >
              <HiOutlinePlus className="text-lg" />
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <div className="flex items-center gap-1">
              <span>2K followers</span>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-black">
              <FiShare2 className="text-lg" />
              <span>Share</span>
            </div>
          </div>

          {/* Sold, Verified, Location */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-gray-700 text-sm">
            <span>400+ items sold</span>
            <FaCheckCircle className="text-gray-600 text-sm" />
            <span>Verified</span>
            <span>🇬🇭 Accra, GH</span>
          </div>

        </div>
      </div>
    </div>
  );
}