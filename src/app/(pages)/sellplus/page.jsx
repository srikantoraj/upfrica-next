import React from 'react';
import { FaLocationPin, FaCartPlus } from 'react-icons/fa'; // ইম্পোর্ট করা আইকন

const Sellplus = () => {
    return (
        <section className="bg-[#02431D] py-16 px-6 md:px-12 lg:px-24">
            <div className="md:max-w-5xl mx-auto text-center space-y-10 ">
                {/* হেডিং */}
                <h1 className="text-4xl md:text-7xl  font-bold text-white tracking-wide ">Welcome to Upfrica SellPlus</h1>
                <h3 className="text-2xl md:text-4xl text-white tracking-wide ">
                    Get any of your favorite selling items at wholesale price direct to your doorstep.
                </h3>

                {/* SellPost অ্যাকাউন্ট বোতামস */}
                <div className="flex justify-center space-x-4 flex-wrap ">
                    <button className="bg-[#6E00FF] text-white px-6 py-3 rounded-3xl shadow-md hover:bg-purple-600 transition duration-300 m-2 font-bold">
                    Select "SellPlus" Account 
                    </button>
                    
                    {/* প্রয়োজনে আরও বোতাম যোগ করুন */}
                </div>

                {/* তথ্যবহুল টেক্সট */}
                <p className="mt-8 text-gray-500 text-xl">
                    Our dedicated team has you covered. We'll source items from worldwide manufacturers,
                    deliver them to you and help you to sell quicker online.
                </p>

                {/* How It Works বোতাম */}
                <div className="mt-6">
                    <button className=" text-white px-6 py-3 rounded-3xl border border-black hover:bg-gray-800 transition duration-300">
                        How It Works
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Sellplus;