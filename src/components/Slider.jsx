'use client';
import React, { useState } from "react";

// import Slider from 'react-slick';
// import ReactImageMagnify from 'react-image-magnify';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

const ImageSliderWithMagnify = ({ product_images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const sliderSettings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3, // কতগুলো ছোট ইমেজ দেখানো হবে
  //   slidesToScroll: 1,
  //   centerMode: true,
  //   centerPadding: '10px',
  // };

  return (
    <div className="flex flex-col items-center mt-5  w-full">
      {/* Main Image */}
      {product_images && product_images.length > 0 && (
        <div className="mb-4">
          <img
            className="lg:h-[700px] w-full object-cover cursor-pointer rounded-md"
            src={product_images[photoIndex]}
            alt={`Product ${photoIndex}`}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* Thumbnail Images */}
      {product_images && product_images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {product_images.map((img, index) => (
            <img
              key={index}
              className={`h-[75px] w-[75px] object-cover rounded-md cursor-pointer border-2 ${photoIndex === index ? "border-purple-500" : "border-gray-300"
                }`}
              src={img}
              alt={`Thumbnail ${index}`}
              onClick={() => setPhotoIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          mainSrc={product_images[photoIndex]}
          nextSrc={product_images[(photoIndex + 1) % product_images.length]}
          prevSrc={
            product_images[
            (photoIndex + product_images.length - 1) % product_images.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + product_images.length - 1) % product_images.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % product_images.length)
          }
        />
      )}
    </div>
  );
};

export default ImageSliderWithMagnify;


{/* ReactImageMagnify দিয়ে বড় ইমেজ দেখানো */ }
{/* <ReactImageMagnify
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
          /> */}

{/* শুধু তখনই স্লাইডার দেখানো হবে যখন একাধিক ইমেজ থাকবে */ }
{/* <div className='flex justify-center '>
          {product_images.length > 1 && (
            <div style={{ marginTop: '30px', width: '50%', maxWidth: '300px' }}>
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
          </div> */}
