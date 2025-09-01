import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

const DealsPage = () => {
  const data = [
    {
      title: "Best e-commerce tools",
    },
    {
      title: "Best e-commerce tools",
    },
    {
      title: "Best e-commerce tools",
    },
  ];
  return (
    <div className=" bg-[#eeedf5] shadow-md">
      <div className="text-center py-10 space-y-8 container mx-auto">
        <h1 className="text-2xl lg:text-6xl font-bold">
          Start selling with Upfrica
        </h1>
        <p className="text-lg lg:text-2xl font-bold max-w-3xl mx-auto">
          Africa's E-commerce platform for selling your products. Buy with
          confidence; low prices. Start selling today with no start-up fee.
        </p>
        <button className="px-6 py-2 border border-3 border-[#754ffe] text-[#754ffe] rounded-md">
          Try for Free
        </button>
        <ul className="text-gray-600 space-y-2 text-center flex space-x-4 items-center justify-center">
          {data.map((item, i) => (
            <li
              key={i}
              className="flex gap-2 text-base  md:text-xl items-center justify-center text-center"
            >
              <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center">
                <IoIosCheckmarkCircle className="text-green-600" />
              </span>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DealsPage;
