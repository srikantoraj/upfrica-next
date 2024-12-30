'use client'
import React from "react";
import { FaBars, FaDownload } from "react-icons/fa";
import { MdDownloadForOffline } from "react-icons/md";
import { HiMiniBars3 } from "react-icons/hi2";
import { HiDownload } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

// import whatsappLogo from "./whatsapp-logo.png"; // Replace with your WhatsApp logo path

const Navbar = () => {
    return (
        <nav>
            <div className=" flex items-center justify-between py-4 px-4">
                {/* Left: 3-bar icon or WhatsApp logo */}
                <div className="flex items-center">
                    {/* Show 3-bar icon on sm, md, lg; WhatsApp logo on xl */}
                    <button className=" text-2xl xl:hidden">
                        <HiMiniBars3 />
                    </button>
                    <img
                        src="https://static.whatsapp.net/rsrc.php/yZ/r/JvsnINJ2CZv.svg"
                        alt="WhatsApp"
                        className="w-32 h-24 hidden xl:block"
                    />
                </div>

                {/* Center: WhatsApp logo or Menu items */}
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://static.whatsapp.net/rsrc.php/yZ/r/JvsnINJ2CZv.svg"
                        alt="WhatsApp"
                        className="w-24 h-12 xl:hidden"
                    />
                    <ul className="hidden xl:flex gap-6 text-xl">
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                Features
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                Privacy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                Blog
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                For Business
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors duration-200"
                            >
                                Apps
                            </a>
                        </li>
                    </ul>

                </div>

                {/* Right: Download icon */}
                <div>
                    <button className="text-white text-2xl hover:text-green-400 xl:hidden">
                        <MdDownloadForOffline className="text-green-500 h-8 w-8  " />
                    </button>
                    <div className=" hidden xl:block items-center justify-between py-4 px-4">


                        {/* Center: Buttons */}
                        <div className=" gap-4 text-lg hidden xl:flex  font-bold">
                            {/* Login Button */}
                            <button
                                type="button"
                                className=" rounded-full border-2 border-neutral-800 px-8 py-4 flex gap-1 items-center"
                            >
                                Log in
                                <span><IoIosArrowForward className="h-6 w-8" /></span>
                            </button>

                            {/* Download Button */}
                            <button
                                type="button"
                                className=" rounded-full border-2 border-neutral-800 px-8 py-4 bg-[#25d366] flex gap-1 items-center"
                            >
                                Dowonlod
                                <span><HiDownload className="h-6 w-8" /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center  p-6 rounded-lg space-y-10">
                {/* Image */}
                <img
                    src="https://pps.whatsapp.net/v/t61.24694-24/414462285_747746150787852_3759673321424531599_n.jpg?ccb=11-4&oh=01_Q5AaIIMuItCGn2x16QcAEn3PTb7zBDOZu0LkE3KN-iqDXMSo&oe=67429F91&_nc_sid=5e03e0&_nc_cat=107"
                    alt="Placeholder"
                    className="mx-auto mb-4 w-[160px] h-[160px]  rounded-full object-cover"
                />

                {/* Name */}
                <h2 className="text-3xl  mb-2 tracking-wide">Upfricagh</h2>

                {/* Button */}
                <button className="bg-[#128C73] text-white px-8 py-4 mb-4 transition-colors rounded-full">
                    Continue to Chat
                </button>

                {/* Horizontal Line */}
                <hr className="border-t-2 border-gray-200 max-w-6xl mx-auto" />

                <div className="space-y-3 text-base font-bold py-5">
                    <p className="">Don't have WhatsApp yet?</p>
                    <p className="text-blue-400">Dowonload</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="lg:h-[400px] flex items-center py-8">
                    <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 px-6">
                        {/* Logo and Download */}
                        <div className="flex flex-col col-span-2 md:col-span-1 items-center lg:items-start">
                            <img
                                className="h-24 w-24 mb-4"
                                src="https://static.whatsapp.net/rsrc.php/yA/r/hbGnlm1gXME.svg"
                                alt="Logo"
                            />
                            <button
                                type="button"
                                className="rounded-full border border-neutral-800 px-6 py-2 bg-[#25d366] flex items-center gap-2 text-black font-semibold hover:bg-[#1da854] transition-all"
                            >
                                Download <HiDownload className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Links Section */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">What We Do</h3>
                            <a href="#" className="block hover:underline">
                                Features
                            </a>
                            <a href="#" className="block hover:underline">
                                Blog
                            </a>
                            <a href="#" className="block hover:underline">
                                Security
                            </a>
                            <a href="#" className="block hover:underline">
                                For Business
                            </a>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Who We Are</h3>
                            <a href="#" className="block hover:underline">
                                About Us
                            </a>
                            <a href="#" className="block hover:underline">
                                Careers
                            </a>
                            <a href="#" className="block hover:underline">
                                Brand Center
                            </a>
                            <a href="#" className="block hover:underline">
                                Privacy
                            </a>
                        </div>

                        {/* Duplicate Sections for Example */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Help</h3>
                            <a href="#" className="block hover:underline">
                                Support
                            </a>
                            <a href="#" className="block hover:underline">
                                Contact
                            </a>
                            <a href="#" className="block hover:underline">
                                FAQ
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-500"
                                >
                                    <FaFacebook size={24} />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-500"
                                >
                                    <FaInstagram size={24} />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-500"
                                >
                                    <FaYoutube size={24} />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400"
                                >
                                    <FaTwitter size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-600" />

                {/* Bottom Section */}
                <div className="py-4">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-6">
                        <p className="text-sm">&copy; 2024 Your Company Name</p>

                        <div className="text-sm flex space-x-4">
                            <a href="#" className="hover:underline">
                                Terms
                            </a>
                            <a href="#" className="hover:underline">
                                Privacy
                            </a>
                        </div>

                        <button className="bg-gray-700 px-4 py-2 rounded-md text-white">
                            Language ▼
                        </button>
                    </div>
                </div>
            </div>




        </nav>
    );
};

export default Navbar;
