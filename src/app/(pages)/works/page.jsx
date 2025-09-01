import Link from "next/link";
import React from "react";

const WorksPage = () => {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex justify-center items-center bg-gradient-to-r from-purple-200 via-blue-200 to-purple-100 py-20">
        <div className="text-center container">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
            Upfrica BD
          </h1>
          <h2 className="text-5xl font-bold text-gray-700 mb-4">
            A unique marketplace for online buyers and sellers.
          </h2>
          <p className="text-xl font-medium text-gray-600 mb-8">
            Enjoy shopping for the items you love at the best prices. Buy or
            Sell, deliver & process payments.
          </p>
          <button className="bg-purple-500 hover:bg-black hover:text-white py-3 px-8 font-semibold rounded-full transition duration-300">
            <Link href={"/signup"}>Create Account</Link>
          </button>
        </div>
      </div>

      {/* Work Data Section */}
      <div className="py-20 container mx-auto">
        <h1 className="text-3xl text-purple-500 font-bold text-right mb-10">
          Selling with Upfrica
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
      <div className="bg-gray-100 p-10 rounded-lg max-w-lg mx-auto text-center space-y-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-700">
          Our WhatsApp Contact
        </h2>
        <p className="text-xl text-gray-500">+44 7466800672</p>
        <p className="text-lg text-gray-500">Already Have Items To Sell?</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300">
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
  );
};

export default WorksPage;
