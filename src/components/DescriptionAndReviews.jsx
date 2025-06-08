"use client";
import React, { useState } from "react";
import { MdOutlinePhone } from "react-icons/md";
import CustomerReviewsSection from "./CustomerReviewsSection";
import CreateReves from './CreateReviews';

export default function DescriptionAndReviews({ details, user }) {
    const [showPhone, setShowPhone] = useState(false);
    const [openTab, setOpenTab] = useState("specifics"); // default open

    const phoneText = showPhone ? user?.phone_number : "Click to view number";

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-8 text-gray-800">
            {/* Section Header */}
            <header className="pb-4 border-b border-gray-300">
                <h5 className="font-light text-xs md:text-sm lg:text-base text-gray-500 mb-1">
                    Future of Sneakers in Ghana Best Sale Price: Upfrica
                </h5>
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
                    Item Details
                </h2>
            </header>

            {/* Collapsible Tabs */}
            <section className="mt-6">
                {/* Product Specifics */}
                <div className="border rounded-xl mb-4">
                    <button
                        onClick={() => setOpenTab(openTab === 'specifics' ? '' : 'specifics')}
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Product specifics
                        <span>{openTab === 'specifics' ? '−' : '+'}</span>
                    </button>
                    {openTab === 'specifics' && (
                        <div className="p-4 border-t text-sm text-gray-700 space-y-1">
                            <p><b>Seller location:</b> {user?.town} - {user?.country}</p>
                            <p><b>Condition:</b> Brand New</p>
                            {/* Add more static/dynamic specifics if needed */}
                        </div>
                    )}
                </div>

                {/* Item Description */}
                <div className="border rounded-xl">
                    <button
                        onClick={() => setOpenTab(openTab === 'description' ? '' : 'description')}
                        className="w-full flex justify-between items-center p-4 font-medium text-left"
                    >
                        Item description from seller
                        <span>{openTab === 'description' ? '−' : '+'}</span>
                    </button>
                    {openTab === 'description' && (
                        <div
                            className="p-4 border-t text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: details }}
                        />
                    )}
                </div>
            </section>

            {/* Seller Info Card */}
            <section className="mt-8 max-w-xl">
                <div className="lg:p-4 md:p-6">
                    <div className="flex flex-col gap-4">
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

                        <div className="flex justify-between gap-2 text-center">
                            <button className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold">Save seller</button>
                            <button className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold">Shop all items</button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPhone(!showPhone)}
                            className="flex items-center gap-2 justify-center w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-sm font-semibold"
                        >
                            <MdOutlinePhone />
                            {phoneText}
                        </button>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="mt-12">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold border-b pb-2 mb-4">
                    Verified Customer Review
                </h3>


                <CustomerReviewsSection />
            </section>

            <CreateReves />

            {/* Legal Disclaimer */}
            <section className="bg-gray-100 p-4 mt-12 rounded-md text-sm leading-relaxed">
                <p className="mb-2"><strong>Legal Disclaimer:</strong> The Seller takes full responsibility for this listing.</p>
                <p className="mb-2">
                    Product info may change. Always read the label and packaging before use. If in doubt, contact the manufacturer.
                </p>
                <p className="mb-2">
                    Content is not intended as medical advice. Contact a health professional if needed.
                </p>
                <p>
                    Upfrica is not liable for product errors or third-party misinformation. Your statutory rights are unaffected.
                </p>
            </section>
        </main>
    );
}