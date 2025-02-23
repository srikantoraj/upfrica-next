import React from 'react';
// Import arrow, full star, half star, and empty star icons from react-icons
import { FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingSection = ({ rating = 4.5 }) => {
  // Create an array of 5 stars based on the rating value
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<FaStar key={i} className="text-yellow-300" />);
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-300" />);
    } else {
      // Empty star
      stars.push(<FaRegStar key={i} className="text-yellow-300" />);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Right arrow icon */}
      <FaArrowRight className="text-gray-500" />
      
      {/* Rating value */}
      <span className="text-lg font-semibold text-gray-800">{rating}</span>
      
      {/* Five star icons */}
      <div className="flex space-x-1">
        {stars}
      </div>
      
      {/* Reviews text */}
      <span className="text-base lg:text-lg text-blue-600 underline">245 Reviews</span>
    </div>
  );
};

export default RatingSection;
