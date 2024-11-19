import MobileNav from '@/components/support/MobileNav';
import { CgMail } from "react-icons/cg";
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import React from 'react';

const Support = () => {
    const cardData = [
        {
            id: 1,
            name: "Jane Smith",
            title: "UI/UX Designer",
            image: "https://assets.website-files.com/5e77cec29a2d833ece98ee9f/5e77cec29a2d83321998eed3_icon-payments.svg",
        },
        {
            id: 2,
            name: "John Doe",
            title: "Software Engineer",
            image: "https://assets.website-files.com/5e77cec29a2d833ece98ee9f/5e77cec29a2d83321998eed3_icon-payments.svg",
        },
        {
            id: 3,
            name: "Alice Johnson",
            title: "Product Manager",
            image: "https://assets.website-files.com/5e77cec29a2d833ece98ee9f/5e77cec29a2d83321998eed3_icon-payments.svg",
        },
        {
            id: 4,
            name: "David Lee",
            title: "Graphic Designer",
            image: "https://assets.website-files.com/5e77cec29a2d833ece98ee9f/5e77cec29a2d83321998eed3_icon-payments.svg",
        },
        {
            id: 5,
            name: "Emily Brown",
            title: "Marketing Specialist",
            image: "https://assets.website-files.com/5e77cec29a2d833ece98ee9f/5e77cec29a2d8398aa98eeb3_frequently-asked-question.svg",
        },
    ];

    return (
        <div className=''>
            {/* Mobile Navigation */}
            <MobileNav />

            {/* Help Center Section */}
            <div className="relative bg-blue-600 h-[600px] text-white px-4">
                <div className="text-center py-20 space-y-6">
                    {/* First Title */}
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Upfrica Help Center
                    </h1>

                    {/* Second Title */}
                    <h2 className="text-3xl font-semibold">
                        Have questions? Search through our Help Center.
                    </h2>

                    {/* Search Bar */}
                    <form className="mt-10 mx-auto max-w-4xl py-3 px-8 rounded-full bg-gray-50 border flex focus-within:border-gray-300 shadow-lg">
                        <input
                            type="text"
                            placeholder="Search anything"
                            className="bg-transparent w-full focus:outline-none pr-4 border-0 focus:ring-0 px-6 py-3 text-lg text-gray-500"
                            name="topic"
                        />
                        <button className="flex items-center justify-center min-w-[150px] px-6 rounded-full tracking-wide border disabled:cursor-not-allowed disabled:opacity-50 transition-all ease-in-out duration-300 text-base bg-blue-600 text-white py-4 h-[42px] ml-4 font-bold hover:bg-blue-700">
                            Search
                        </button>
                    </form>
                </div>

            </div>

            {/* Cards Section */}
            <div className="bg-gray-100 relative z-10 py-20 px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
                    {/* Cards */}
                    <div className="col-span-2 space-y-10">
                        {cardData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-10 h-80 rounded-2xl shadow-2xl flex items-center hover:shadow-3xl transition-all duration-300 transform hover:translate-y-[-10px]"
                            >
                                {/* Left Side: Image */}
                                <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden mr-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Right Side: Name and Title */}
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <p className="text-gray-500">{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Cart Details Section */}
                    <div className="col-span-1 h-auto bg-white p-10 rounded-2xl shadow-2xl space-y-6">
                        {/* Title */}
                        <h2 className="text-3xl font-bold ">Need Extra Support?</h2>

                        {/* Description */}
                        <p className="text-gray-500 text-2xl">
                            Can’t find what you’re looking for? Get in touch with us today!
                        </p>

                        {/* Contact Button */}
                        <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-full hover:bg-blue-600 transition text-base font-bold">
                            Contact Support
                        </button>

                        {/* Horizontal Line */}
                        <hr className="my-6 border-gray-300" />

                        {/* Contact Information */}
                        <p className='text-3xl font-bold '>Contact Information</p>
                        <p className='text-xl pl-24'>( +233) 554248805</p>

                        {/* Message Icon with Click to Continue */}
                        <div className='flex text-2xl items-center gap-4'>
                            <span className='bg-gray-200 p-2 rounded-full'><CgMail className='h-8 w-8 text-blue-500' /></span>
                            <p>Click to continue</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* footer section  */}
            <footer className="px-3 pt-4 lg:px-9  bg-gray-100">
                <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-5 container mx-auto">

                    <div className="sm:col-span-2">
                        <a href="#" className="inline-flex items-center space-x-4">
                            <img src="https://assets.website-files.com/5e77cec29a2d83297b98ee8c/5e77cec29a2d837ef598eedf_docs-logo.svg" alt="logo" className="h-20 w-20" />
                            {/* Vertical Divider (Hidden on Mobile) */}
                            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

                            {/* Help Center (Hidden on Mobile) */}
                            <span className="hidden sm:block text-gray-600 text-xl sm:text-2xl font-medium hover:text-blue-600 transition duration-300">
                                Help Center
                            </span>
                        </a>
                        <div className="mt-6 lg:max-w-xl">
                            <p className="text-base font-bold text-gray-600">
                                Upfrica is a multinational marketplace of reliable sellers and active buyers. We provide a powerful yet simplified tools, helping you to sell online faster.
                            </p>
                            <div className="flex  space-x-6 p-4">
                                {/* Facebook Icon */}
                                <a href="https://www.facebook.com" className="text-blue-600 hover:text-blue-700">
                                    <FaFacebook className="w-8 h-8" />
                                </a>

                                {/* LinkedIn Icon */}
                                <a href="https://www.linkedin.com" className="text-blue-700 hover:text-blue-800">
                                    <FaLinkedin className="w-8 h-8" />
                                </a>

                                {/* Instagram Icon */}
                                <a href="https://www.instagram.com" className="text-pink-500 hover:text-pink-600">
                                    <FaInstagram className="w-8 h-8" />
                                </a>

                                {/* Twitter Icon */}
                                <a href="https://www.twitter.com" className="text-blue-400 hover:text-blue-500">
                                    <FaTwitter className="w-8 h-8" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-lg text-gray-600">
                        <p className=" font-bold tracking-wide text-gray-900 ">Menu</p>
                        <a href="#">Home</a>
                        <a href="#">Products</a>
                        <a href="#">Categore</a>

                    </div>

                    <div className='space-y-3 text-lg text-gray-600'>
                        <p className=" font-bold tracking-wide text-gray-900 ">Category</p>
                        <p>Sell on Upfrica</p>
                        <p>How it work</p>
                    </div>
                    <div className='space-y-3 text-lg text-gray-600'>
                        <p className=" font-bold tracking-wide text-gray-900 ">Popular Questions</p>
                        <p> How does Upfrica works?</p>
                        <p>How do I create a Upfrica account?</p>
                    </div>

                </div>

                <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
                    <p className="text-sm text-gray-600">© Copyright 2023 Company. All rights reserved.</p>
                    <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                        <li>
                            <a href="#" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Privacy &amp; Cookies Policy</a>
                        </li>
                        <li>
                            <a href="#" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Disclaimer</a>
                        </li>
                    </ul>
                </div>
            </footer>


        </div>

    );
};

export default Support;
