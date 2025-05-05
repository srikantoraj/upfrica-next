// 'use client'
// import React, { useState } from "react";
// import { TiThMenu } from "react-icons/ti";
// import { LuMenu } from "react-icons/lu";

// const HeaderControls = () => {
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

//   return (
//     <div className="ml-auto flex items-center space-x-2 md:space-x-4">
//       {/* Sidebar Toggle (Desktop) */}
//       <button
//         id="sidebar-hide"
//         className="hidden md:inline-flex items-center justify-center p-2 rounded hover:bg-gray-100"
//       >
//         <LuMenu className="text-xl" />
//       </button>

//       {/* Sidebar Toggle (Mobile) */}
//       {/* <button
//         id="mobile-collapse"
//         className="inline-flex md:hidden items-center justify-center p-2 rounded hover:bg-gray-100"
//       >
//         <TiThMenu className="text-xl" />
//       </button> */}

//       {/* Mobile Search Dropdown */}
//       {/* <div className="relative md:hidden">
//         <button
//           onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//           className="flex items-center p-2 rounded hover:bg-gray-100"
//         >
//           <LuMenu className="text-xl" />
//         </button>
//         {mobileSearchOpen && (
//           <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50">
//             <form className="p-3 flex items-center space-x-2">
//               <input
//                 type="search"
//                 className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring"
//                 placeholder="Search..."
//               />
//               <button
//                 type="submit"
//                 className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
//               >
//                 Search
//               </button>
//             </form>
//           </div>
//         )}
//       </div> */}

//       {/* Desktop Search */}
//       <form className="hidden lg:flex items-center border rounded px-2 py-1">
//         {/* <LuMenu className="text-gray-500 mr-2" /> */}
//         <input
//           type="search"
//           className="flex-1 outline-none border-none bg-transparent text-sm"
//           placeholder="Search..."
//         />
//         <button
//           type="button"
//           className="text-xs px-2 text-gray-600 hover:text-black"
//         >
//           <kbd>Ctrl+K</kbd>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default HeaderControls;


"use client";
import React from "react";

import { LuMenu } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { clearToggle } from "../app/store/slices/toggleSlice"; // adjust path if needed
import Link from "next/link";
import ResponsiveHeader from "./analytics/ResponsiveHeader";

const HeaderControls = () => {
  const dispatch = useDispatch();


  const handleToggleClick = () => {
    dispatch(clearToggle());
  };

  return (
    <div>
      {/* // menu and search ber */}
      <ResponsiveHeader handleToggleClick={handleToggleClick} />

      {/* text  */}
      <div className="flex flex-col">
        <div>
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard/index" className="hover:underline text-blue-600">
                  Home
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li>
                <span className="text-gray-700">E-commerce</span>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-900 font-medium">Products list</li>
            </ol>
          </nav>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Products list</h2>
        </div>
      </div>
    </div>
  );
};

export default HeaderControls;

