


"use client";
import React from "react";

import { LuMenu } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { clearToggle } from "../app/store/slices/toggleSlice"; // adjust path if needed


const HeaderControls = () => {
  const dispatch = useDispatch();
  const toggle = useSelector((state) => state.toggle.toggle);


  const handleToggleClick = () => {
    dispatch(clearToggle());
  };

  return (
    <div className={`my-2 ${toggle ? "hidden" : "block"} `}>
         <button
              onClick={handleToggleClick}
              className="p-2 rounded hover:bg-gray-100 transition"
              aria-label="Toggle Sidebar"
            >
        <div className="flex justify-center items-center font-medium"><LuMenu className="w-6 h-6 text-gray-700 mr-2" />Dashboard</div>
         </button>

   
    </div>
  );
};

export default HeaderControls;

