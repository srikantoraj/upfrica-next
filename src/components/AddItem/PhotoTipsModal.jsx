// PhotoTipsModal.jsx
import React from "react";

export const PhotoTipsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-lg w-full max-w-lg p-6 space-y-4 relative">
        <h2 className="text-xl font-bold">📸 Photo Tips</h2>
        <p className="text-gray-600">Make sure your photos are:</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Clear, well-lit and in focus</li>
          <li>Show multiple angles of the item</li>
          <li>Use neutral backgrounds</li>
          <li>Include close-ups of any flaws</li>
        </ul>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg">
          &times;
        </button>
        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
