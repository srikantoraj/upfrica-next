'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { BASE_API_URL } from '@/app/constants';

export default function StoreDetailsSettings() {
  const { token, user } = useSelector((s) => s.auth);
  const [contactNumber, setContactNumber] = useState('');
  const [useMomo, setUseMomo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setContactNumber(user.seller_contact_number || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      seller_contact_number: useMomo ? user.momo_number : contactNumber,
    };
    await fetch(`${BASE_API_URL}/api/users/me/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Public Seller Contact Number</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="+233241234567"
            disabled={useMomo}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useMomo}
            onChange={(e) => setUseMomo(e.target.checked)}
          />
          <label className="text-sm">Use same as payout MoMo number ({user?.momo_number})</label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-violet-600 text-white rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}