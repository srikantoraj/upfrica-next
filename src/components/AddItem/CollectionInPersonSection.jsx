import React from 'react';

const CollectionInPersonSection = () => {
    return (
        <div className="space-y-4  rounded-md p-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Collection in person</h3>
        <p className="text-sm text-gray-600">
          Reach local buyers and post fewer packages.
        </p>
      </div>

      {/* City input field */}
      <div>
        <label htmlFor="itemLocationCityState" className="block text-sm font-medium text-gray-700">
          City, area
        </label>
        <input
          type="text"
          name="itemLocationCityState"
          id="itemLocationCityState"
          className="mt-1 block w-full md:w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Postcode will not be visible on the listing.
        </p>
      </div>
    </div>
    );
};

export default CollectionInPersonSection;