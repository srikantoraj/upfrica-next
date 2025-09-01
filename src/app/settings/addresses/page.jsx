//src/app/settings/addresses/page.jsx
'use client';

import { useEffect, useState } from 'react';
import AddressForm from '@/components/addresses/AddressForm';
import { getCleanToken } from "@/lib/getCleanToken";
import { BASE_API_URL } from "@/app/constants";

export default function AddressPage() {
  const cleanToken = getCleanToken();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/addresses/`, {
        headers: { Authorization: `Token ${cleanToken}` },
      });
      const data = await res.json();
      setSavedAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (cleanToken) fetchAddresses();
  }, [cleanToken]);

  const handleEdit = (address) => {
    const a = address.address_data || {};
    setEditingAddress({
      id: address.id,
      full_name: address.full_name,
      phone_number: a.phone_number || address.phone_number || '',
      address_line_1: a.address_line_1 || '',
      address_line_2: a.address_line_2 || '',
      town: a.town || '',
      state_or_region: a.state_or_region || '',
      country: a.country || address.country || '',
      postcode: a.postcode || '',
      default: address.default || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </h2>

      {scriptLoaded ? (
        <AddressForm
          token={cleanToken}
          onSave={() => {
            fetchAddresses();
            setEditingAddress(null);
          }}
          scriptLoaded={scriptLoaded}
          initialData={editingAddress}
          editId={editingAddress?.id}
          onCancel={handleCancelEdit}
        />
      ) : (
        <p>Loading address form...</p>
      )}

      {editingAddress && (
        <div className="mt-2 mb-6">
          <button
            onClick={handleCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cancel Edit
          </button>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-8 dark:text-white">Saved Addresses</h3>
      <ul className="mt-4 space-y-4">
        {savedAddresses.map((addr) => {
          const a = addr.address_data || {};
          return (
            <li
              key={addr.id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{addr.full_name}</div>
                  <div className="text-sm">
                    {a.address_line_1 || addr.address_line_1}, {a.town || addr.town}
                  </div>
                  <div className="text-sm">
                    {a.postcode || addr.postcode}, {a.country || addr.country}
                  </div>
                  <div className="text-sm">📞 {a.phone_number || addr.phone_number}</div>
                </div>
                {addr.default && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">Default</span>
                )}
              </div>

              <div className="mt-2 flex gap-4 text-sm">
                {!addr.default && (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(addr)}
                  >
                    Edit
                  </button>
                )}
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}