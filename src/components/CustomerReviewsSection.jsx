// import React, { useState } from "react";

// /**
//  * A React + Tailwind version of your "Customer Reviews" scrolling section,
//  * without jQuery or external scripts.
//  */
// export default function CustomerReviewsSection() {
//   // Example data array to hold multiple reviews.
//   // You can fetch this from an API or store it in props, etc.
//   const [reviews] = useState([
//     {
//       id: 26,
//       userId: 1788,
//       userName: "Esther",
//       userAvatar:
//         "https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg",
//       date: "22:16 Sep 11, 2023",
//       location: "Ghana",
//       rating: 5,
//       title: "Thank You!",
//       body: "Good product and timely product delivery. good communication.",
//       published: true,
//     },
//     {
//       id: 25,
//       userId: 2021,
//       userName: "Noble",
//       userAvatar:
//         "https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg",
//       date: "22:09 Sep 11, 2023",
//       location: "Ghana",
//       rating: 5,
//       title: "Quick Delivery",
//       body: "Good quality I will definitely buy from this seller again.",
//       published: true,
//     },
//     {
//       id: 9,
//       userId: 1220,
//       userName: "Uk Direct",
//       userAvatar:
//         "https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg",
//       date: "17:45 Oct 27, 2022",
//       location: "Ghana",
//       rating: 5,
//       title:
//         "Aside A Quality Product, I Received A Warm Customer Care From The Seller.",
//       body: `I had recently broken two cheap blenders using them and was looking for a robust replacement. I went back and forth not knowing which blender to buy and finally saw this on Upfrica and am so happy I did!! I bought two; one for my sister. It definitely feels like it is durable and it works extremely well...`,
//       published: true,
//       // If you need a "Read more" approach, you can store the "expanded" text or handle it with state
//     },
//   ]);

//   const handleEditReview = (reviewId) => {
//     alert(`Edit review #${reviewId} (placeholder)`);
//   };

//   const handleDeleteReview = (reviewId) => {
//     // Confirm or do whatever is needed
//     const confirmed = window.confirm(
//       `Are you sure you want to delete review #${reviewId}?`
//     );
//     if (confirmed) {
//       alert(`Delete review #${reviewId} (placeholder)`);
//     }
//   };

//   const handleTogglePublish = (reviewId) => {
//     alert(`Toggle published for review #${reviewId} (placeholder)`);
//   };

//   // Simple star display for rating
//   const StarRating = ({ rating }) => {
//     // We'll just display a number of ★ based on "rating" (1-5).
//     // Or you could use a star rating library in React if you want.
//     const totalStars = 5;
//     const stars = [...Array(totalStars)].map((_, index) => {
//       const starIndex = index + 1;
//       return (
//         <span key={index}>
//           {starIndex <= rating ? (
//             <span className="text-yellow-500">★</span>
//           ) : (
//             <span className="text-gray-300">★</span>
//           )}
//         </span>
//       );
//     });

//     return <div className="inline-block">{stars}</div>;
//   };

