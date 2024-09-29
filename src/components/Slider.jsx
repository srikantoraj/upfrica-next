'use client'

import React, { useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";

const Slider = ({ product_images }) => {
    

 const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product_images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product_images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
      <div>
           <div className="relative max-w-4xl mx-auto">
          {product_images && product_images.length > 0 && (
            <div className="overflow-hidden">
              <img
                src={product_images[currentImageIndex]}
                alt={`Product ${currentImageIndex + 1}`}
                className="w-full h-full object-cover  rounded-lg"
              />
            </div>
          )}

          {/* Prev/Next Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button
              className="bg-teal-100 text-teal-500 hover:text-orange-500 font-bold hover:shadow-lg rounded-full p-2"
              onClick={handlePrev}
            >
              <FaArrowLeft className="text-2xl" /> {/* Left arrow icon */}
            </button>
            <button
              className="bg-teal-100 text-teal-500 hover:text-orange-500 font-bold hover:shadow-lg rounded-full p-2"
              onClick={handleNext}
            >
              <FaArrowRight className="text-2xl" /> {/* Right arrow icon */}
            </button>
          </div>

          {/* Dots for Navigation */}
          <div className="absolute w-full flex items-center justify-center px-4">
            {product_images.map((_, index) => (
              <button
                key={index}
                className={`flex-1 w-4 h-2 mt-4 mx-2 mb-0 rounded-full overflow-hidden transition-colors duration-200 ease-out hover:bg-teal-600 hover:shadow-lg ${
                  currentImageIndex === index ? "bg-orange-600" : "bg-teal-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              ></button>
            ))}
          </div>
        </div>
    </div>
  )
}

export default Slider