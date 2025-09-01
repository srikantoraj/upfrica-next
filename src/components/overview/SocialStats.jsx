// src/components/cards/SocialStats.js
import React from "react";

const platforms = [
  { name: "Facebook", color: "text-blue-600" },
  { name: "Google", color: "text-red-500" },
  { name: "Twitter", color: "text-sky-500" },
];

const SocialStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {platforms.map((p) => (
        <div key={p.name} className="bg-white rounded-lg shadow-md p-5">
          <h3 className={`text-lg font-semibold ${p.color}`}>{p.name} Likes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">12,281</p>
          <p className="text-green-600 text-sm font-medium mt-1">+2.3%</p>
          <p className="text-xs text-gray-400 mt-1">
            Target: 35,098 | Duration: 3,539
          </p>
        </div>
      ))}
    </div>
  );
};

export default SocialStats;
