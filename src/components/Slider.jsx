'use client';

import React, { useState } from 'react';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageSliderWithMagnify = ({ product_images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // কতগুলো ছোট ইমেজ দেখানো হবে
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '10px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {product_images && product_images.length > 0 && (
        <div>
          {/* ReactImageMagnify দিয়ে বড় ইমেজ দেখানো */}
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: `Product ${currentImageIndex + 1}`,
                isFluidWidth: true,
                src: product_images[currentImageIndex],
              },
              largeImage: {
                src: product_images[currentImageIndex],
                width: 3000,
                height: 2000,
              },
              enlargedImageContainerStyle: {
                zIndex: 4000,
              },
              lensStyle: {
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
            }}
          />

          {/* শুধু তখনই স্লাইডার দেখানো হবে যখন একাধিক ইমেজ থাকবে */}
          {product_images.length > 1 && (
            <div style={{ marginTop: '20px', width: '80%', maxWidth: '600px' }}>
              <Slider {...sliderSettings}>
                {product_images.map((image, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                      }}
                      onClick={() => setCurrentImageIndex(index)} // ক্লিক করলে উপরে ইমেজ পরিবর্তন হবে
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSliderWithMagnify;
