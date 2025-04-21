'use client'
import React, { useState } from "react";

export default function PromoteYourListing() {
  const [adRate, setAdRate] = useState(9);
  const [isPromoted, setIsPromoted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4 ">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase">
          Promote Your Listing
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Promoting your listings can help you drive sales by putting your listings in front of relevant buyers.
        </p>
      </div>

      <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        {/* Strategy */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">General campaign strategy</p>
          <p className="text-sm font-semibold text-gray-900">Reach more buyers</p>
          <p className="text-sm text-gray-600 mt-1">
            Increase listing visibility via ad placements. Pay when your promoted items sell.
          </p>
        </div>

        {/* Insight */}
        <div className="flex-1 border-l pl-6">
          <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none">
              <path d="M2 21H22M21 4H16M21 9V4M13 13L21 4M4 15L9 9M9 9L13 13" stroke="#3665F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            40% more daily bids
          </p>
          <p className="text-sm text-gray-600 mt-1">
            When promoting auction listings with a general campaign strategy, on average (Jul 2024 - Aug 2024).
          </p>
        </div>

        {/* Ad rate + toggle */}
        <div className="flex-1 border-l pl-6 flex flex-col justify-between gap-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Listing ad rate
                <button className="text-gray-400 hover:text-gray-600" aria-label="Info">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 108 8A8 8 0 008 0zm.93 12.588h-1.8v-1.8h1.8zm1.307-6.323a2.312 2.312 0 00-.516-.89 2.247 2.247 0 00-.822-.528 3.414 3.414 0 00-1.066-.169 3.1 3.1 0 00-1.23.247 2.277 2.277 0 00-.902.703 1.753 1.753 0 00-.325.961h1.86a.881.881 0 01.158-.417.87.87 0 01.32-.276 1.107 1.107 0 01.485-.105 1.148 1.148 0 01.589.14.659.659 0 01.264.564.825.825 0 01-.11.406 2.07 2.07 0 01-.379.46c-.21.198-.395.374-.553.528a2.706 2.706 0 00-.426.53 1.615 1.615 0 00-.222.704v.243h1.8v-.12a1.2 1.2 0 01.13-.487 2.021 2.021 0 01.31-.429c.162-.178.34-.355.532-.528a3.151 3.151 0 00.544-.627 1.622 1.622 0 00.219-.872 2.04 2.04 0 00-.148-.761z" />
                  </svg>
                </button>
              </div>

              {/* Editable ad rate */}
              <div className="flex items-center gap-2 mt-1">
                {isEditing ? (
                  <input
                    type="number"
                    value={adRate}
                    onChange={(e) => setAdRate(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    className="w-16 px-2 py-1 border text-sm rounded"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    {adRate}%
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M11.25 1.75L14.25 4.75L5.25 13.75H2.25V10.75L11.25 1.75Z" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </button>
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500">Suggested: 9.0%</p>
            </div>

            {/* Toggle */}
            <label className="inline-flex items-center cursor-pointer ml-4 mt-1">
              <input
                type="checkbox"
                checked={isPromoted}
                onChange={() => setIsPromoted(!isPromoted)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative transition">
                <div className="w-4 h-4 bg-white absolute left-0.5 top-0.5 rounded-full transition peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          {/* Campaign name */}
          <p className="text-sm text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
            New campaign: Campaign 21/04/2025...
          </p>
        </div>
      </div>
    </div>
  );
}

