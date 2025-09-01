//components/review/ReviewListInfinite.jsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BASE_API_URL } from '@/app/constants';
import { getCleanToken } from '@/lib/getCleanToken'; // ✅ import clean token helper

export default function ReviewListInfinite({ productId, isOpen }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef();

  const loadReviews = useCallback(async () => {
    if (loading || !hasMore || !productId) return;
    setLoading(true);

    try {
const token = getCleanToken();
const reviewUrl = `${BASE_API_URL}/api/product/${productId}/reviews/?page=${page}`;

const res = await fetch(reviewUrl, {
  headers: token ? { Authorization: `Token ${token}` } : {},
});

      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType?.includes('application/json')) {
        const errorText = await res.text();
        console.error('❌ Fetch error:', res.status, errorText);
        setHasMore(false);
        return;
      }

      const data = await res.json();
      console.log('✅ Reviews loaded:', data.reviews);

      if (data.reviews?.length > 0) {
        setReviews((prev) => [...prev, ...data.reviews]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('❌ Error loading reviews:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, productId, loading, hasMore]);

  // 🔁 Load on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        loadReviews();
      }
    });

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadReviews, hasMore, loading]);

  // 🔁 Refetch when modal opens or product changes
  useEffect(() => {
    if (!productId || !isOpen) return;
    setReviews([]);
    setPage(1);
    setHasMore(true);
    loadReviews();
  }, [productId, isOpen]); // <-- ✅ depends on modal open + product

  return (
    <div>
      {reviews.map((r) => (
        <div key={r.id} className="border-b py-3">
          <div className="text-sm font-semibold">{r.user_name || 'Anonymous'}</div>
          <div className="text-yellow-500">⭐️ {r.rating}</div>
          <p className="text-gray-700">{r.comment}</p>
        </div>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center text-sm text-gray-400">
          {loading ? 'Loading more...' : 'Scroll to load more'}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-6">
          No reviews yet.
        </div>
      )}
    </div>
  );
}