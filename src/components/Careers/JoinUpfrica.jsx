
'use client';
import { useState } from 'react';

// const joinContent = [
//     "Are you ready to make a difference in the travel industry? At Go Girls, we're not just a tech-savvy travel company; we are on a mission to empower women to explore the world with confidence and joy. Founded in 2024, we’ve made it our priority to create a world where travel is fun, affordable, and secure specifically for women.",
//     "Imagine being part of a dynamic team that helps women discover amazing travel experiences with our user-friendly app and website. We offer fantastic deals on hotels, flights, and activities, making travel planning a breeze. Plus, our dedicated support team is available 24/7 across 12 different markets, ensuring our travelers have assistance whenever they need it.",
//     "At Go Girls, you will have the opportunity to connect women with trusted travel partners, create safer and more enjoyable travel experiences, and help bring our innovative ideas, like our virtual reality preview tool, to life.",
//     "If you're passionate about travel, women’s empowerment, and making a positive impact, we invite you to explore career opportunities with us. Let’s explore the world together and create unforgettable experiences for women travelers everywhere! Join us and be a part of something meaningful!"
// ];


const joinContent = [
    "Welcome to Upfrica, your ultimate destination for seamless online shopping. We are committed to bringing you a modern, trustworthy, and innovative e-commerce experience!",
    "Our platform connects you with a wide range of premium products, offering fast delivery, secure payments, and 24/7 customer support. Whether you are shopping for fashion, electronics, beauty, or lifestyle products — we have it all under one roof!",
    "At Upfrica, we focus on quality, affordability, and customer satisfaction. With easy-to-use mobile and web platforms, we make shopping more enjoyable, smarter, and safer than ever before.",
    "If you're passionate about innovation, customer service, and building the future of e-commerce, join the Upfrica journey. Let's make shopping extraordinary together!"
];

export default function JoinUpfrica() {
    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => setShowMore((prev) => !prev);

    return (
        <section className="px-4 py-8 bg-white">
            
            <div className="container mx-auto grid md:grid-cols-2 gap-12">
                {/* Left: Join Content */}
                <div className='md:hidden'>
                    {joinContent.slice(0, 2).map((paragraph, index) => (
                        <p key={index} className="text-lg text-gray-700 mb-4">
                            {paragraph}
                        </p>
                    ))}
                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${showMore ? 'max-h-screen mt-4' : 'max-h-0'
                            }`}
                    >
                        {joinContent.slice(2).map((paragraph, index) => (
                            <p key={index} className="text-lg text-gray-700 mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={toggleShowMore}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none flex items-center"
                        >
                            <span>{showMore ? 'See Less' : 'See More'}</span>
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 ml-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div className='hidden md:block'>
                    {joinContent.slice(0, 3).map((paragraph, index) => (
                        <p key={index} className="text-lg text-gray-700 mb-4">
                            {paragraph}
                        </p>
                    ))}
                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${showMore ? 'max-h-screen mt-4' : 'max-h-0'
                            }`}
                    >
                        {joinContent.slice(3).map((paragraph, index) => (
                            <p key={index} className="text-lg text-gray-700 mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={toggleShowMore}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none flex items-center"
                        >
                            <span>{showMore ? 'See Less' : 'See More'}</span>
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 ml-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right: Image Gallery */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Column 1: Single Image */}
                    <div className="flex flex-col space-y-4">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                alt="Connecting people"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Column 2: Two Stacked Images */}
                    <div className="flex flex-col space-y-4">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                alt="Team meeting"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                                alt="Brainstorming session"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Column 3: Two Stacked Images */}
                    <div className="flex flex-col space-y-4">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                                alt="Discussion"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                alt="Celebration"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}




