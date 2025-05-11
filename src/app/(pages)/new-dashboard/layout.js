import React from "react";
import clsx from "clsx";
import HeaderControls from "@/components/HeaderControls";
import Sideber from "@/components/new-dashboard/page";

const Layout = ({ children }) => {
  return (
    <div className="flex relative w-full">
      {/* Sidebar */}
      <Sideber />

      {/* Main Content */}
      <div className={clsx("flex-1 transition-all duration-300 px-4 py-5")}>
        <HeaderControls />
        {children}
      </div>
    </div>
  );
};

export default Layout;
