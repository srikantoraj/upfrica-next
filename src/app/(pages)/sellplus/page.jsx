import CommonButton from "@/components/CommonButton";
import React from "react";
import Link from "next/link";

const Sellplus = () => {
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
  return (
    <section>
      <div className="bg-[#02431D] py-10 md:py-20">
        <div className="container mx-auto space-y-6 md:space-y-12 text-center px-4 sp">
          {/* হেডিং */}
          <div className=" space-y-10">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl text-white leading-tight max-w-7xl mx-auto">
              Welcome to Upfrica SellPlus
            </h1>
            <h3 className="text-lg md:text-2xl lg:text-4xl text-white tracking-wide max-w-6xl mx-auto font-bold">
              Get any of your favorite selling items at wholesale prices
              directly to your doorstep.
            </h3>
          </div>

          {/* SellPost অ্যাকাউন্ট বোতামস */}
          <div className="flex items-center justify-center gap-4 font-bold">
            <CommonButton
              className="text-white bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full transition duration-300"
              text="Join Now"
            />
            <CommonButton
              className="text-white px-6 py-3 rounded-full border border-black font-bold"
              text="Sign in"
            />
          </div>

          {/* তথ্যবহুল টেক্সট */}
          <p className="mt-8 text-white  md:text-lg lg:text-2xl max-w-5xl mx-auto">
            Our dedicated team has you covered. We'll source items from
            worldwide manufacturers, deliver them to you, and help you sell
            quicker online.
          </p>

          {/* How It Works বোতাম */}
          <div className="mt-6 font-bold">
            <CommonButton
              className="text-white px-6 py-3 rounded-full border border-black font-bold"
              text="How If Works"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col py-20">
        {/* Hero Section */}

        {/* Work Data Section */}
        <div className="py-10 md:py-20 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
            {workData.map((work) => (
              <div
                key={work.id}
                className="flex flex-col items-start relative bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 duration-200"
              >
                <div className="absolute top-4 left-4 w-16 h-16 bg-white text-purple-500 rounded-full border border-purple-500 font-bold text-xl flex items-center justify-center shadow-lg">
                  {work.id}
                </div>
                <h1 className="text-2xl font-bold mt-24 text-gray-800 mx-auto">
                  {work.name}
                </h1>
                <h2 className="text-gray-600 text-center mt-4">{work.title}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Contact Section */}
        <div className=" p-10 rounded-lg max-w-lg mx-auto text-center space-y-6 ">
          <button className="bg-[#A435F0] hover:bg-purple-600 text-white px-6 py-3  rounded-full text-xl tracking-wide font-bold max-w-5xl">
            Join SellPlus Today +
          </button>
          <div className="space-y-4">
            <h2 className="text-xl text-gray-500">Our WhatsApp Contacts</h2>
            <p className="text-xl text-gray-500">
              +44 7466800672,+44 7466800672
            </p>
          </div>
          <p className="text-lg text-gray-500">Already Have Items To Sell?</p>
          <button className="bg-[#A435F0] hover:bg-purple-600 text-white px-6 py-3 rounded-full text-lg tracking-wide font-bold">
            <Link href={"/login"}>Start Selling</Link>
          </button>
        </div>

        {/* Sign In Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 shadow-lg text-white">
          <div className="flex  items-center  justify-center mx-auto py-4 px-6">
            <p className="text-lg">Sign in for the best experience</p>
            <button className="ml-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition duration-300">
              <Link href={"/login"}>Sign in</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sellplus;
