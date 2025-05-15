'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const PendingReviewsPage = () => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const res = await fetch(
          'https://media.upfrica.com/api/admin/products/redmi-power-bank-18w-fast-power-charger/reviews/pending/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`, // adjust to `Bearer` if needed
            },
          }
        );

        if (!res.ok) {
          console.error('Failed to fetch pending reviews:', res.status, await res.text());
          return;
        }

        const data = await res.json();
        console.log('✅ Pending reviews:', data);
      } catch (err) {
        console.error('Error fetching pending reviews:', err);
      }
    };

    // only fetch if we have a token
    if (token) {
      fetchPendingReviews();
    } else {
      console.warn('No auth token found—skipping pending reviews fetch.');
    }
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Pending Reviews</h1>
      <p className="text-gray-600">
        Check your browser console (<code>F12</code> → Console) to see the array of pending reviews returned by the API.
      </p>
    </div>
  );
};

export default PendingReviewsPage;
