import React from 'react'
import { FaHeart } from 'react-icons/fa';
import { GoPerson } from "react-icons/go";
import { MdLocalPhone } from 'react-icons/md';
import parse from 'html-react-parser';



const Dummy = ({ title = "", description = "" }) => {
  return (
    <div><div className="grid md:grid-cols-2 gap-5 lg:gap-20 ">
      <div>
        <div className="md:h-full space-y-2">
          <div className="space-y-4 border rounded-xl p-2">
            <div className="flex gap-5">
              <span>
                <GoPerson className="h-16 w-16 border rounded-full text-gray-500" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-wide">
                  Upfrica
                </h2>
                <p className="text-base">
                  <span className="mr-5 text-gray-400">5 followers</span>{" "}
                  <span className="text-green-500">417 Items</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-base lg:text-xl font-bold border rounded-3xl w-1/2">
                <button className="flex items-center gap-4  mx-auto py-2">
                  <span>
                    <FaHeart />
                  </span>
                  <span>Follow</span>
                </button>
              </div>
              <div className="text-base lg:text-xl font-bold border rounded-3xl w-1/2">
                <button className="flex flex-col mx-auto py-2">
                  <span>shop all items</span>
                </button>
              </div>
            </div>
            <div className="   bg-[#A435F0] py-3 rounded-lg w-full flex items-center justify-center">
              <div className="flex items-center gap-2 ">
                <span>
                  <MdLocalPhone
                    className="h-6 w-6 text-white
              "
                  />
                </span>
                <p className="text-white text-base lg:text-xl tracking-wide font-bold">
                  Click to view number
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6 py-4">
        <h2 className="text-xl md:text-2xl font-medium tracking-wide">
          {title}
        </h2>
        <hr />
        <p className="text-base  leading-8">
          {parse(description?.body)}
        </p>

        <p className="text-xl">
          <span className=" font-bold mr-2">Seller location: </span> accra,
          Ghana
        </p>
      </div>
    </div></div>
  )
}

export default Dummy