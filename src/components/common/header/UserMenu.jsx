'use client'
import { useState, useRef, useEffect } from "react";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { IoMdCart, IoMdCash, IoMdPerson, IoMdSearch } from "react-icons/io";
import { MdHelp, MdOutlineReceipt, MdSettings } from "react-icons/md";
import Link from "next/link";
import UserEmail from "./UserEmail";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { BsBarChartSteps, BsCalendar3, BsFillBookmarkHeartFill, BsFillPersonLinesFill, BsPersonPlus, BsSpeedometer2 } from "react-icons/bs";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaHouseChimney } from "react-icons/fa6";
import { CiPower } from "react-icons/ci";


export default function UserMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const router = useRouter()

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

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
    <div onClick={() => toggleModal()}>
      {/* User Icon and Menu Toggle */}
      <div ref={triggerRef}>
        <FaRegUser
          className="h-5 w-5 text-purple-500 cursor-pointer"
          // onClick={toggleModal}
          aria-haspopup="true"
          aria-expanded={isModalOpen}
          aria-controls="user-menu"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0  z-30 flex justify-end max-h-[700px] "
          role="dialog"
          aria-modal="true"
          id="user-menu"
        >
          <div
            className="bg-white w-80 p-4 shadow-2xl mt-16 mr-4 rounded-md "
            ref={modalRef}
            tabIndex={-1}
          >
            {/* User Info */}
            <UserEmail />
            <hr className="my-2" />

            {/* Menu Items */}
            <div className="flex flex-col">
              <Link href="/profile">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsFillPersonLinesFill className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">My Profile</span>
                </div>
              </Link>
              <Link href="/purchases">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <MdOutlineReceipt className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Purchases History</span>
                </div>
              </Link>
              <Link href="/sales">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCash className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Sales History</span>
                </div>
              </Link>
              <Link href="/saved-items">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsFillBookmarkHeartFill className="h-5 w-5 text-gray-500" />
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
                  <IoInformationCircleOutline className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Help Center</span>
                </div>
              </Link>
              <Link href="/order">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsSpeedometer2 className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">All Orders</span>
                </div>
              </Link>
              <Link href="/draf">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsPersonPlus className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Draft</span>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsCalendar3 className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Users</span>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <FaHouseChimney className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Homepage Items</span>
                </div>
              </Link>
              <Link href="/admin/users">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <BsBarChartSteps className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Homepage Data</span>
                </div>
              </Link>
              <Link href="/price-updated">
                <div className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded">
                  <IoMdCash className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Price Updated</span>
                </div>
              </Link>
            </div>
            <hr className="my-2" />

            {/* Sign Out */}
            <div
              className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => { logOut() }}
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
