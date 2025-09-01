// PhotoUploader.jsx
"use client";
import React, { useState } from "react";
import { ToggleOptions } from "./ToggleOptions";
import { ThumbnailGrid } from "./ThumbnailGrid";
import { PhotoTipsModal } from "./PhotoTipsModal";

export const PhotoUploader = () => {
  const [images, setImages] = useState([]);
  const [showTips, setShowTips] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    if (images.length + urls.length <= 24) {
      setImages([...images, ...urls]);
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-sm bg-white space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Photos & Video</h2>
        <button
          onClick={() => setShowTips(true)}
          className="text-blue-600 hover:underline"
        >
          Tips for taking pro photos
        </button>
      </div>

      {/* Toggle Options */}
      <ToggleOptions />

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 p-6 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="upload-input"
        />
        <label htmlFor="upload-input" className="cursor-pointer text-gray-600">
          <div className="text-lg font-medium mb-2">
            Drag and drop files or click to upload
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 inline-block rounded">
            Upload from Computer
          </div>
        </label>
      </div>

      {/* Image Count */}
      <div className="text-sm text-gray-600">{images.length}/24 Uploaded</div>

      {/* Thumbnails */}
      <ThumbnailGrid images={images} />

      {/* Tips Modal */}
      {showTips && <PhotoTipsModal onClose={() => setShowTips(false)} />}
    </div>
  );
};
