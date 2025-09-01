// ThumbnailGrid.jsx
import React from "react";

export const ThumbnailGrid = ({ images }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative w-full h-28 border rounded overflow-hidden"
        >
          <img
            src={src}
            alt={`upload-${index}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
            #{index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};
