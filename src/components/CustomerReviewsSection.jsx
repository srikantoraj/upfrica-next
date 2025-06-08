import React, { useEffect, useState } from "react";

const SkeletonReview = () => (
  <div className="my-4 pb-4 border-b last:border-b-0 animate-pulse">
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
      </div>
      <div className="flex-grow relative space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-3 bg-gray-300 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

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

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          "https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setReviews(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="col-sm-6 col-lg-12 mb-0 px-3 overflow-y-auto max-h-[520px]">
      <div className="card bg-transparent">
        <div className="card-body p-0">
          {loading && (
            <>
              {[1, 2].map((i) => (
                <SkeletonReview key={i} />
              ))}
            </>
          )}

          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          {!loading && !error && reviews.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="md:w-1/3 text-center">
                  <h3 className="text-2xl font-bold mb-1" suppressHydrationWarning>
  {averageRating}
</h3>
                  <p className="text-sm text-gray-600">
                    Based on {reviews.length} Customer Review{reviews.length > 1 ? "s" : ""}
                  </p>
<div className="mt-1 text-yellow-400 text-lg" suppressHydrationWarning>
  {"★".repeat(Math.round(averageRating))}
</div>
                </div>
                <div className="md:w-2/3 flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2/3 bg-yellow-100 h-2 rounded">
                      <div className="bg-yellow-400 h-2 rounded" style={{ width: "95%" }}></div>
                    </div>
                    <span className="text-sm text-gray-700">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2/3 bg-yellow-100 h-2 rounded">
                      <div className="bg-yellow-400 h-2 rounded" style={{ width: "75%" }}></div>
                    </div>
                    <span className="text-sm text-gray-700">75%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <p className="text-center text-gray-500 py-4">No reviews found.</p>
          )}

          {!loading &&
            !error &&
            Array.isArray(reviews) &&
            reviews.map((review) => (
              <div key={review.id} className="my-4 pb-4 border-b last:border-b-0">
                <div className="flex gap-3">
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