"use client";

import { useState, useRef, useEffect } from "react";
import { FaRegUser, FaShoppingBag, FaHeart, FaStore } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { CiPower } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../app/store/slices/userSlice";
import UserEmail from "./UserEmail";

export default function UserMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const logOut = () => {
    dispatch(clearUser());
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  return (
    <div onClick={toggleModal}>
      {/* User Icon Toggle */}
      <div ref={triggerRef}>
        <FaRegUser
          className="h-5 w-5 text-purple-500 cursor-pointer"
          aria-haspopup="true"
          aria-expanded={isModalOpen}
          aria-controls="user-menu"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-30 flex justify-end items-start"
          role="dialog"
          aria-modal="true"
          id="user-menu"
        >
          <div
            className="bg-white w-64 2xl:w-80 p-4 shadow-2xl mt-12 lg:mt-16 mr-4 rounded-md border text-base lg:text-lg"
            ref={modalRef}
            tabIndex={-1}
          >
            {/* User Info */}
            <UserEmail />
            <hr className="my-2" />

            {/* Menu Items */}
            <div className="flex flex-col space-y-1">
              <Link href="/new-dashboard">
                <div className="flex items-center py-2 px-2 hover:bg-gray-100 rounded">
                  <AiOutlineDashboard className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Dashboard</span>
                </div>
              </Link>

              <Link href="/settings">
                <div className="flex items-center py-2 px-2 hover:bg-gray-100 rounded">
                  <FiSettings className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Profile Settings</span>
                </div>
              </Link>

              <Link href="/dashboard/all-orders">
                <div className="flex items-center py-2 px-2 hover:bg-gray-100 rounded">
                  <FaShoppingBag className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">My Purchases</span>
                </div>
              </Link>

              <Link href="/dashboard/wishlist">
                <div className="flex items-center py-2 px-2 hover:bg-gray-100 rounded">
                  <FaHeart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Wishlist Items</span>
                </div>
              </Link>

              <Link href="/dashboard/stores">
                <div className="flex items-center py-2 px-2 hover:bg-gray-100 rounded">
                  <FaStore className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Saved Sellers</span>
                </div>
              </Link>
            </div>

            <hr className="my-2" />

            {/* Sign Out */}
            <div
              className="flex items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={logOut}
            >
              <CiPower className="h-5 w-5 text-red-500" />
              <span className="ml-2 text-red-500">Sign Out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
