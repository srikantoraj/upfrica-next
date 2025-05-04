"use client";
import DashbordSearchBer from "@/components/dashboard/DashbordSearchBer";
import React from "react";
import { useSelector } from "react-redux";

const layout = ({ children }) => {
  const toggle = useSelector((state) => state.toggle.toggle); // access toggle value
  return (
    <div className="flex gap-3">
      {toggle && <DashbordSearchBer />}
      {children}
    </div>
  );
};

export default layout;
