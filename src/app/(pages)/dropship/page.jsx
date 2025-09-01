import CommonButton from "@/components/CommonButton";
import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

const DropShip = () => {
  const data = [
    {
      title: "Upfrica Dropshipping & Wholesale Buy",
      description: `Upfrica Dropshipping delivers products directly to your customer, and you get a commission on each item sold. Upfrica wholesale Buy sources products for sellers at discounted prices.`,
      data: [
        "No upfront inventory costs",
        "No hassles with deliveries",
        "No hassles with deliveries",
      ],
    },
    // Add more objects if needed
  ];
  return (
    <>
      <div>
        <div className="p-4 text-center container mx-auto max-w-5xl ">
          {data.map((item) => (
            <section key={item.id} className="mb-6 space-y-5">
              <h2 className="text-3xl lg:text-7xl font-semibold text-purple-500 mb-2">
                {item.title}
              </h2>
              <p className="text-base md:text-2xl font-bold mb-4">
                {item.description}
              </p>
              <CommonButton
                text="Join The Whatsapp Group"
                aria-label="Join The Whatsapp Group"
                className="ml-4 px-4 lg:px-6 py-2 bg-[#754FFE] text-white rounded transition duration-300 font-bold text-lg md:text-xl"
              />
              <ul className="text-gray-600 space-y-2 text-center">
                {item.data.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-base  md:text-xl items-center justify-center text-center"
                  >
                    <span className="bg-green-200 rounded-full w-5 h-5 flex items-center justify-center">
                      <IoIosCheckmarkCircle className="text-green-600" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-8">
          <h1 className="font-bold text-2xl md:text-4xl">
            How It Works with Drop Shipment
          </h1>
          <ul className=" space-y-4 text-xl text-gray-700 px-4">
            <li>
              Post any Upfrica item for sale on social media; your status,
              Facebook timeline, Instagram, or WhatsApp *at your own price
            </li>
            <li>
              Promote the items through your channels to reach potential
              customers effectively.
            </li>
            <li>
              Manage orders and ensure timely delivery to maintain customer
              satisfaction.
            </li>
          </ul>
          <div className="flex justify-center">
            <img
              src="https://proinsidegh.s3.amazonaws.com/static/Dropshipimpupfrica.jpg"
              alt="Drop Shipment Process"
              className="w-full h-auto max-w-md object-cover rounded shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default DropShip;
