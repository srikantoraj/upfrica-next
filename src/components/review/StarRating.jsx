//components/review/StarRating.jsx
'use client'

import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export default function StarRating({
  rating,
  setRating,
  size = 40,
  className = '',
}) {
  const [hover, setHover] = useState(null)

  return (
    <div className={`flex space-x-2 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <FaStar
            size={size}
            className={
              (hover || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}