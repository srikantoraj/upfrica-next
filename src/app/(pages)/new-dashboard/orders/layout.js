

import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/Header";

import React from "react";


const layout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <div className="flex flex-col md:flex-row bg-gray-100 mx-auto max-w-6xl gap-2 px-2 py-10 pb-32">
          {/* <Sidebar /> */}
          <main className="flex-1 px-0 py-0">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default layout;
