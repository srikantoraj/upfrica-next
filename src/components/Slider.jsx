// 'use client';
// import React, { useState } from "react";
// import "react-image-lightbox/style.css";
// import Lightbox from "react-image-lightbox";
// // import Slider from 'react-slick';
// // import ReactImageMagnify from 'react-image-magnify';
// // import 'slick-carousel/slick/slick.css';
// // import 'slick-carousel/slick/slick-theme.css';

// const ImageSliderWithMagnify = ({ product_images }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);
//   // const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // const sliderSettings = {
//   //   dots: true,
//   //   infinite: true,
//   //   speed: 500,
//   //   slidesToShow: 3, // কতগুলো ছোট ইমেজ দেখানো হবে
//   //   slidesToScroll: 1,
//   //   centerMode: true,
//   //   centerPadding: '10px',
//   // };

//   return (
//     <div className="flex flex-col items-center mt-5  w-full">
//       {/* Main Image */}
//       {product_images && product_images.length > 0 && (
//         <div className="mb-4">
//           <img
//             className="lg:h-[700px] w-full object-cover cursor-pointer rounded-md"
//             src={product_images[photoIndex]}
//             alt={`Product ${photoIndex}`}
//             onClick={() => setIsOpen(true)}
//           />
//         </div>
//       )}

//       {/* Thumbnail Images */}
//       {product_images && product_images.length > 1 && (
//         <div className="grid grid-cols-4 gap-2">
//           {product_images.map((img, index) => (
//             <img
//               key={index}
//               className={`h-[75px] w-[75px] object-cover rounded-md cursor-pointer border-2 ${photoIndex === index ? "border-purple-500" : "border-gray-300"
//                 }`}
//               src={img}
//               alt={`Thumbnail ${index}`}
//               onClick={() => setPhotoIndex(index)}
//             />
//           ))}
//         </div>
//       )}

//       {/* Lightbox */}
//       {isOpen && (
//         <Lightbox
//           mainSrc={product_images[photoIndex]}
//           nextSrc={product_images[(photoIndex + 1) % product_images.length]}
//           prevSrc={
//             product_images[
//             (photoIndex + product_images.length - 1) % product_images.length
//             ]
//           }
//           onCloseRequest={() => setIsOpen(false)}
//           onMovePrevRequest={() =>
//             setPhotoIndex(
//               (photoIndex + product_images.length - 1) % product_images.length
//             )
//           }
//           onMoveNextRequest={() =>
//             setPhotoIndex((photoIndex + 1) % product_images.length)
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default ImageSliderWithMagnify;
// // 'use client'
// // import React, { useState } from 'react';

// // const ProductGallery = ({ images = [] }) => {
// //   // প্রথম ইমেজটি ডিফল্টভাবে অ্যাকটিভ হবে
// //   const [activeImage, setActiveImage] = useState(images[0]);
// //   // হোভার করার সময় জুম বক্সে ইফেক্ট দেখানোর জন্য state
// //   const [isHovered, setIsHovered] = useState(false);
// //   // মেইন ইমেজের উপর মাউসের অবস্থান (শতাংশে) স্টোর করার জন্য state
// //   const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

// //   // মেইন ইমেজের রেক্টেংগুলার (bounding box) অনুযায়ী মাউসের অবস্থান (শতাংশে) নির্ণয়
// //   const handleMouseMove = (e) => {
// //     const rect = e.currentTarget.getBoundingClientRect();
// //     const x = ((e.clientX - rect.left) / rect.width) * 100;
// //     const y = ((e.clientY - rect.top) / rect.height) * 100;
// //     setZoomPos({ x, y });
// //   };

// //   return (
// //     <div className="flex flex-col items-center">
// //       {/* মেইন ইমেজ এবং জুম বক্স একই রোতে থাকবে */}
// //       <div className="flex flex-row items-center gap-4">
// //         {/* মেইন ইমেজ কন্টেইনার – এখানে উচ্চতা ও প্রস্থ ফিক্সড (w-80 h-80) */}
// //         <div
// //           className="relative w-80 h-80 overflow-hidden border rounded shadow-sm"
// //           onMouseEnter={() => setIsHovered(true)}
// //           onMouseLeave={() => setIsHovered(false)}
// //           onMouseMove={handleMouseMove}
// //         >
// //           <img
// //             src={activeImage}
// //             alt="Product"
// //             className="w-full h-full object-contain"
// //           />
// //         </div>

// //         {/* জুম বক্স: একই সাইজের ফিক্সড কন্টেইনার, যা ডান পাশে দেখানো হবে */}
// //         <div className="w-80 h-80 border rounded shadow-sm">
// //           {isHovered && (
// //             <div
// //               className="w-full h-full"
// //               style={{
// //                 backgroundImage: `url(${activeImage})`,
// //                 backgroundSize: '200%', // 200% মানে ইমেজের 2 গুণ জুম
// //                 backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
// //                 transition: 'background-position 0.15s ease',
// //               }}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {/* থাম্বনেইলস */}
// //       <div className="flex space-x-2 mt-4">
// //         {images.map((img, idx) => (
// //           <button
// //             key={idx}
// //             onClick={() => setActiveImage(img)}
// //             className={`border rounded focus:outline-none ${
// //               activeImage === img ? 'border-blue-500' : 'border-transparent'
// //             }`}
// //           >
// //             <img
// //               src={img}
// //               alt={`Thumbnail ${idx}`}
// //               className="w-16 h-16 object-cover"
// //             />
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductGallery;

"use client"
import React, { useState } from 'react';

const ProductGallery = ({ images = [] }) => {
  // The first image is active by default.
  const [activeImage, setActiveImage] = useState(images[0]);
  // State for handling zoom (hover effect)
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // When the mouse moves over the main image, calculate the percentage position
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Image Container */}
      <div
        className="relative w-full lg:max-w-xl  overflow-hidden border rounded shadow-sm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main image */}
        <img
          src={activeImage}
          alt="Product"
          className="w-full object-contain"
        />
        {/* Zoom overlay (only visible on hover) */}
        {isZoomed && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: '200%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              opacity: 0.8,
              transition: 'opacity 0.15s ease',
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 mt-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`border rounded focus:outline-none ${activeImage === img ? 'border-blue-500' : 'border-transparent'
              }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx}`}
              className="w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
