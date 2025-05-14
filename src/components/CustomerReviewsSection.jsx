// import React, { useEffect, useState } from "react";

// const SkeletonReview = () => (
//   <div className="my-4 pb-4 border-b last:border-b-0 animate-pulse">
//     <div className="flex flex-col md:flex-row gap-3">
//       {/* Avatar Skeleton */}
//       <div className="flex-shrink-0">
//         <div className="w-16 h-16 rounded-full bg-gray-300" />
//       </div>
//       {/* Content Skeleton */}
//       <div className="flex-grow relative space-y-2">
//         {/* Username and Date Skeleton */}
//         <div className="h-4 bg-gray-300 rounded w-24"></div>
//         <div className="h-3 bg-gray-300 rounded w-16"></div>
//         {/* Title Skeleton */}
//         <div className="h-4 bg-gray-300 rounded w-1/3"></div>
//         {/* Comment Skeleton */}
//         <div className="h-4 bg-gray-300 rounded w-full"></div>
//         <div className="h-4 bg-gray-300 rounded w-5/6"></div>
//         {/* Status Skeleton */}
//         <div className="h-3 bg-gray-300 rounded w-1/4"></div>
//       </div>
//     </div>
//   </div>
// );

// export default function CustomerReviewsSection({slug}) {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch reviews using fetch()
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(
//           `https://media.upfrica.com/api/products/${slug}/reviews/`
//         );
//         if (!res.ok) {
//           throw new Error("Failed to fetch");
//         }
//         const data = await res.json();
//         setReviews(data);
//       } catch (err) {
//         setError("Failed to load reviews.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   const StarRating = ({ rating }) => {
//     const totalStars = 5;
//     return (
//       <div className="inline-block">
//         {[...Array(totalStars)].map((_, i) => (
//           <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
//             ★
//           </span>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="col-sm-6 col-lg-12 mb-0 px-3 overflow-y-auto max-h-[520px]">
//       <div className="card bg-transparent">
//         <div className="card-body p-0">
//           {loading && (
//             <>
//               {[1, 2].map((i) => (
//                 <SkeletonReview key={i} />
//               ))}
//             </>
//           )}
//           {error && <p className="text-center text-red-500 py-4">{error}</p>}
//           {!loading && !error && reviews.length === 0 && (
//             <p className="text-center text-gray-500 py-4">No reviews found.</p>
//           )}

//           {!loading &&
//             !error &&
//             reviews.map((review) => (
//               <div key={review.id} className="my-4 pb-4 border-b last:border-b-0">
//                 <div className="flex  gap-3">
//                   <div className="flex-shrink-0">
//                     <img
//                       className="w-16 h-16 rounded-full object-cover"
//                       alt="Avatar"
//                       src="https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="flex-grow relative">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h6 className="font-medium text-sm md:text-base mb-1">
//                           {review.reviewer?.username || "Anonymous"}
//                         </h6>
//                         <ul className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-2">
//                           <li>
//                             {new Date(review.created_at).toLocaleString("en-GB", {
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             })}
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 mb-1">
//                       <StarRating rating={review.rating} />
//                       {review.title && (
//                         <b className="text-gray-800 text-sm md:text-base">{review.title}</b>
//                       )}
//                     </div>

//                     <p className="text-sm md:text-base text-gray-800">{review.comment}</p>

//                     <span
//                       className={`text-xs md:text-sm mt-2 inline-block ${review.status === 1 ? "text-green-600" : "text-red-600"
//                         }`}
//                     >
//                       {review.status === 1 ? "published" : "unpublished"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
} from "../app/store/slices/reviewsSlice";


const SkeletonReview = () => (
  <div className="my-4 pb-4 border-b last:border-b-0 animate-pulse">
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
      </div>
      <div className="flex-grow relative space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-3 bg-gray-300 rounded w-16" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-3 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const StarRating = ({ rating }) => (
  <div className="inline-block">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ))}
  </div>
);

export default function CustomerReviewsSection({ slug }) {
  const dispatch = useDispatch();
  const {
    reviews,
    summary: { average_rating, review_count, rating_percent },
    loading,
    error,
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (!slug) return;
    dispatch(fetchReviewsStart());
    fetch(`https://media.upfrica.com/api/products/${slug}/reviews/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => dispatch(fetchReviewsSuccess(data)))
      .catch((err) => dispatch(fetchReviewsFailure(err.message)));
  }, [dispatch, slug]);

  if (loading) {
    return (
      <>
        {[1, 2].map((i) => (
          <SkeletonReview key={i} />
        ))}
      </>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  if (review_count === 0) {
    return <p className="text-center text-gray-500 py-4">No reviews found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Block */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">
          Verified Customer Reviews
        </h2>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold mr-2">
            {average_rating.toFixed(1)}
          </span>
          <span className="text-gray-600">
            Based on {review_count} review{review_count > 1 ? "s" : ""}
          </span>
        </div>
        {/* 5→1★ Breakdown */}
        <div className="space-y-2">
          {rating_percent.map((pct, idx) => {
            const star = 5 - idx; // idx 0 → 5★, 1 → 4★, …, 4 → 1★
            return (
              <div
                key={star}
                className="flex items-center text-sm md:text-base"
              >
                <span className="w-8">{star} ★</span>
                <div className="flex-1 mx-2 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-600">
                  {Math.round(pct)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="col-sm-6 col-lg-12 mb-0 px-3 overflow-y-auto max-h-[520px]">
        <div className="card bg-transparent">
          <div className="card-body p-0">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="my-4 pb-4 border-b last:border-b-0"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      alt="Avatar"
                      src="https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow">
                    <h6 className="font-medium text-sm md:text-base mb-1">
                      {review.reviewer?.username || "Anonymous"}
                    </h6>
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-2">
                      {new Date(review.created_at).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} />
                      {review.title && (
                        <b className="text-gray-800 text-sm md:text-base">
                          {review.title}
                        </b>
                      )}
                    </div>
                    <p className="text-sm md:text-base text-gray-800">
                      {review.comment}
                    </p>
                    <span
                      className={`text-xs md:text-sm mt-2 inline-block ${review.status === 1
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {review.status === 1 ? "published" : "unpublished"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
