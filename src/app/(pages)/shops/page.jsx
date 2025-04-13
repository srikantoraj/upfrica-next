'use client'
import React, { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';


const Shops = () => {
    const products = [
        {
            id: 1,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBODBEQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--77b0220fea89161126e55a467a745965c30ce61c/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bd58729da459fbfda670b840147c70989e0602a2/3333333333333.jpg", // Replace with actual image URL
            name: "Wireless Headphones",
            price: "$59.99"
        },
        {
            id: 2,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNG9LQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--cd86a9c18c76194b89b37d6c4042f2a0d81ce108/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--29660478de3e7db46108b4d681e7f0be8b9f3f86/IMG_1567.jpeg",
            name: "Smart Watch",
            price: "$129.99"
        },
        {
            id: 3,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeDBKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--64a026e93e6c69b3734c119aa1408446ba2eef92/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202024-09-10%20145536.png",
            name: "Gaming Mouse",
            price: "$49.99"
        },
        {
            id: 4,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdGpIIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--9fa851b893170102d603bd9fcaa4ef35947faaa0/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bd58729da459fbfda670b840147c70989e0602a2/Screenshot_20240106-133904~2.jpg",
            name: "Bluetooth Speaker",
            price: "$39.99"
        },
        {
            id: 5,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBa1hHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2b01d5e2b87649197bd92c31b0dc3278d9406852/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--29660478de3e7db46108b4d681e7f0be8b9f3f86/eggs.jpeg",
            name: "Laptop Stand",
            price: "$29.99"
        },
        {
            id: 6,
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBalIzIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--917676ab1add8e668b6eba772835a86a6983dd9a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--29660478de3e7db46108b4d681e7f0be8b9f3f86/WhatsApp%20Image%202023-09-18%20at%2012.43.04.jpeg",
            name: "Mechanical Keyboard",
            price: "$99.99"
        }
    ];

//     useEffect(()=>{
//         const shops = async () => {
//             const res = await fetch('https://upfrica-staging.herokuapp.com/api/v1/shops/upfrica-uk')
//             if (!res.ok) {
//                 throw new Error('Failed to fetch categories');
//             }
        
//             const data = await res.json();
//             console.log('shopData',data)
//         }
//         shops()
//     },[]


// )



    return (
        <div className='px-4'>
            <div className="flex flex-col items-center  py-20  mx-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-center  mb-2">Browse Online Shops</h1>
                <p className="text-base lg:text-lg text-center text-gray-700 mb-4">
                    Variety of Shops in Ghana, Nigeria and more selling at low prices.
                </p>
                <p className="text-base lg:text-lg text-center text-gray-700 ">
                    Have something to sell? <span className="font-bold underline">Sell on Upfrica</span>
                </p>
            </div>

            <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div className='relative mb-28'>
                        <div key={product.id} className="  bg-white shadow-lg rounded-lg overflow-hidden">
                            {/* Product Image */}
                            <div className=" h-[400px] bg-black">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
                            </div>

                            {/* Product Details - Full width, displayed below the image */}

                        </div>
                        <div className="p-6 bg-white absolute -bottom-28 left-1/2 transform -translate-x-1/2 w-4/5 shadow-lg rounded-lg flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-lg text-gray-700 mb-4">{product.price}</p>

                            {/* Button with icon */}
                            <button className="bg-black text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                Visit Shop
                                <FaArrowRight />
                            </button>
                        </div>

                    </div>
                ))}
            </div>




        </div>
    );
};

export default Shops;