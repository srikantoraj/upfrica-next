import React from 'react';
import { FaCheck, FaRocket, FaTimes, FaUserTie } from "react-icons/fa";
import { BiLightningCharge } from 'react-icons/bi';
import { BsLightningChargeFill } from 'react-icons/bs';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { RiSendPlaneFill } from "react-icons/ri";

const Price = () => {
    const plans = [
        {
            name: "Free Plan",
            price: 0,
            features: [
                { text: "Free 5 Listings. No sale no fee", included: true },
                { text: "Online payment before delivery only", included: true },
                { text: "5% fee per online payment", included: true },
                { text: "Listing review & optimization", included: false },
                { text: "Sponsored Upfrica homepage", included: false },
                { text: "Display Phone on your ads", included: false },
                { text: "Google adverts to your items/shop", included: false },
                { text: "Shop front for your items", included: false },
                { text: "Facebook/instagram ads", included: false },
                { text: "Phone number on Social Media ads", included: false },
                { text: "Direct link to your website", included: false },
            ],
        },
        {
            name: "Basic Plan",
            price: 100,
            features: [
                { text: "Free 5 Listings. No sale no fee", included: true },
                { text: "Listing review & optimization", included: true },
                { text: "Sponsored Upfrica homepage", included: true },
                { text: "Display Phone on your ads", included: true },
                { text: "Options for online payment before delivery or Click & Collect", included: true },
                { text: "3% fee per online payment", included: true },
                { text: "Google adverts to your items/shop", included: false },
                { text: "Shop front for your items", included: false },
                { text: "Facebook/instagram ads", included: false },
                { text: "Phone number on Social Media ads", included: false },
                { text: "Direct link to your website", included: false },
            ],
        },
        {
            name: "Standard Plan",
            price: 300,
            features: [
                { text: "Unlimited Listing", included: true },
                { text: "Listing review & optimization", included: true },
                { text: "Shop front for your items", included: true },
                { text: "Sponsored Upfrica homepage", included: true },
                { text: "Google adverts to your items/shop", included: true },
                { text: "Phone number on Upfrica ads", included: true },
                { text: "Display Phone on your ads", included: true },
                { text: "Options for online payment before delivery or Click & Collect", included: true },
                { text: "3% fee per online payment", included: true },
                { text: "Facebook/instagram ads", included: false },
                { text: "Phone number on Social Media ads", included: false },
                { text: "Direct link to your website", included: false },
            ],
        },
        {
            name: "Premium Plan",
            price: 450,
            features: [
                { text: "Unlimited Listing", included: true },
                { text: "Listing review & optimization", included: true },
                { text: "Shop front for your items", included: true },
                { text: "Google adverts to your items/shop", included: true },
                { text: "Facebook/instagram ads", included: true },
                { text: "Phone number on Upfrica ads", included: true },
                { text: "Phone number on Social Media ads", included: true },
                { text: "Sponsored all related item pages", included: true },
                { text: "Display Phone on your ads", included: true },
                { text: "Options for online payment before delivery or Click & Collect", included: true },
                { text: "Direct link to your website", included: true },
                { text: "3% fee per online payment", included: true },
            ]
        },
    ];

    // console.log(plans);

    return (
        <div className='bg-gray-50 py-10'>
            <div className=' text-center space-y-2'>
                <p className='text-base font-bold text-[#8710D8]'>Pricing</p>
                <h1 className='text-[56px] font-bold tracking-wide'>Plan That Fit Your Scale
                </h1>
                <p className='text-xl text-[#747579] tracking-wide'>Simple, transparent pricing that grows with you. Try any plan free for 30 days</p>
                <div className='py-10'>
                    <label className="inline-flex items-center cursor-pointer gap-4">
                        <span className="ms-3 text-base  text-gray-900 dark:text-gray-300 font-bold">
                            1 Week
                        </span>
                        <input
                            type="checkbox"
                            className="sr-only peer"
                        />
                        <div className="relative w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:rounded-full after:h-7 after:w-7 after:transition-all  peer-checked:bg-[#8710D8]"></div>
                        <span className="ms-3 text-base  text-gray-900 dark:text-gray-300 font-bold">
                            10 Month
                        </span>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 container mx-auto">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between ${plan.name === "Standard Plan" ? "border-2 border-[#8710D8]" : ""}`}
                    >
                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
                                <div className="text-gray-600 flex items-center space-x-1 mt-1">
                                    <span className="text-3xl font-semibold text-black">${plan.price}</span>
                                    <span className="text-xl text-gray-500">/ per account</span>
                                </div>
                            </div>

                            <div className={`${plan.name === "Standard Plan" ? "bg-purple-200 p-4"  : "bg-gray-200 p-4"} rounded-full`}>
                                {plan.name === "Standard Plan" ? (
                                    <span className=''>
                                        <FaRocket className="text-2xl h-6 w-6 text-[#8710D8]" /> {/* Rocket Icon for Standard Plan */}
                                    </span>
                                ) : plan.name === "Premium Plan" ? (
                                    <span className=''>
                                        <RiSendPlaneFill className="text-2xl h-6 w-6 text-black" /> {/* User Tie Icon for Premium Plan */}
                                    </span>
                                ) : (
                                    <span className=''>
                                        <BsLightningChargeFill className="text-black text-2xl h-6 w-6" /> {/* Lightning Charge Icon for others */}
                                    </span>
                                )}
                            </div>
                        </div>


                        {/* Divider */}
                        <hr className="my-4 border-gray-300" />

                        {/* Features */}
                        <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        {feature.included ? (
                                            <IoCheckmarkCircleOutline className="text-green-400 h-6 w-6" />
                                        ) : (
                                            <FaRegCircleXmark className="text-red-400 h-5 w-5" />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <span className="text-[#747579] text-lg leading-6">
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <button className={`mt-6 py-2 px-4 font-bold rounded-lg ${plan.name === "Standard Plan" ? "bg-[#8710D8] hover:bg-purple-700" : "bg-black hover:bg-gray-800"} text-white`}>
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>

            <div className='container mx-auto my-20 bg-[#f5f5f6] py-20'>
                <h2 className='text-center text-2xl font-bold leading-8'>Trusted by more than 900 companies around the world</h2>
            </div>

        </div>
    );
};

export default Price;