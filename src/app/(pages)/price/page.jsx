import React from 'react';
import { FaCheck, FaRocket, FaTimes, FaUserTie } from "react-icons/fa";
import { BiLightningCharge } from 'react-icons/bi';
import { BsLightningChargeFill } from 'react-icons/bs';
import { IoArrowForwardCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
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

    const data = [
        {
            id: 1,
            title: "Do you provide customer support?",
            description: "Family months lasted simple set nature vulgar him. Picture for attempt joy excited ten carried manners talking how. Suspicion neglected the resolving agreement perceived at an. Comfort reached gay perhaps chamber his six detract besides add.",
        },
        {
            id: 2,
            title: "What is your privacy policy?",
            description: "Two before narrow not relied how except moment myself Dejection assurance mrs led certainly So gate at no only none open Betrayed at properly it of graceful on Dinner abroad am depart ye turned hearts as me wished Therefore allowance too perfectly gentleman supposing man his.",
        },
        {
            id: 3,
            title: "Is there a money-back guarantee?",
            description: "Two before narrow not relied how except moment myself Dejection assurance mrs led certainly So gate at no only none open Betrayed at properly it of graceful on Dinner abroad am depart ye turned hearts as me wished Therefore allowance too perfectly gentleman supposing man his.",
        },
        {
            id: 4,
            title: "What's the difference between monthly and annual plans?",
            description: "Started several mistake joy say painful removed reached end. State burst think end are its. Arrived off she elderly beloved him affixed noisier yet. Tickets regard to up he hardly. View four has said do men saw find dear shy. Talent men wicket add garden.",
        },
        {
            id: 5,
            title: "How can I buy your software?",
            description: "Lose john poor same it case do year we Full how way even the sigh Extremely nor furniture fat questions now provision incommode preserved Our side fail to find like now Discovered traveling for insensible partiality unpleasing.",
        },
        {
            id: 6,
            title: "What happens after the trial ends?",
            description: "Preference any astonished unreserved Mrs. Prosperous understood Middletons in conviction an uncommonly do. Supposing so be resolving breakfast am or perfectly.",
        },
    ];

    return (
        <div className='bg-gray-50 pb-10  lg:px-0'>
            <div className=' text-center space-y-2 lg:space-y-8'>
                <p className='text-lg lg:text-xl font-bold text-[#8710D8]'>Pricing</p>
                <h1 className='text-2xl lg:text-[56px] font-bold tracking-wide'>Plan That Fit Your Scale
                </h1>
                <p className='text-lg lg:text-xl text-[#747579] tracking-wide'>Simple, transparent pricing that grows with you. Try any plan free for 30 days</p>
                <div className='py-4 lg:py-10'>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto">
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

                            <div className={`${plan.name === "Standard Plan" ? "bg-purple-200 p-4" : "bg-gray-200 p-4"} rounded-full`}>
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
                        <ul className="space-y-3">
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
                        <button className={`mt-6 py-2 px-4 font-bold rounded-lg text-lg  md:text-xl ${plan.name === "Standard Plan" ? "bg-[#8710D8] hover:bg-purple-700" : "bg-black hover:bg-gray-800"} text-white`}>
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>

            <div className='container mx-auto my-20 bg-[#f5f5f6] py-10 lg:py-20'>
                <h2 className='text-center text-xl lg:text-2xl font-bold leading-8'>Trusted by more than 900 companies around the world</h2>
            </div>

            {/* Frequently Asked */}
            <div>
                <div className='text-center space-y-3 '>
                    <h1 className='text-3xl lg:text-6xl font-bold tracking-wide'>Frequently Asked Questions</h1>
                    <p className='text-lg md:text-xl tracking-wide text-[#747579] '>Perceived end knowledge certainly day sweetness why cordially</p>
                </div>
                <div className="container mx-auto  py-10">
                    {/* Responsive grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg p-6"
                            >
                                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                                <p className="text-[#747579]  leading-relaxed text-lg">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='container mx-auto my-10 bg-[#f5f5f6] p-8 lg:p-20 xl:flex justify-between items-center space-y-5'>
                <div className='space-y-3'>
                    <h2 className='text-2xl lg:text-4xl font-bold tracking-wide'>Still, have a question?</h2>
                    <p className='text-lg text-[#747579]'>He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy.</p>
                </div>
                <button className='flex gap-1 items-center bg-[#A435F0] text-white font-bold text-base lg:text-xl px-6 py-3 rounded-md'>
                    Contact Us
                    <span><IoArrowForwardCircleOutline className='h-6 w-6' /></span>
                    </button>
            </div>

        </div>
    );
};

export default Price;