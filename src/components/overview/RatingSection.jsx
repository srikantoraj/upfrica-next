// src/components/RatingSection.js
import React from "react";
import { FaStar } from "react-icons/fa";

const ratings = {
  average: 4.7,
  counts: {
    5: 384,
    4: 145,
    3: 24,
    2: 1,
    1: 0,
  },
};

const RatingSection = () => {
  const total = Object.values(ratings.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Users</h3>
        <div className="flex items-center text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(ratings.average) ? "" : "text-gray-300"}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-4xl font-bold text-yellow-500">
          {ratings.average}
        </span>
        <span className="text-gray-400 text-lg">/5</span>
      </div>

      <div className="space-y-3">
        {Object.entries(ratings.counts).map(([star, count]) => (
          <div key={star} className="flex items-center gap-3">
            <span className="w-6 text-sm font-semibold">{star}★</span>
            <div className="flex-1 bg-gray-200 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${(count / total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 w-10 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSection;
