//components/review/ProductRatingLine.jsx
'use client'

import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function ProductRatingLine({ averageRating = 0, reviewCount = 0 }) {
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />)
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />)
      }
    }
    return <span className="flex gap-1">{stars}</span>
  }

  if (reviewCount === 0) {
    return (
      <a href="#reviews" className="text-sm text-gray-500 hover:underline mt-1 block">
        Be the first to review this product
      </a>
    )
  }

return (
  <div className="flex items-center gap-2 mt-1 text-base sm:text-lg">
    <span className="flex gap-1 text-yellow-500 text-lg sm:text-xl">
      {renderStars(averageRating)}
    </span>
    <span className="text-gray-800 font-semibold">{averageRating.toFixed(1)}</span>
    <a href="#reviews" className="text-gray-600 underline hover:text-purple-600">
      ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
    </a>
  </div>
)
}