import Link from "next/link";
import React from "react";

const Selling = ({ color }) => {
  return (
    <div
      className={`container mx-auto   grid md:grid-cols-3 items-center py-8 lg:py-12  px-6 lg:px-14 text-white rounded-[40px]  md:my-10 gap-6 ${
        color ? "bg-[#0A8800]" : "bg-black"
      }`}
    >
      {/* Text Section */}
      <div className="md:col-span-2 space-y-4 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-extrabold leading-snug text-gray-200">
          Selling Locally? List for Free!
        </h1>
        <p className="text-lg md:text-2xl font-medium leading-relaxed">
          No sale, no fee. From electronics and tech to fashion, start making
          money across various categories today.
        </p>
      </div>

      {/* Button Section */}
      <div className="flex md:justify-end justify-center">
        <Link href="/products/new">
          <button className="font-semibold text-black bg-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg transition-transform transform hover:scale-105 hover:shadow-lg">
            Start Selling
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Selling;