//   return (
//     <div
//       className="col-sm-6 col-lg-12 mb-0 px-3 overflow-y-auto"
//       style={{ maxHeight: "520px" }} // tailwind "max-h-[520px]" if you prefer
//     >
//       {/* Parent container */}
//       <div className="card bg-transparent">
//         <div className="card-body p-0">
//           {reviews.map((review) => (
//             <div key={review.id} className="my-4 pb-4 border-b last:border-b-0">
//               {/* Review item START */}
//               <div className="flex flex-col md:flex-row gap-3">
//                 {/* Avatar */}
//                 <div className="flex-shrink-0">
//                   <a href={`/users/${review.userId}`}>
//                     <img
//                       className="w-16 h-16 rounded-full object-cover"
//                       alt="Avatar"
//                       src={review.userAvatar}
//                       loading="lazy"
//                     />
//                   </a>
//                 </div>
//                 {/* Text */}
//                 <div className="flex-grow relative">
//                   {/* Header row with name + date */}
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h6 className="font-medium text-sm md:text-base mb-1">
//                         <a href={`/users/${review.userId}`}>{review.userName}</a>
//                       </h6>
//                       <ul className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-2">
//                         <li>Reviewed in {review.location}</li>
//                         <li>on {review.date}</li>
//                       </ul>
//                     </div>
//                     {/* 3-dot menu */}
//                     <div className="dropdown absolute right-0 top-0">
//                       <button
//                         className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded"
//                         onClick={(e) => {
//                           e.currentTarget.nextSibling.classList.toggle("hidden");
//                         }}
//                       >
//                         <i className="fa fa-ellipsis-v"></i>
//                       </button>
//                       <ul className="hidden absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md text-sm">
//                         <li className="border-b last:border-b-0">
//                           <button
//                             className="block w-full text-left px-3 py-1 hover:bg-gray-100"
//                             onClick={() => handleEditReview(review.id)}
//                           >
//                             <i className="fa fa-pencil mr-2"></i>Edit
//                           </button>
//                         </li>
//                         <li className="border-b last:border-b-0">
//                           <button
//                             className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-50"
//                             onClick={() => handleDeleteReview(review.id)}
//                           >
//                             <i className="fa fa-trash mr-2"></i>Delete
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>

//                   {/* Star rating + title */}
//                   <div className="flex items-center gap-2 mb-1">
//                     <StarRating rating={review.rating} />
//                     {review.title && (
//                       <b className="text-gray-800 text-sm md:text-base">
//                         {review.title}
//                       </b>
//                     )}
//                   </div>

//                   {/* Body */}
//                   <p className="text-sm md:text-base text-gray-800">
//                     {review.body}
//                   </p>

//                   {/* Published link */}
//                   <a
//                     href="#"
//                     className="text-blue-600 text-xs md:text-sm mt-2 inline-block"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleTogglePublish(review.id);
//                     }}
//                   >
//                     {review.published ? "published" : "unpublished"}
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* If you had a 'Load more' button, place it here, e.g.: 
//         <div className="text-center mb-3">
//           <button className="bg-blue-600 text-white px-4 py-2 rounded">Load More</button>
//         </div> 
//         */}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews using fetch()
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          "https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const StarRating = ({ rating }) => {
    const totalStars = 5;
    return (
      <div className="inline-block">
        {[...Array(totalStars)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="col-sm-6 col-lg-12 mb-0 px-3 overflow-y-auto max-h-[520px]">
      <div className="card bg-transparent">
        <div className="card-body p-0">
          {loading && <p className="text-center text-gray-500 py-4">Loading reviews...</p>}
          {error && <p className="text-center text-red-500 py-4">{error}</p>}
          {!loading && !error && reviews.length === 0 && (
            <p className="text-center text-gray-500 py-4">No reviews found.</p>
          )}

          {!loading &&
            !error &&
            reviews.map((review) => (
              <div key={review.id} className="my-4 pb-4 border-b last:border-b-0">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-shrink-0">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      alt="Avatar"
                      src="https://d26ukeum83vx3b.cloudfront.net/assets/fallback/unknown-profile-af52c345c697846d002f6b77aa9530f87be0374f4b2b0d9ba54a2cf1d6c585e4.jpg"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h6 className="font-medium text-sm md:text-base mb-1">
                          {review.reviewer?.username || "Anonymous"}
                        </h6>
                        <ul className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-2">
                          <li>
                            {new Date(review.created_at).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} />
                      {review.title && (
                        <b className="text-gray-800 text-sm md:text-base">{review.title}</b>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-gray-800">{review.comment}</p>

                    <span
                      className={`text-xs md:text-sm mt-2 inline-block ${
                        review.status === 1 ? "text-green-600" : "text-red-600"
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
  );
}

