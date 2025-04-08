"use client";
import parse from 'html-react-parser';
import React, { useState } from "react";
import { MdOutlinePhone } from "react-icons/md";
import CustomerReviewsSection from "./CustomerReviewsSection";
import CreateReves from './CreateReviews';

/**
 * A reusable React + Tailwind CSS component that
 * displays your “description and reviews” section
 * in a polished, responsive layout.
 */
export default function DescriptionAndReviews({ details, user }) {
    // Toggle phone number
    const [showPhone, setShowPhone] = useState(false);
    const phoneText = showPhone ? user?.phone_number : "Click to view number";

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8 text-gray-800">
            {/* Section Header */}
            <header className="pb-6 border-b border-gray-300">
                <h5 className="font-light text-xs md:text-sm lg:text-base text-gray-500 mb-1">
                    Future of Sneakers in Ghana Best Sale Price: Upfrica
                </h5>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                    Item description from seller
                </h2>
            </header>



            {/* Sponsored - mobile only */}
            <section className="mt-8 block lg:hidden">
                <h4 className="text-lg md:text-xl font-semibold mb-3">
                    Sponsored{" "}
                    <span className="text-blue-600 ml-1">
                        <a href="/todays-deals" target="_blank" rel="noreferrer">
                            See more deals
                        </a>
                    </span>
                </h4>
                <div className="border rounded-md shadow overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="w-full md:w-1/2">
                            <a
                                href="/products/ktc-vegetable-oil-for-frying-baking-salad-with-high-omega-vitamin-e-pack-5l"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="w-full h-auto object-cover"
                                    alt="Ktc Oil 5l Vegetable"
                                    src="https://www.upfrica.com/rails/active_storage/blobs/redirect/eyJ..."
                                />
                            </a>
                        </div>
                        {/* Info */}
                        <div className="w-full md:w-1/2 p-3">
                            <h6 className="text-sm md:text-base font-semibold mb-2">
                                <a
                                    href="/products/ktc-vegetable-oil-for-frying-baking-salad-with-high-omega-vitamin-e-pack-5l"
                                    className="text-gray-800"
                                >
                                    KTC Oil 5l Vegetable from UK
                                </a>
                            </h6>
                            <div className="text-sm mb-1">
                                <del className="text-gray-400"></del>&nbsp;
                                <span className="font-bold">₵299</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Text */}
            <section className="mt-10 leading-relaxed text-sm md:text-base lg:text-lg">


                <div dangerouslySetInnerHTML={{ __html: details }} className='py-3' />


                {/* {parse(details)} */}


                <ul className="list-disc ml-5 my-3 space-y-1">
                    <li>Ergonomic Design – Sleek, modern look with a breathable mesh upper</li>
                    <li>Shock-Absorbing Sole – Advanced cushioning reduces impact</li>
                    <li>Ultra-Lightweight &amp; Flexible – Move effortlessly</li>
                    <li>Superior Traction – Durable rubber outsole</li>
                    <li>Stylish &amp; Versatile – Perfect for sports or everyday fashion</li>
                </ul>
                <p className="font-medium">
                    <b>Seller location:</b> {user?.town} - {user?.country}
                </p>
            </section>

            {/* Seller + Avatar Card */}
            <section className="mt-8 max-w-xl">
                <div className=" lg:p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                        {/* Avatar + Info */}
                        <div className="flex items-center gap-4">
                            <img
                                src="https://img.kwcdn.com/supplier-public-tag/1f66680860/7a1dec98-d11b-460c-89e2-25cc4703fa53_300x300.jpeg?imageView2/2/w/300/q/70/format/webp"
                                alt="Avatar"
                                className="w-16 h-16 rounded-full shadow"
                            />
                            <div>
                                <h6 className="text-sm md:text-base lg:text-lg font-medium mb-1">
                                   {user?.username}
                                </h6>
                                <ul className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
                                    <li>1 follower</li>
                                    <li className="text-green-600">55 Items</li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between  gap-2 text-center">
                            <button
                                type="button"
                                className="w-full border border-gray-300 rounded-full px-4 py-2 text-xs md:text-sm lg:text-base font-semibold"
                            >
                                Save seller
                            </button>
                            <button
                                type="button"
                                className="w-full border border-gray-300 rounded-full px-4 py-2 text-xs md:text-sm lg:text-base font-semibold"
                            >
                                Shop all items
                            </button>
                        </div>

                        {/* Phone Button */}
                        <button
                            type="button"
                            onClick={() => setShowPhone(!showPhone)}
                            className="flex items-center gap-2 justify-center w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-base md:text-sm lg:text-lg font-semibold "
                        >
                            <span><MdOutlinePhone /></span>
                            {phoneText}
                        </button>
                    </div>
                </div>
            </section>

            {/* Verified Customer Review */}
            <section className="mt-12">
                <h3 className="text-lg md:text-xl lg:text-2xl font-medium border-b pb-2 mb-4">
                    Verified Customer Review
                </h3>

                <div className="bg-gray-100 p-4 rounded-md mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="md:w-1/3 text-center">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">5.0</h3>
                            <p className="text-xs md:text-sm lg:text-base text-gray-600">
                                Based on 3 Customer Reviews
                            </p>
                            <div className="mt-1 text-yellow-400 text-lg md:text-xl">★★★★★</div>
                        </div>
                        <div className="md:w-2/3 flex flex-col space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2/3 bg-yellow-100 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: '95%' }}></div>
                                </div>
                                <span className="text-xs md:text-sm lg:text-base text-gray-700">85%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2/3 bg-yellow-100 h-2 rounded">
                                    <div className="bg-yellow-400 h-2 rounded" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-xs md:text-sm lg:text-base text-gray-700">75%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Reviews */}
                <CustomerReviewsSection />
            </section>

            {/* Write a Review */}
            <CreateReves />

            {/* Disclaimer */}
            <section className="bg-gray-100 p-4 mt-12 rounded-md text-sm md:text-base lg:text-lg leading-relaxed">
                <p className="mb-2">
                    <strong>Legal Disclaimer:</strong> The Seller takes full responsibility for this listing.
                </p>
                <p className="mb-2">
                    Although we make every effort to guarantee that the product information on our website is
                    accurate, manufacturers occasionally change the lists of ingredients. The information
                    displayed on our app or website may not match or contain additional information compared
                    to the actual product packing and materials. All product information on our website is
                    offered solely for informational reasons.
                </p>
                <p className="mb-2">
                    We advise you not to depend only on the data that is provided on our website. It is
                    important that you always read the product's labels, cautions, and instructions before
                    using or consuming it. Please carefully read any directions on the label or box and get in
                    touch with the manufacturer if you have any questions about a product, whether it be
                    safety issues or anything else.
                </p>
                <p className="mb-2">
                    This website's content is not meant to replace medical advice, pharmacy advice, or advice
                    from other licensed health care providers. If you think you might have a medical issue,
                    get in touch with your doctor right away. No disease or health condition should be
                    diagnosed, treated, cured, or prevented using the information and claims of products.
                </p>
                <p>
                    Regarding products made by manufacturers or other third parties, Upfrica.co.uk has no duty
                    for errors or misrepresentations. Your statutory rights are unaffected by this.
                </p>
            </section>
        </main>
    );
}
