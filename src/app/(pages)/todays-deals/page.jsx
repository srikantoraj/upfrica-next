import Link from "next/link";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";

const TodaysDeals = () => {
  const products = [
    {
      id: 1,
      title: "Stylish Watch",
      price: { cents: 2999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdGhqIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d3ccb6c56e672908cc7b04e5bfaf933afc06ccbb/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/sliding-door1.webp",
      ],
    },
    {
      id: 2,
      title: "Classic Shoes",
      price: { cents: 4999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaGtxIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3b8bdbc066c08644fa0e473582f9a41622f5ad45/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXZRQmFRTDBBVG9NWTI5dWRtVnlkRG9KZDJWaWNBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--0f68375eaf441ecd8b3a772d120bb6aff2c461ab/Screenshot%202022-09-17%20at%2021.43.38.png",
      ],
    },
    {
      id: 3,
      title: "Leather Jacket",
      price: { cents: 7999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBancrIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d65bf0de22df685e75c04b41e530555696ea7ccf/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/tttblak.webp",
      ],
    },
    {
      id: 4,
      title: "Headphones",
      price: { cents: 1999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbmx4IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3d7eb1ee3c91c075bf1a1b56f61067bccb1314cb/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/up-peenut.webp",
      ],
    },
    {
      id: 5,
      title: "Smartphone",
      price: { cents: 15999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdDE0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--edc016c887e0dc894de79e4a05cced53bb2bfea3/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--822becc989580aaeb23fb25e468593064e9c80da/uppress-5.webp",
      ],
    },
    {
      id: 6,
      title: "Sunglasses",
      price: { cents: 999 },
      product_images: [
        "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaGY5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8c7eece1605f06ea6a34682346c1509a5f0459e9/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFMMEFXa0M5QUU2REdOdmJuWmxjblE2Q1hkbFluQT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--29660478de3e7db46108b4d681e7f0be8b9f3f86/IMG_4455.jpeg",
      ],
    },
  ];

  return (
    <div className="container mx-auto py-5 px-2">
      <div className="  p-6 text-center py-20">
        <h1 className="text-2xl lg:text-4xl font-bold tracking-wide mb-2">
          Today's Deals Up to 50% Off
        </h1>
        <p className="text-xl lg:text-2xl mb-4">
          Best online sales items selling at low prices.
        </p>
        <p className="text-base lg:text-xl">
          Have something to sell?{" "}
          <span className="font-semibold text-blue-400 underline">
            Sell on Upfrica
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-lg relative flex flex-col justify-between bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {/* Card Image Section */}
            <div>
              <div className="relative">
                {product.product_images.length > 0 && (
                  <Link href={`/details`}>
                    <img
                      src={product.product_images[0]}
                      alt={product.title}
                      className="w-full h-[500px] object-cover rounded-t-lg"
                    />
                  </Link>
                )}

                {/* Heart Icon at the top-right */}
                <div className="absolute top-2 right-2 border p-2 rounded-full bg-white shadow-md">
                  <FaHeart className="h-6 w-6 text-black-500" />
                </div>

                {/* Sales Button at the bottom-left */}
                <div className="absolute bottom-2 left-2">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow-md">
                    Sales
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                {/* Title Section */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {product.title.length > 30
                      ? `${product.title.substring(0, 15)}...`
                      : product.title}
                  </h2>
                </div>

                {/* Price and Cart Section */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-semibold text-gray-700">
                    ${product.price.cents / 100}
                  </p>
                  <span className="border-2 rounded-full p-2 hover:bg-purple-500 hover:text-white transition-colors">
                    <AiOutlineShoppingCart className="h-6 w-6 text-purple-500" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysDeals;
