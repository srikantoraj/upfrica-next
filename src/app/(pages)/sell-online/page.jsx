import React from "react";
import Link from "next/link";
import CommonButton from "@/components/CommonButton";
import { FaCheckCircle } from "react-icons/fa";

const SellOnline = () => {
  const workData = [
    {
      id: 1,
      name: "Upfrica BD",
      title: "A unique marketplace for online buyers and sellers.",
    },
    {
      id: 2,
      name: "Tech Hub",
      title: "Connecting technology enthusiasts and professionals.",
    },
    {
      id: 3,
      name: "Green World",
      title: "Promoting eco-friendly products and services.",
    },
    {
      id: 4,
      name: "Fitness Plus",
      title: "Your one-stop solution for fitness and wellness.",
    },
  ];

  const General = [
    {
      id: 1,
      name: "Why should I sell on Upfrica BD?",
      title:
        "Upfrica is packed with top and modern eCommerce features enabling sellers to reach thousands of potential buyers at a low handling fee.",
    },
    {
      id: 2,
      name: "Reach More Customers",
      title:
        "Upfrica gives you access to a large customer base, helping you reach more buyers easily.",
    },
    {
      id: 3,
      name: "Low Fees",
      title:
        "With just a small handling fee, you can sell without worrying about high costs.",
    },
    {
      id: 4,
      name: "Easy to Use",
      title:
        "Our platform is designed to be user-friendly, allowing you to manage your sales with ease.",
    },
    {
      id: 5,
      name: "Secure Payment Processing",
      title:
        "We offer secure payment options to ensure safe transactions for both sellers and buyers.",
    },
  ];

  return (
    <>
      <div>
        {/* Hero Section */}
        <div className="flex justify-center items-center bg-[#E3ECFB] py-10 lg:py-20 px-4">
          <div className="text-center container space-y-6 lg:space-y-10">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800">
              Sell Online With Upfrica BD
            </h1>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-700">
              Start adding your items for free - No Sale No Fee.
            </h2>
            <div className="flex gap-4 justify-center items-center">
              <CommonButton
                className="text-white bg-purple-600 hover:bg-purple-700 px-4 lg:px-6 py-2 lg:py-3 rounded-full transition duration-300 font-bold"
                text="Get Started"
              />
              <CommonButton
                className="px-4 lg:px-6 py-2 lg:py-3 rounded-full border border-black font-bold"
                text="Get Started"
              />
            </div>
            <p className="text-base lg:text-xl">
              Launch your online shop for free and process payments safely.
            </p>
          </div>
        </div>

        {/* Work Data Section */}
        <div className="py-10 lg:py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {workData.map((work) => (
              <div
                key={work.id}
                className="flex flex-col items-start relative bg-white rounded-lg p-6 transition transform hover:scale-105 duration-200 shadow-md"
              >
                <div className="absolute top-4 left-4 w-12 lg:w-16 h-12 lg:h-16 bg-white text-purple-500 rounded-full border border-purple-500 font-bold text-lg lg:text-xl flex items-center justify-center shadow-lg">
                  {work.id}
                </div>
                <h1 className="text-lg lg:text-2xl font-bold mt-16 lg:mt-24 text-gray-800 mx-auto">
                  {work.name}
                </h1>
                <h2 className="text-gray-600 text-center mt-2 lg:mt-4">
                  {work.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Sign In Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 shadow-lg text-white">
          <div className="flex items-center justify-center mx-auto py-3 lg:py-4 px-6">
            <p className="text-base lg:text-lg">
              Sign in for the best experience
            </p>
            <button className="ml-4 px-4 lg:px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition duration-300">
              <Link href="/login">Sign in</Link>
            </button>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 container mx-auto py-8 gap-6 lg:gap-10 px-4">
          <div className="col-span-1">
            <img
              className="w-full"
              src="https://proinsidegh.s3.amazonaws.com/static/upfrica-pc-man4.jpg"
              alt="Pricing Image"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center text-base lg:text-xl text-[#747579]">
            <div className="bg-white  space-y-6 lg:space-y-10">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                Pricing 3% of total sale
              </h2>
              <p className="text-purple-400">No sale, no fee</p>
              <p>
                Adding an item to sell on Upfrica is free. We will not charge a
                listing fee or a monthly subscription fee. We only charge a
                one-off Net Value Fee (NVF) when your item is sold.
              </p>
              <p className="text-purple-400">
                NVF is calculated as 3% of the sale's total amount (the item
                price and delivery cost).
              </p>
              <p className="font-bold">
                For example, your listed item sold for $90 and you charged $10
                for delivery. The NVF is $100, so we will charge you $3 as a
                processing fee and pay you $97.
              </p>
              <CommonButton
                text="Start Selling"
                className="ml-4 px-4 lg:px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition duration-300"
              />
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="py-10 bg-[#E3ECFB]">
          <h1 className="text-center text-2xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h1>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 container mx-auto py-10 items-center">
            <div className="col-span-1">
              <h1 className="text-xl md:text-3xl font-bold p-4">General</h1>
              <div className="container mx-auto py-4 md:py-8">
                {General.map((reason) => (
                  <div key={reason.id} className="p-4 text-xl space-y-4">
                    <h2 className=" text-gray-600 mt-2 ">{reason.name}</h2>
                    <p className=" font-bold text-gray-800">{reason.title}</p>
                  </div>
                ))}
              </div>
              <CommonButton
                text="Sell Your frist item +"
                className="ml-4 px-4 lg:px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-300 font-bold text-xl"
              />
            </div>
            <div className="col-span-1">
              <h1 className="text-xl md:text-3xl font-bold p-4">
                Product Listing
              </h1>
              <div className="container mx-auto py-4 md:py-8">
                {General.map((reason) => (
                  <div key={reason.id} className="p-4 text-xl space-y-4">
                    <h2 className=" text-gray-600 mt-2 ">{reason.name}</h2>
                    <p className=" font-bold text-gray-800">{reason.title}</p>
                  </div>
                ))}
              </div>
              <CommonButton
                text="Sell Your frist item +"
                className="ml-4 px-4 lg:px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-300 font-bold text-xl"
              />
            </div>
          </div>
        </div>

        {/* Free days  */}
        <div className="grid grid-cols-2 md:grid-cols-5 container mx-auto  justify-center items-center px-4">
          <div className="col-span-3 py-5">
            {/* Free Trial Offer Section */}
            <div className="space-y-6 text-xl">
              <h2 className="text-2xl md:text-4xl font-extrabold text-purple-700 mb-4">
                Try 30 Days FREE
              </h2>
              <p className=" text-gray-700">
                0% commission on any sale you make in the first 30 days when you
                sign up.
              </p>
              <p className="  text-gray-700">
                What happens after my free trial?
              </p>
            </div>

            <div className="mt-5 space-y-6 text-base md:text-xl font-bold">
              <p className="flex items-center text-gray-700">
                <span>
                  <FaCheckCircle className="h-4 w-4 hidden lg:flex" />
                </span>
                Your free product listing allowance will continue.
              </p>
              <p className="flex items-center text-gray-700">
                <span>
                  <FaCheckCircle className="h-4 w-4 hidden lg:flex" />
                </span>
                We will only charge you a 3% handling fee when you sell an item.
              </p>
            </div>
          </div>
          <div className="col-span-2 ">
            <img
              className="w-full h-full"
              src="https://proinsidegh.s3.amazonaws.com/static/upfrica-smart.jpg"
              alt=""
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 container mx-auto pb-10 px-4">
          <div className="col-span-1 order-2 md:order-1">
            <img
              className="h-full w-full"
              src="https://proinsidegh.s3.amazonaws.com/static/upfrica-table.jpg"
              alt=""
            />
          </div>
          <div className="col-span-1 flex justify-center items-center order-1 md:order-2">
            {/* Main Header Section */}
            <div className="underline  py-10">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                <h2 className="mb-4">End-To-End eCommerce</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700">
                  Upfrica handles everything from marketing and payments, to
                  secure checkout.
                </p>
              </div>

              <div className="text-gray-400">
                <h2 className="text-lg sm:text-xl md:text-2xl">
                  Whether you sell online, on social media, in store, or car
                  boot sale, Upfrica has you covered.
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm sm:text-base md:text-lg font-bold text-gray-700">
                <p className="flex items-center">
                  <FaCheckCircle className="h-4 w-4 hidden lg:flex mr-2" />
                  Your free product listing allowance will continue.
                </p>
                <p className="flex items-center">
                  <FaCheckCircle className="h-4 w-4 hidden lg:flex mr-2" />
                  We will only charge you a 3% handling fee when you sell an
                  item.
                </p>
                <p className="flex items-center">
                  <FaCheckCircle className="h-4 w-4 hidden lg:flex mr-2" />
                  Pocket more from each sale, with a total handling fee as low
                  as 3%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellOnline;
