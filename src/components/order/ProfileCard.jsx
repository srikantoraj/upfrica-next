"use client";
import React from "react";
import { FaUserCircle, FaRegBookmark, FaCog } from "react-icons/fa";
import Link from "next/link"; // যদি Next.js ব্যবহার করেন

const ProfileCard = () => {
  const user = {
    name: "John Doe",
    profileImage:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg", // এখানে আপনার প্রোফাইল ইমেজের পাথ দিন
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full object-cover"
          src={user.profileImage}
          alt={`${user.name}'s profile`}
        />
        <h2 className="mt-4  font-semibold">{user.name}</h2>
        <p className="text-gray-600">Welcome back</p>
      </div>
      <hr className="my-6" />
      <div className="space-y-4">
        {/* My Profile Page */}
        <Link href="/dashboard">
          <div className="flex items-center cursor-pointer hover:text-purple-600 mb-6">
            <FaUserCircle className="text-xl mr-3" />
            <span className="text-lg font-medium">Dashboard</span>
          </div>
        </Link>
        {/* My Saved Items */}
        <Link href="/saved-items">
          <div className="flex items-center cursor-pointer hover:text-purple-600 mb-6">
            <FaRegBookmark className="text-xl mr-3" />
            <span className="text-lg font-medium">My Saved Items</span>
          </div>
        </Link>
        {/* Profile Settings */}
        <Link href="/settings">
          <div className="flex items-center cursor-pointer hover:text-purple-600 mb-6">
            <FaCog className="text-xl mr-3" />
            <span className="text-lg font-medium">Profile Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
