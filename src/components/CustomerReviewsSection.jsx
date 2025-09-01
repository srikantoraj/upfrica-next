import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
} from "../app/store/slices/reviewsSlice";

/* ---------------- UI bits ---------------- */
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

/* ------------- helpers ------------- */
function getApiBase() {
  // Prefer public env; fallback to same-origin
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  if (envBase) return envBase;
  if (typeof window !== "undefined") {
    const { origin } = window.location;
    return origin; // same origin fallback
  }
  return ""; // server render fallback — will be caught below
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // Log the first part of the HTML to the console for debugging
    const snippet = text.slice(0, 300).replace(/\s+/g, " ").trim();
    console.error("Non-JSON response from reviews endpoint:", snippet);
    throw new Error(
      res.ok
        ? "Unexpected response format."
        : `HTTP ${res.status} ${res.statusText}`
    );
  }
}

export default function CustomerReviewsSection({ slug }) {
  const dispatch = useDispatch();
  const {
    reviews = [],
    summary = {},
    loading,
    error,
  } = useSelector((state) => state.reviews);

  const {
    average_rating = 0,
    review_count = 0,
    rating_percent = [0, 0, 0, 0, 0],
  } = summary;

  useEffect(() => {
    if (!slug) {
      dispatch(fetchReviewsFailure("Missing product slug."));
      return;
    }

    const API_BASE = getApiBase();
    if (!API_BASE) {
      dispatch(
        fetchReviewsFailure(
          "API base URL is not configured (NEXT_PUBLIC_API_BASE_URL)."
        )
      );
      return;
    }

    // if slug might contain slashes, encode safely
    const encoded = encodeURIComponent(String(slug));
    // NOTE: your backend path is assumed correct here
    const url = `${API_BASE}/api/products/${encoded}/reviews/`;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    (async () => {
      try {
        dispatch(fetchReviewsStart());

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal,
          credentials: "include", // if your API uses session/cookie auth; safe even if not
        });

        // Parse safely even if server returned HTML
        const data = await safeJson(res);

        // Expecting shape: { reviews, summary } or a flat array — support both
        if (Array.isArray(data)) {
          dispatch(
            fetchReviewsSuccess({
              reviews: data,
              summary: {
                average_rating: 0,
                review_count: data.length,
                rating_percent: [0, 0, 0, 0, 0],
              },
            })
          );
        } else {
          dispatch(fetchReviewsSuccess(data));
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        dispatch(
          fetchReviewsFailure(
            e?.message ||
              "Could not load reviews. Please try again in a moment."
          )
        );
      }
    })();

    return () => ctrl.abort();
  }, [dispatch, slug]);

  /* ---------- render ---------- */
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
    return (
      <p className="text-center text-red-500 py-4">
        {error}{" "}
        <span className="text-gray-400">
          (Check Network tab for the response body.)
        </span>
      </p>
    );
  }

  if (!review_count && (!reviews || reviews.length === 0)) {
    return <p className="text-center text-gray-500 py-4">No reviews found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">
          Verified Customer Reviews
        </h2>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold mr-2">
            {Number(average_rating || 0).toFixed(1)}
          </span>
          <span className="text-gray-600">
            Based on {review_count} review{review_count > 1 ? "s" : ""}
          </span>
        </div>

        {/* 5→1★ Breakdown */}
        <div className="space-y-2">
          {rating_percent.map((pct, idx) => {
            const star = 5 - idx;
            const width = Math.max(0, Math.min(100, Number(pct) || 0));
            return (
              <div key={star} className="flex items-center text-sm md:text-base">
                <span className="w-8">{star} ★</span>
                <div className="flex-1 mx-2 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${width}%` }} />
                </div>
                <span className="w-12 text-right text-gray-600">
                  {Math.round(width)}%
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
            {(reviews || []).map((review) => (
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
                  <div className="flex-grow">
                    <h6 className="font-medium text-sm md:text-base mb-1">
                      {review.reviewer?.username || "Anonymous"}
                    </h6>
                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-2">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleString("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
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
            {(!reviews || reviews.length === 0) && (
              <p className="text-center text-gray-500 py-4">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}