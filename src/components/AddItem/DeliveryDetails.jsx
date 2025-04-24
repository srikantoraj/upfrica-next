'use client'
import React, { useState } from 'react';
import PackageDetails from './PackageDetails';
import DomesticPostage from './DomesticPostage';
import CollectionInPersonSection from './CollectionInPersonSection';

export default function DeliveryDetails({formik}) {
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

      {/* Conditional rendering for PackageDetails and DomesticPostage */}
      {(deliveryMethod === 'FLAT_RATE_LOCAL_PICKUP' || deliveryMethod === 'FLAT_RATE_ONLY') && (
        <>
          {/* Package Size & Dimensions */}
          <PackageDetails formik={formik} />

          {/* Domestic Postage */}
          <DomesticPostage />
        </>
      )}

      {deliveryMethod === 'NOT_SPECIFIED' && <CollectionInPersonSection />}



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
