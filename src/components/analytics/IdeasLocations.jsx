// src/components/cards/IdeasLocations.js
import React from "react";

const IdeasLocations = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-white rounded-lg shadow-md p-5 flex-1">
        <h3 className="text-lg font-semibold text-gray-700">Total Ideas</h3>
        <p className="text-2xl font-bold text-gray-900">235</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-5 flex-1">
        <h3 className="text-lg font-semibold text-gray-700">Total Locations</h3>
        <p className="text-2xl font-bold text-gray-900">25</p>
      </div>
    </div>
  );
};

export default IdeasLocations;
