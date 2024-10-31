'use client';

import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ReactImageMagnify from 'react-image-magnify';

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
    <div className="relative max-w-4xl mx-auto p-4">
      {product_images && product_images.length > 0 && (
        <div className="image-container">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: `Product ${currentImageIndex + 1}`,
                isFluidWidth: true,
                src: product_images[currentImageIndex],
              },
              largeImage: {
                src: product_images[currentImageIndex],
                width: 1200,
                height: 1800,
              },
              enlargedImagePosition: "over", // Sets the magnified image to hover over the main image
              enlargedImageContainerStyle: { zIndex: 1000 }, // optional styling for magnified image container
            }}
          />
        </div>
      )}

      {/* Prev/Next Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          className="bg-teal-100 text-teal-500 hover:text-orange-500 font-bold hover:shadow-lg rounded-full p-2"
          onClick={handlePrev}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <button
          className="bg-teal-100 text-teal-500 hover:text-orange-500 font-bold hover:shadow-lg rounded-full p-2"
          onClick={handleNext}
        >
          <FaArrowRight className="text-2xl" />
        </button>
      </div>

      {/* Dots for Navigation */}
      <div className="absolute bottom-2 w-full flex items-center justify-center px-4">
        {product_images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full mx-1 transition-colors duration-200 ease-out hover:bg-teal-600 ${
              currentImageIndex === index ? "bg-orange-600" : "bg-teal-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
