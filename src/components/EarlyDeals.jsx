// import Link from 'next/link';
// import React from 'react';
// import { IoIosArrowRoundForward } from 'react-icons/io';
// import { FaShoppingCart } from "react-icons/fa";

// const EarlyDeals = () => {
//     const products = [
//         {
//             id: 1,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOWNwQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5fb0c4639bac896546719299462b731745efd60b/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/air-bed-with-built-in-pump-mattress-self-inflatable-blow-up-double-bed-with-headboard.jpg",
//             oldPrice: 1200,
//             newPrice: 1000,
//         },
//         {
//             id: 2,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdmYrIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1b8d80159bd3fdb1d0e35f5b803d7904c0166a8c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-08-02%20at%2009.20.59.png",
//             oldPrice: 2000,
//             newPrice: 1800,
//         },
//         {
//             id: 3,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeDRuQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--879f8cc3e78abf2e805e7d4667061a0752f70c7e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/mens-watch-valentines-day-deyros-fashion-wristwatch-business-mesh-strap-quartz-watch-mens.jpg",
//             oldPrice: 1500,
//             newPrice: 1300,
//         },
//         {
//             id: 4,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMHdwQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--998c6b86a8e95e77128b5bf1da792d5dd725a7d9/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/mens-trainers-casual-walking-shoes-ergonomic-breathable--comfortable-with-non-slip-sole-for-outdoor-activities.webp",
//             oldPrice: 800,
//             newPrice: 700,
//         },
//         {
//             id: 5,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMmdLQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae4e612c5a6309eea12aaa104c7ec7981cb8348/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-09-24%20at%2005.54.02.png",
//             oldPrice: 2200,
//             newPrice: 2000,
//         },
//         {
//             id: 6,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNHNRQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0ae79558c9b56c2ff50db279c6da6e8f08d28032/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/cloth-100-cotton-fabrics-wax-print-nigeria-design-for-making-dress-craft-quilts-sewing-2-yards-6yards-piece.jpg",
//             oldPrice: 1800,
//             newPrice: 1600,
//         },
//         {
//             id: 7,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMnNVQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5c00a55b0ca7b2fed2366e3fda0546cc84596220/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/hair-dryer-for-travel--home.webp",
//             oldPrice: 3000,
//             newPrice: 2700,
//         },
//         {
//             id: 8,
//             image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb1o3IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d71b5ac401acf6e93dbb13c1cb7120ef119bee61/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/minijuicer.jpg",
//             oldPrice: 900,
//             newPrice: 850,
//         },
     
//     ];

//     return (
//         <div className=" mx-auto bg-white py-5 mb-2 px-5">
//             {/* Header */}
//             <div className="flex items-center gap-4 pb-4">
//                 <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">Early Black Friday</h1>
//                 <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
//             </div>
//             {/* <p className="mb-6">Deals</p> */}

//             {/* Products Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
//                 {products.map((product) => (
//                     <div
//                         key={product.id}
//                         className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col"
//                     >
//                         {/* Product Image */}
//                         <div className="flex-grow overflow-hidden">
//                             <img
//                                 src={product.image}
//                                 alt={`Product ${product.id}`}
//                                 className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
//                             />
//                         </div>

//                         {/* Bottom Section */}
//                         <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
//                             <div className="flex gap-2">
//                                 <p className="text-base font-bold text-gray-800">${product.newPrice}</p>
//                                 <p className="text-base text-gray-500 line-through">${product.oldPrice}</p>
//                             </div>
//                             <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
//                                 <FaShoppingCart className="text-purple-500" size={20} />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default EarlyDeals;


import Link from 'next/link';
import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineShoppingCart } from 'react-icons/ai';

const EarlyDeals = () => {
    const products = [
        {
            id: 1,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOWNwQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5fb0c4639bac896546719299462b731745efd60b/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/air-bed-with-built-in-pump-mattress-self-inflatable-blow-up-double-bed-with-headboard.jpg",
            oldPrice: 1200,
            newPrice: 1000,
        },
        {
            id: 2,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdmYrIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1b8d80159bd3fdb1d0e35f5b803d7904c0166a8c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-08-02%20at%2009.20.59.png",
            oldPrice: 2000,
            newPrice: 1800,
        },
        {
            id: 3,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeDRuQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--879f8cc3e78abf2e805e7d4667061a0752f70c7e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/mens-watch-valentines-day-deyros-fashion-wristwatch-business-mesh-strap-quartz-watch-mens.jpg",
            oldPrice: 1500,
            newPrice: 1300,
        },
        {
            id: 4,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMHdwQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--998c6b86a8e95e77128b5bf1da792d5dd725a7d9/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/mens-trainers-casual-walking-shoes-ergonomic-breathable--comfortable-with-non-slip-sole-for-outdoor-activities.webp",
            oldPrice: 800,
            newPrice: 700,
        },
        {
            id: 5,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMmdLQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae4e612c5a6309eea12aaa104c7ec7981cb8348/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--3ceea134a3025feae76cb0f22ed85d15b2b1bb6d/Screenshot%202024-09-24%20at%2005.54.02.png",
            oldPrice: 2200,
            newPrice: 2000,
        },
        {
            id: 6,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNHNRQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0ae79558c9b56c2ff50db279c6da6e8f08d28032/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/cloth-100-cotton-fabrics-wax-print-nigeria-design-for-making-dress-craft-quilts-sewing-2-yards-6yards-piece.jpg",
            oldPrice: 1800,
            newPrice: 1600,
        },
        {
            id: 7,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMnNVQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5c00a55b0ca7b2fed2366e3fda0546cc84596220/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFJc0FXa0NMQUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--9131f2cc4e102d7d1c165a6edf8ccf37bd2eafc6/hair-dryer-for-travel--home.webp",
            oldPrice: 3000,
            newPrice: 2700,
        },
        {
            id: 8,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb1o3IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d71b5ac401acf6e93dbb13c1cb7120ef119bee61/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWl3QmFRSXNBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e99d0413c0a2cac1bc7779b07c13f2159cbd0f0f/minijuicer.jpg",
            oldPrice: 900,
            newPrice: 850,
        },
    ];

    return (
        <div className="container bg-white py-5 mb-2 px-5 rounded-lg">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4">
                <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">Early Black Friday</h1>
                <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border shadow-lg rounded-lg overflow-hidden h-56 flex flex-col min-w-[200px]"
                    >
                        {/* Product Image */}
                        <div className="flex-grow overflow-hidden">
                            <img
                                src={product.image}
                                alt={`Product ${product.id}`}
                                className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
                            />
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between px-2 py-1 bg-gray-100">
                            <div className="flex gap-2">
                                <p className="text-base font-bold text-gray-800">${product.newPrice}</p>
                                <p className="text-base text-gray-500 line-through">${product.oldPrice}</p>
                            </div>
                            <button className="p-1 border border-gray-300 rounded hover:bg-gray-200">
                                <AiOutlineShoppingCart className="w-6 h-6 text-purple-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EarlyDeals;

