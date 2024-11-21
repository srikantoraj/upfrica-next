'use client'
import React from "react";
import { FaBars, FaDownload } from "react-icons/fa";
import { MdDownloadForOffline } from "react-icons/md";
import { HiMiniBars3 } from "react-icons/hi2";
import { HiDownload } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";

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

            <div className="bg-[#1c1e21] text-white  lg:h-[400px]  flex justify-center  items-center">
                <div className="max-w-screen-lg px-4 sm:px-6 grid  md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-2 gap-4 mx-auto ">
                    <div className="p-5 space-y-10">
                        <img src="https://static.whatsapp.net/rsrc.php/yA/r/hbGnlm1gXME.svg" alt="" />
                        <button
                            type="button"
                            className=" rounded-full border-2 border-neutral-800 px-8 py-4 bg-[#25d366] flex gap-1 items-center"
                        >
                            Dowonlod
                            <span><HiDownload className="h-6 w-8" /></span>
                        </button>
                    </div>
                    <div className="p-5 space-y-5 text-lg">
                        <div className="text-sm ">What We Do</div>
                        <a className="my-3 block" href="/#">Features</a>
                        <a className="my-3 block" href="/#">Blog</a>
                        <a className="my-3 block" href="/#">Security</a>
                        <a className="my-3 block" href="/#">For Business</a>
                    </div>

                    <div className="p-5 space-y-5 text-lg">
                        <div className="text-sm ">Who We Are</div>
                        <a className="my-3 block" href="/#">About Us</a>
                        <a className="my-3 block" href="/#">Careers</a>
                        <a className="my-3 block" href="/#">Brand Center</a>
                        <a className="my-3 block" href="/#">Privacy</a>
                    </div>
                    <div className="p-5 space-y-5 text-lg">
                        <div className="text-sm ">Who We Are</div>
                        <a className="my-3 block" href="/#">About Us</a>
                        <a className="my-3 block" href="/#">Careers</a>
                        <a className="my-3 block" href="/#">Brand Center</a>
                        <a className="my-3 block" href="/#">Privacy</a>
                    </div>
                    <div className="p-5 space-y-5 text-lg">
                        <div className="text-sm ">Who We Are</div>
                        <a className="my-3 block" href="/#">About Us</a>
                        <a className="my-3 block" href="/#">Careers</a>
                        <a className="my-3 block" href="/#">Brand Center</a>
                        <a className="my-3 block" href="/#">Privacy</a>
                    </div>


                </div>
            </div>

            <div className="py-9 border-t border-gray-200">
                <div className="flex items-center justify-center flex-col gap-8 lg:gap-0 lg:flex-row lg:justify-between">

                    <span className="text-sm text-gray-500">
                        ©<a href="https://pagedone.io/">pagedone</a> 2024, All rights reserved.
                    </span>


                    <div className="flex mt-4 space-x-4 sm:justify-center sm:mt-0">

                        <a href="javascript:;"
                            className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M11.3214 8.93654L16.4919 3.05554H15.2667L10.7772 8.16193L7.1914 3.05554H3.05566L8.47803 10.7773L3.05566 16.9444H4.28097L9.022 11.5519L12.8088 16.9444H16.9446L11.3211 8.93654H11.3214ZM9.64322 10.8453L9.09382 10.0764L4.72246 3.95809H6.60445L10.1322 8.89578L10.6816 9.66469L15.2672 16.0829H13.3852L9.64322 10.8456V10.8453Z" fill="white" />
                            </svg>
                        </a>


                        <a href="javascript:;"
                            className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600">
                            <svg className="w-[1.25rem] h-[1.125rem] text-white" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.70975 7.93663C4.70975 6.65824 5.76102 5.62163 7.0582 5.62163C8.35537 5.62163 9.40721 6.65824 9.40721 7.93663C9.40721 9.21502 8.35537 10.2516 7.0582 10.2516C5.76102 10.2516 4.70975 9.21502 4.70975 7.93663ZM3.43991 7.93663C3.43991 9.90608 5.05982 11.5025 7.0582 11.5025C9.05658 11.5025 10.6765 9.90608 10.6765 7.93663C10.6765 5.96719 9.05658 4.37074 7.0582 4.37074C5.05982 4.37074 3.43991 5.96719 3.43991 7.93663ZM9.97414 4.22935C9.97408 4.39417 10.0236 4.55531 10.1165 4.69239C10.2093 4.82946 10.3413 4.93633 10.4958 4.99946C10.6503 5.06259 10.8203 5.07916 10.9844 5.04707C11.1484 5.01498 11.2991 4.93568 11.4174 4.81918C11.5357 4.70268 11.6163 4.55423 11.649 4.39259C11.6817 4.23095 11.665 4.06339 11.6011 3.91109C11.5371 3.7588 11.4288 3.6286 11.2898 3.53698C11.1508 3.44536 10.9873 3.39642 10.8201 3.39635H10.8197C10.5955 3.39646 10.3806 3.48424 10.222 3.64043C10.0635 3.79661 9.97434 4.00843 9.97414 4.22935Z" fill="currentColor"></path>
                            </svg>
                        </a>


                        <a href="javascript:;"
                            className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600">
                            <svg className="w-[1rem] h-[1rem] text-white" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.8794 11.5527V3.86835H0.318893V11.5527H2.87967H2.8794ZM1.59968 2.81936C2.4924 2.81936 3.04817 2.2293 3.04817 1.49188C3.03146 0.737661 2.4924 0.164062 1.61666 0.164062C0.74032 0.164062 0.167969 0.737661 0.167969 1.49181C0.167969 2.22923 0.723543 2.8193 1.5829 2.8193H1.59948L1.59968 2.81936Z" fill="currentColor"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>



        </nav>
    );
};

export default Navbar;
