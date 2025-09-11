// components/review/DisplayReviews.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProductRatingLine from '@/components/review/ProductRatingLine';
import { api, apiJSON } from '@/lib/api'; // ← unified helper

/* ---------------- lazy modal ---------------- */
const ProductReviewModalLazy = dynamic(() => import('./ProductReviewModal'), { ssr: false });

export default function DisplayReviews({ product }) {
  const { region } = useParams();
  const router = useRouter();
  const { user, hydrated } = useAuth();

  const [reviewStats, setReviewStats] = useState({
    average_rating: 0,
    review_count: 0,
    rating_percent: {},
    reviews: [],
  });

  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [copiedReviewId, setCopiedReviewId] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openShareId, setOpenShareId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ---------------- fetch reviews via unified api() ---------------- */
  useEffect(() => {
    if (!product?.id || !hydrated) return;

    let cancelled = false;

    (async () => {
      // Try plural then singular to be tolerant of backend route names
      const paths = [
        `products/${product.id}/reviews`,
        `product/${product.id}/reviews`,
      ];

      for (const path of paths) {
        try {
          const data = await api(path, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
          });

          if (cancelled) return;

          const results =
            Array.isArray(data?.results) ? data.results :
            Array.isArray(data?.reviews) ? data.reviews :
            [];

          // ---- derive rating_percent if missing
          const countsFromApi =
            data?.rating_counts ?? data?.rating_count ?? data?.counts ?? null; // {5:n,4:n,...}

          let ratingPercent =
            data?.rating_percent ?? data?.rating_distribution ?? null;

          if (!ratingPercent) {
            const counts =
              countsFromApi ??
              results.reduce((acc, r) => {
                const s = Math.max(1, Math.min(5, Math.round(Number(r?.rating) || 0)));
                acc[s] = (acc[s] || 0) + 1;
                return acc;
              }, {});
            const total = Object.values(counts || {}).reduce((a, b) => a + b, 0);
            const pct = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            if (total > 0) {
              for (let s = 1; s <= 5; s++) {
                const c = Number(counts?.[s] || 0);
                pct[s] = Math.round((c / total) * 100);
              }
            }
            ratingPercent = pct;
          }

          setReviewStats({
            average_rating: Number(data?.average_rating) || 0,
            review_count: Number(data?.review_count) || results.length,
            rating_percent: ratingPercent || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            reviews: results,
          });

          break; // success; stop trying others
        } catch {
          // try next candidate
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product?.id, hydrated]);

  /* ---------------- helpers ---------------- */
  const redirectToLogin = () => {
    const next =
      typeof window !== 'undefined'
        ? location.pathname + location.search + location.hash
        : '/';
    router.push(`/login?next=${encodeURIComponent(next)}`);
  };

  /* ---------------- actions: vote/report via apiJSON() ---------------- */
  const handleVote = async (reviewId, voteValue) => {
    if (!user) {
      toast('Please login to vote on reviews.');
      redirectToLogin();
      return;
    }

    try {
      const data = await apiJSON(`reviews/${reviewId}/vote`, { vote: voteValue });

      const toastMsg =
        voteValue === 1
          ? data.user_has_voted
            ? 'Marked as helpful ✅'
            : 'Removed helpful vote ❌'
          : data.user_has_voted === false
          ? 'Marked as not helpful 👎'
          : 'Removed not helpful vote';

      toast(toastMsg);

      setReviewStats((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                helpful_count: data.helpful_count,
                user_has_voted: data.user_has_voted,
              }
            : r
        ),
      }));
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.startsWith('API 401')) return redirectToLogin();
      toast.error('Failed to submit vote.');
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.error('Please login to report a review.');
      redirectToLogin();
      return;
    }
    if (!selectedReason || submitting) return;

    setSubmitting(true);
    try {
      const data = await apiJSON(`reviews/${reportingReviewId}/report`, {
        reason: selectedReason,
      });

      toast.success(
        data?.updated ? 'Report updated. Thanks for clarifying!' : 'Report submitted. Thank you!'
      );
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.startsWith('API 401')) return redirectToLogin();
      toast.error('Failed to report. Try again.');
    } finally {
      setSubmitting(false);
      setReportModalOpen(false);
      setSelectedReason('');
    }
  };

  /* ---------------- derived ---------------- */
  const mediaItems = reviewStats.reviews
    .flatMap((r) => r.media || [])
    .filter((m) => m.url)
    .slice(0, 6);

  return (
    <div className="space-y-6 mt-4">
      <Toaster position="top-right" />

      {reviewStats.review_count > 0 ? (
        <>
          <ProductRatingLine
            averageRating={reviewStats.average_rating}
            reviewCount={reviewStats.review_count}
          />

          {/* Star breakdown */}
          <div className="text-sm text-gray-700 space-y-2">
            {Object.entries(reviewStats.rating_percent)
              .sort((a, b) => Number(b[0]) - Number(a[0])) // 5 → 1
              .map(([star, percent]) => (
                <div key={star} className="flex items-center space-x-3">
                  <span className="w-12 flex items-center justify-end text-base font-semibold text-yellow-500">
                    {star} <span className="ml-0.5">★</span>
                  </span>
                  <div className="w-full max-w-xs bg-gray-200 rounded overflow-hidden">
                    <div className="h-3 bg-yellow-500 rounded" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-12 text-sm text-gray-600 text-right">{percent}%</span>
                </div>
              ))}
          </div>

          {/* Media preview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Photos & Videos from customers:</h3>
            {mediaItems.length > 0 ? (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {mediaItems.map((media, idx) => {
                  const isVideo =
                    media.media_type === 'video' || media.url?.match(/\.(mp4|mov|webm)$/i);
                  return (
                    <div
                      key={`${idx}-${media.url}`}
                      className="w-20 h-20 rounded border cursor-pointer relative flex-shrink-0"
                      onClick={() => {
                        setLightboxMedia(mediaItems);
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      {isVideo ? (
                        <>
                          <video src={media.url} muted className="w-full h-full object-cover rounded" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-1">
                              <span className="text-white text-xs">▶</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <img src={media.url} alt="Review media" className="w-full h-full object-cover rounded" loading="lazy" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No customer photos or videos yet</p>
            )}
          </div>

          {/* Review list */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">What customers are saying:</h3>
            <div className="space-y-4">
              {reviewStats.reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-100 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative"
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-medium text-gray-800 line-clamp-2">
                      {r.title || 'Review'}
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      <span className={expandedReviewId === r.id ? '' : 'line-clamp-3'}>
                        {r.comment}
                      </span>
                      {r.comment?.length > 100 && (
                        <button
                          onClick={() =>
                            setExpandedReviewId(expandedReviewId === r.id ? null : r.id)
                          }
                          className="text-xs text-blue-500 hover:underline ml-1"
                        >
                          {expandedReviewId === r.id ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </p>

                    <div className="flex items-center text-base font-semibold text-yellow-500 mt-1">
                      <span className="text-lg">{'⭐'.repeat(Math.floor(r.rating))}</span>
                      <span className="ml-2 text-sm text-gray-600 font-normal">({r.rating})</span>
                      <span className="mx-2 text-sm text-gray-400">—</span>
                      <span className="text-sm italic text-gray-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {r.reviewer?.name && (
                      <p className="text-xs text-gray-500">by {r.reviewer.name}</p>
                    )}

                    {r.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag.id}
                            className="text-blue-800 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {r.media?.length > 0 && (
                      <div className="flex gap-3 flex-wrap mt-3">
                        {r.media.map((m, idx) => (
                          <div
                            key={m.id || m.filename}
                            className="w-20 h-20 cursor-pointer"
                            onClick={() => {
                              setLightboxMedia(r.media);
                              setLightboxIndex(idx);
                              setLightboxOpen(true);
                            }}
                          >
                            {m.media_type === 'image' ? (
                              <img
                                src={m.url}
                                alt={m.filename || 'Review media'}
                                className="w-full h-full object-cover rounded-md border"
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video
                                  src={m.url}
                                  muted
                                  className="w-full h-full object-cover rounded-md border"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black bg-opacity-50 rounded-full p-1">
                                    <span className="text-white text-xs">▶</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <button
                        onClick={() => handleVote(r.id, 1)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md border transition ${
                          r.user_has_voted === true
                            ? 'bg-green-100 border-green-400 text-green-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        👍 Helpful ({r.helpful_count || 0})
                      </button>

                      <button
                        onClick={() => handleVote(r.id, -1)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md border transition ${
                          r.user_has_voted === false
                            ? 'bg-red-100 border-red-400 text-red-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        👎 Not Helpful
                      </button>

                      <button
                        onClick={() => {
                          setReportingReviewId(r.id);
                          setReportModalOpen(true);
                        }}
                        title="Report review"
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600"
                      >
                        ⚠️ Report
                      </button>

                      {/* Share */}
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setOpenShareId(openShareId === r.id ? null : r.id)}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-black"
                          title="Share review"
                        >
                          🔗 Share
                        </button>

                        {openShareId === r.id && (
                          <div
                            className="absolute z-10 bg-white border shadow-md rounded-md p-2 mt-1 space-y-1 text-sm w-44 right-0"
                            onMouseLeave={() => setOpenShareId(null)}
                          >
                            <a
                              href={`https://facebook.com/sharer/sharer.php?u=https://upfrica.com/review/${r.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:underline"
                            >
                              Facebook
                            </a>
                            <a
                              href={`https://wa.me/?text=https://upfrica.com/review/${r.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:underline"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`https://twitter.com/intent/tweet?url=https://upfrica.com/review/${r.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:underline"
                            >
                              X (Twitter)
                            </a>
                            <a
                              href={`mailto:?subject=Check this review&body=https://upfrica.com/review/${r.id}`}
                              className="block hover:underline"
                            >
                              Email
                            </a>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://upfrica.com/review/${r.id}`);
                                setCopiedReviewId(r.id);
                                setTimeout(() => setCopiedReviewId(null), 2000);
                              }}
                              className="text-left text-gray-600 hover:underline w-full"
                            >
                              {copiedReviewId === r.id ? '✅ Copied!' : 'Copy link'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet</p>
      )}

      {reviewStats?.review_count > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-purple-100 text-purple-700 rounded-md shadow hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          >
            🌟 See all {reviewStats.review_count} Reviews
          </button>

          <Link
            href={`${product?.frontend_url}/reviews`}
            className="w-full sm:w-auto px-4 text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          >
            📂 Full Reviews Page →
          </Link>
        </div>
      )}

      {/* Modal mounted below to avoid hydration issues */}
      <ProductReviewModalLazy product={product} isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-bold mb-4">Report this review</h2>
            <p className="text-sm text-gray-600 mb-2">Why are you reporting this?</p>

            <div className="space-y-2 text-sm">
              {['Off-topic', 'Inappropriate', 'Fake', 'Other'].map((reason) => (
                <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="report_reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-purple-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-1 text-gray-600 rounded hover:underline"
                onClick={() => {
                  setReportModalOpen(false);
                  setSelectedReason('');
                }}
              >
                Cancel
              </button>

              <button
                disabled={!selectedReason || submitting}
                onClick={handleReport}
                className={`px-4 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-black font-semibold ${
                  !selectedReason || submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w/full max-h/full">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 text-white bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-2xl shadow-lg z-[1000] transition"
            >
              ✕
            </button>

            {lightboxMedia[lightboxIndex]?.media_type === 'image' ? (
              <img
                src={lightboxMedia[lightboxIndex].url}
                alt="Media"
                className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
              />
            ) : (
              <video
                src={lightboxMedia[lightboxIndex].url}
                controls
                autoPlay
                className="max-h/[90vh] max-w/[90vw] rounded shadow-lg"
              />
            )}

            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-3xl shadow-lg z-[1000] transition"
              >
                ‹
              </button>
            )}

            {lightboxIndex < lightboxMedia.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-3xl shadow-lg z-[1000] transition"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}