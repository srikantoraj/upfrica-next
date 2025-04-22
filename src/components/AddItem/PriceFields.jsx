'use client'
import React, { useState } from "react";

export default function PricingSection() {
  const [format, setFormat] = useState("Auction");
  const [duration, setDuration] = useState("7 days");
  const [startingBid, setStartingBid] = useState("47.70");
  const [buyItNow, setBuyItNow] = useState("136.91");
  const [immediatePay, setImmediatePay] = useState(false);
  const [reservePrice, setReservePrice] = useState("");
  const quantity = 1;

  return (
    <div className="space-y-6  rounded-lg bg-white w-full lg:w-4/5">
      {/* Format Selection */}
      <div className="grid grid-cols-1 space-y-3">
        <div>
          <label className="block font-medium text-sm mb-1">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Auction">Auction</option>
            <option value="BuyItNow">Buy it now</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium text-sm mb-1">Auction duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="3 days">3 days</option>
            <option value="5 days">5 days</option>
            <option value="7 days">7 days</option>
            <option value="10 days">10 days</option>
          </select>
        </div>
      </div>

      {/* Starting Bid + Buy it Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Starting Bid */}
        <div>
          <label className="block font-medium text-sm mb-1">Starting bid</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">£</span>
            <input
              type="text"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              className="w-full pl-7 border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Buy It Now */}
        <div>
          <label className="block font-medium text-sm mb-1">
            Buy it now <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">£</span>
            <input
              type="text"
              value={buyItNow}
              onChange={(e) => setBuyItNow(e.target.value)}
              className="w-full pl-7 border px-3 py-2 rounded"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum: £66.78</p>
        </div>
      </div>

      {/* Immediate Payment */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="immediatePay"
          checked={immediatePay}
          onChange={() => setImmediatePay(!immediatePay)}
          className="mt-1"
        />
        <label htmlFor="immediatePay" className="text-sm text-gray-700">
          Require immediate payment when buyer uses Buy it now
        </label>
      </div>

      {/* Reserve Price */}
      <div>
        <label className="block font-medium text-sm mb-1">
          Reserve price{" "}
          <span className="text-gray-500">(optional — fees apply)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">£</span>
          <input
            type="text"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
            className="w-full pl-7 border px-3 py-2 rounded"
          />
        </div>
        {/* Tooltip placeholder */}
        <p className="text-xs text-gray-500 mt-1">
          This is the lowest price you're willing to sell for. Fees apply even if the item doesn’t sell.
        </p>
      </div>

      {/* Quantity (readonly) */}
      <div>
        <label className="block font-medium text-sm mb-1">Quantity</label>
        <input
          type="text"
          value={quantity}
          disabled
          className="w-20 px-3 py-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>
    </div>
  );
}
