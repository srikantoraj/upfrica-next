// src/components/cards/SocialCard.js
import React from "react";

const SocialCard = ({
  platform,
  Icon,
  likes,
  growth,
  target,
  duration,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`text-2xl ${color}`} />
          <h3 className="text-sm font-semibold text-gray-700">
            {platform} Likes
          </h3>
        </div>
        <p className="text-xl font-bold text-gray-900">{likes}</p>
        <p className="text-sm text-green-500 font-medium">{growth}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Target</p>
        <p className="text-md font-bold text-gray-700">{target}</p>
        <p className="text-sm text-gray-500 mt-2">Duration</p>
        <p className="text-md font-bold text-gray-700">{duration}</p>
      </div>
    </div>
  );
};

export default SocialCard;
