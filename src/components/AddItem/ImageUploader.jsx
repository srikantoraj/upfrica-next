"use client";
import React, { useState } from "react";

const MAX_IMAGES = 25;

const ImageUploader = () => {
  const [images, setImages] = useState([
    "https://i.ebayimg.com/images/g/Ng0AAOSwHJdlcvwO/s-l1200.jpg", // Stock Image
  ]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls].slice(0, MAX_IMAGES));
  };

  return (
    <div className="p-4">
      {/* Image count */}
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          {images.length}/{MAX_IMAGES}
        </p>
      </div>

      {/* Upload and thumbnails */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer h-32">
          <svg
            className="w-6 h-6 text-gray-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4m0 0l-4 4m4-4v12"
            />
          </svg>
          <p className="text-sm">Drag and drop files</p>
          <span className="text-xs mt-1 px-2 py-0.5 border rounded-full">
            Upload from computer
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {/* Images */}
        {images.map((img, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm h-32"
          >
            <img
              src={img}
              alt={`img-${index}`}
              className="w-full h-full object-cover"
            />
            {index === 0 && (
              <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                Stock
              </span>
            )}
          </div>
        ))}

        {/* Empty Boxes (placeholders) */}
        {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32"></div>
        ))}
      </div>
    </div>
  );
};
export default ImageUploader;
