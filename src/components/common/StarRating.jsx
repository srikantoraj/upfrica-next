import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }) {
  const maxStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < filledStars ? "#facc15" : "none"}
          stroke="#facc15"
        />
      ))}
    </div>
  );
}