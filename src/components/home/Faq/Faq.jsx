"use client";

import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const FAQ = () => {
  const [selectedTab, setSelectedTab] = useState("selling");
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = {
    selling: [
      {
        question: "Is there a setup fee or a subscription fee?",
        answer:
          "There are no setup fees or subscription fees. You will only pay a 5% handling fee when your item is sold. No sale, no fee.",
      },
      {
        question: "How will I know when my item is sold?",
        answer:
          "You will receive an email notification providing the order details so you can process and dispatch the order.",
      },
      {
        question: "How will I get paid when my item is sold?",
        answer:
          "We will pay to your momo/bank account immediately after the customer has received their item.",
      },
    ],
    buying: [
      {
        question: "How do I place an order?",
        answer:
          "Simply add the item to your cart, proceed to checkout, and complete your payment to place an order.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept mobile money, credit/debit cards, and other secure payment options available at checkout.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times vary by location, but most orders are delivered within 3-5 business days.",
      },
    ],
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setOpenIndex(null); // Reset open FAQ when switching tabs
  };

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="container mx-auto px-6 py-12 w-full lg:w-3/5">
      {/* Tab Selector */}
      <div className="flex justify-center items-center gap-6 font-semibold text-lg md:text-xl border-b border-gray-300 pb-4">
        <button
          onClick={() => handleTabClick("selling")}
          className={`px-4 py-2 rounded-md transition ${
            selectedTab === "selling"
              ? "text-black font-bold border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Selling
        </button>
        <button
          onClick={() => handleTabClick("buying")}
          className={`px-4 py-2 rounded-md transition ${
            selectedTab === "buying"
              ? "text-black font-bold border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Buying
        </button>
      </div>

      {/* FAQ Section */}
      <div className="mt-6 space-y-4">
        {faqData[selectedTab].map((item, index) => (
          <div key={index} className="border rounded-lg shadow-sm p-4">
            <button
              onClick={() => handleToggle(index)}
              className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-900 focus:outline-none"
            >
              {item.question}
              <IoIosArrowDown
                className={`w-6 h-6 transition-transform transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-max-height duration-300 ${
                openIndex === index ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-700 text-base">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
