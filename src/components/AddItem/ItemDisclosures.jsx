'use client'
import React, { useState } from 'react';

export default function ItemDisclosures() {
  const [productDocuments, setProductDocuments] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Item disclosures</h2>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm">
        Provide more details about your item’s safety and quality standards if you post to buyers in the EU/UK.
      </p>

      {/* Product Documents Switch */}
      <div className="flex items-start justify-between p-4 border rounded-md bg-gray-50">
        <div>
          <label className="block font-medium mb-1">Product documents</label>
          <p className="text-sm text-gray-600">
            Upload user guides, certificates, documents and accessibility information that are included with the item.{" "}
            <a
              href="https://www.ebay.co.uk/help/selling/selling/hazardous-materials-labeling?id=5407"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Learn more
            </a>
          </p>
        </div>
        <div>
          <input
            type="checkbox"
            className="toggle"
            checked={productDocuments}
            onChange={() => setProductDocuments(!productDocuments)}
          />
        </div>
      </div>
    </div>
  );
}
