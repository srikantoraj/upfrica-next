import React from "react";
import { FaHandHolding, FaHandHoldingHeart } from "react-icons/fa";

export default function AboutSection() {
  return (
    <div className="xl:flex justify-center">
      <div className="container grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        <div className=" py-6 px-8  bg-green-100 border-2">
          <span>
            <FaHandHoldingHeart className="h-10 w-10" />
          </span>
          <div>
            <h4 className="text-xl font-medium">Buy & sell everywhere</h4>
            <p className="text-lg text-gray-500">
              One-stop shop for quality items at low prices: electronics,
              fashion, machines and more
            </p>
          </div>
        </div>
        <div className=" py-6 px-8  bg-pink-100 border-2">
          <span>
            <FaHandHoldingHeart className="h-10 w-10" />
          </span>
          <div>
            <h4 className="text-xl font-medium">Build an online storefront</h4>
            <p className="text-lg text-gray-500">
              Sell online, in person, Ghana and around the world with Upfrica
              marketing tools
            </p>
          </div>
        </div>
        <div className=" py-6 px-8  bg-yellow-100 border-2">
          <span>
            <FaHandHoldingHeart className="h-10 w-10" />
          </span>
          <div>
            <h4 className="text-xl font-medium">24x7 Help</h4>
            <p className="text-lg text-gray-500">
              We are here to help. 24x7 support to buyers and sellers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
