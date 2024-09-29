// src/components/Header/UserMenu.tsx

'use client';
import { useState, useRef, useEffect } from "react";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { IoMdCart, IoMdPerson, IoMdSearch } from "react-icons/io";
import { MdHelp, MdSettings } from "react-icons/md";
import Link from "next/link";
import UserEmail from "./UserEmail";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const router = useRouter()

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUser(user)
  }, [])
  
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
    localStorage.removeItem('user'); 
    router.push('/')
  }
  return (
    <div onClick={()=>toggleModal()}>
      {/* User Icon and Menu Toggle */}
      <div ref={triggerRef}>
        <FiUserPlus
          className="h-6 w-6 text-purple-500 cursor-pointer"
          // onClick={toggleModal}
          aria-haspopup="true"
          aria-expanded={isModalOpen}
          aria-controls="user-menu"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end max-h-[600px] ring-0"
          role="dialog"
          aria-modal="true"
          id="user-menu"
        >
          <div
            className="bg-white w-80 p-4 shadow-lg mt-16 mr-4 rounded-md ring-0"
            ref={modalRef}
            tabIndex={-1}
          >
            {/* User Info */}
          <UserEmail/>
            <hr className="my-2" />

            {/* Menu Items */}
            <div className="flex flex-col">
              <Link href="/profile">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdPerson className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">My Profile</span>
                </div>
              </Link>
              <Link href="/purchases">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Purchases History</span>
                </div>
              </Link>
              <Link href="/sales">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Sales History</span>
                </div>
              </Link>
              <Link href="/saved-items">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">My Saved Items</span>
                </div>
              </Link>
              <Link href="/settings">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <MdSettings className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Profile Settings</span>
                </div>
              </Link>
              <Link href="/help">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <MdHelp className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Help Center</span>
                </div>
              </Link>
              <Link href="/orders">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">All Orders</span>
                </div>
              </Link>
              <Link href="/draftPage">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Draft</span>
                </div>
              </Link>
              <Link href="/user">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Users</span>
                </div>
              </Link>
              <Link href="/price-updated">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCart className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Price Updated</span>
                </div>
              </Link>
            </div>
            <hr className="my-2" />

            {/* Sign Out */}
            <div
              className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => {logOut()}}
            >
              <BiLogOut className="h-5 w-5 text-red-500" />
              <span className="ml-2 text-red-500">Sign Out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
