'use client'
import React, { useState } from 'react';

export default function DeliveryDetails() {
  const [showOptions, setShowOptions] = useState(false);
  const [internationalPostage, setInternationalPostage] = useState(false);
  const [excludedLocations, setExcludedLocations] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('FLAT_RATE_ONLY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Delivery details</h2>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center space-x-1 text-blue-600 hover:underline"
        >
          <span>See postage options</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M5 8l7 7 7-7" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
      </div>

      {/* Toggle Options */}
      {showOptions && (
        <div className="space-y-4 p-4 border rounded-md bg-gray-50">
          <div className="flex items-center justify-between">
            <label className="font-medium">International postage</label>
            <input type="checkbox" checked={internationalPostage} onChange={() => setInternationalPostage(!internationalPostage)} className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Excluded locations</label>
              <p className="text-sm text-gray-500">Set specific locations that you don’t want to post to.</p>
            </div>
            <input type="checkbox" checked={excludedLocations} onChange={() => setExcludedLocations(!excludedLocations)} className="toggle" />
          </div>
        </div>
      )}

      {/* Delivery Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'FLAT_RATE_LOCAL_PICKUP', title: 'Postage or collection in person', subtitle: 'Let buyers choose how they get their items.' },
          { name: 'FLAT_RATE_ONLY', title: 'Postage only', subtitle: 'Post items directly to buyers.' },
          { name: 'NOT_SPECIFIED', title: 'Collection only', subtitle: 'Arrange collection in person without any postage costs.' },
          { name: 'FREIGHT_RATE', title: 'Freight only', subtitle: 'Post oversized items.' },
        ].map((method) => (
          <button
            key={method.name}
            onClick={() => setDeliveryMethod(method.name)}
            className={`border h-[150px]  p-4 rounded-md text-left ${deliveryMethod === method.name ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <h4 className="font-semibold">{method.title}</h4>
            <p className="text-sm text-gray-600">{method.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Package Size & Dimensions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Package size (optional)</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">Weight (kg)</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="kg" />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Weight (g)</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="g" />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">Length (cm)</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="cm" />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Width (cm)</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="cm" />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Depth (cm)</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="cm" />
          </div>
        </div>
      </div>

      {/* Domestic Postage */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Domestic postage</h3>
        <p className="text-sm text-gray-600">For complete seller protection, choose postage with tracking and purchase the postage label through eBay.</p>
        <button className="inline-flex items-center space-x-2 text-blue-600 hover:underline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" /></svg>
          <span>Add primary service</span>
        </button>
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Preferences</h3>
        <div className="space-y-1 text-sm text-gray-700">
          <div>3 working days handling</div>
          <div>Item location: Bangladesh (Postcode not shown)</div>
          <div>No returns accepted unless item is not as described</div>
        </div>
      </div>
    </div>
  );
}
