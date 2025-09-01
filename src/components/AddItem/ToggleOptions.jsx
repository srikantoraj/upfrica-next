// ToggleOptions.jsx
import React, { useState } from "react";

export const ToggleOptions = () => {
  const [mobileUpload, setMobileUpload] = useState(false);
  const [webUpload, setWebUpload] = useState(false);
  const [galleryPlus, setGalleryPlus] = useState(false);

  const toggleClasses = (active) =>
    `relative inline-flex items-center h-6 rounded-full w-11 transition ${
      active ? "bg-blue-600" : "bg-gray-300"
    }`;

  return (
    <div className="space-y-4">
      <ToggleSwitch
        label="Upload photos from mobile"
        description="Add photos from a mobile device."
        isOn={mobileUpload}
        onToggle={() => setMobileUpload(!mobileUpload)}
      />
      <ToggleSwitch
        label="Upload photos from web"
        description={
          <>
            Add photos you have permission to use from the web.{" "}
            <a
              href="https://www.ebay.co.uk/help/policies/listing-policies/images-text-policy?id=4240"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Learn more
            </a>
          </>
        }
        isOn={webUpload}
        onToggle={() => setWebUpload(!webUpload)}
      />
      <ToggleSwitch
        label="Gallery Plus"
        description="Display a large photo in search results (non-refundable fee applies)."
        isOn={galleryPlus}
        onToggle={() => setGalleryPlus(!galleryPlus)}
      />
    </div>
  );
};

const ToggleSwitch = ({ label, description, isOn, onToggle }) => (
  <div className="flex justify-between items-start">
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
    <button
      onClick={onToggle}
      className="ml-4"
      role="switch"
      aria-checked={isOn}
    >
      <span className={isOn ? "sr-only" : ""}>Toggle</span>
      <div
        className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${isOn ? "bg-blue-600" : ""}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isOn ? "translate-x-5" : "translate-x-0"}`}
        ></div>
      </div>
    </button>
  </div>
);
