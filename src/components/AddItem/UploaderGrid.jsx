// 'use client'
// import React, { useState } from "react";

// const MAX_ITEMS = 15;

// export const UploaderGrid = () => {
//   const [images, setImages] = useState([
//     "https://i.ebayimg.com/images/g/2-cAAOSwLdtkL7Uk/s-l640.jpg" // Pre-loaded stock image
//   ]);

//   const handleUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => URL.createObjectURL(file));
//     const total = [...images, ...newImages].slice(0, MAX_ITEMS - 1); // First is upload box
//     setImages(total);
//   };

//   const totalCount = images.length + 1;

//   return (
//     <div className="">
//       <p className="text-sm text-gray-500 mb-2">{totalCount}/{MAX_ITEMS}</p>

//       <div className="grid grid-cols-3  xl:grid-cols-5 gap-4 h-full">

//         {/* Upload Area */}
//         <div className="col-span-1 xl:col-span-2 h-full">
//           <label className=" border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-6  cursor-pointer h-full">
//             <div className="flex flex-col items-center">
//               <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4m0 0l-4 4m4-4v12" />
//               </svg>
//               <p className="font-medium text-sm">Drag and drop files</p>
//               <span className="mt-2 px-4 py-1 border rounded-full text-sm text-gray-700">Upload from computer</span>
//             </div>
//             <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
//           </label>
//         </div>

//         <div className="col-span-2 xl:col-span-3">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 ">
//             {/* Uploaded Images */}
//             {images.map((src, idx) => (
//               <div key={idx} className="relative rounded-lg overflow-hidden bg-white min-h-[100px] shadow-sm ">
//                 <img src={src} alt={`upload-${idx}`} className="object-cover w-full h-full rounded-lg" />
//                 <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded-full">
//                   Stock
//                 </span>
//               </div>
//             ))}

//             {/* Placeholder Boxes */}
//             {Array.from({ length: MAX_ITEMS - 1 - images.length }).map((_, i) => (
//               <div key={i} className="bg-gray-100 rounded-lg min-h-[100px]"></div>
//             ))}
//           </div>
//         </div>

//       </div>


//     </div>
//   );
// };

'use client'
import React, { useState } from "react";

const MAX_ITEMS = 15;

export const UploaderGrid = () => {
  const [images, setImages] = useState([
    { src: "https://i.ebayimg.com/images/g/2-cAAOSwLdtkL7Uk/s-l640.jpg", isStock: true }
  ]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      src: URL.createObjectURL(file),
      isStock: false
    }));
    const total = [...images, ...newImages].slice(0, MAX_ITEMS - 1); // max minus upload box
    setImages(total);
  };

  const totalCount = images.length + 1;

  return (
    <div className="">
      <p className="text-sm text-gray-500 mb-2">{totalCount}/{MAX_ITEMS}</p>

      <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-4 h-full">

        {/* Upload Area */}
        <div className="col-span-1 xl:col-span-2 h-full">
          <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-6 cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <p className="font-medium text-sm">Drag and drop files</p>
              <span className="mt-2 px-4 py-1 border rounded-full text-sm text-gray-700">Upload from computer</span>
            </div>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        {/* Uploaded Images */}
        <div className="col-span-2 xl:col-span-3">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden bg-white min-h-[100px] shadow-sm">
                <img src={img.src} alt={`upload-${idx}`} className="object-cover w-full h-full rounded-lg" />
                {img.isStock && (
                  <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    Stock
                  </span>
                )}
              </div>
            ))}

            {/* Placeholder Boxes */}
            {Array.from({ length: MAX_ITEMS - 1 - images.length }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg min-h-[100px]"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};









