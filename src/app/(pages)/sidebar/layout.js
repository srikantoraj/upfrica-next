import Header from "@/components/common/header/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div>
      <div className="xl:pl-44">
        <Header />
      </div>
      <div className="flex flex-col min-h-screen">
        {/* হেডার সর্বোপরি */}

        {/* হেডারের নিচে ফ্লেক্স কন্টেইনার */}
        <div className="flex flex-1 reative  ">
          {/* বাম পাশে Sidebar */}
          <Sidebar />

          {/* মাঝখানে মূল কনটেন্ট */}
          <main className="flex-1 xl:ml-64 ">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default layout;
