"use client";
import React, { useState } from "react";

export default function PricingOptionsPanel() {
  const [expanded, setExpanded] = useState(false);
  const [options, setOptions] = useState({
    autofill: true,
    buyItNow: true,
    immediatePay: true,
    reservePrice: true,
    scheduling: true,
    sellAsLot: false,
    autoRelist: true,
    privateListing: false,
  });

  const toggleOption = (key) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="pb-4">
      {/* Header + Expand */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          aria-expanded={expanded}
        >
          See pricing options
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
      </div>

      {/* Expandable Options */}
      {expanded && (
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          {[
            {
              key: "autofill",
              label: "Autofill pricing details",
              description:
                "Allow the Buy It Now price or auction starting bid to be autofilled based on similar or matching items.",
            },
            {
              key: "buyItNow",
              label: "Buy it now",
              description: "Add a fixed price option to your auction.",
            },
            {
              key: "immediatePay",
              label: "Immediate payment",
              description:
                "Require immediate payment for Buy it now purchases.",
              indent: true,
            },
            {
              key: "reservePrice",
              label: "Reserve price",
              description:
                "Set the lowest price you're willing to sell an item for (non-refundable fee applies).",
            },
            {
              key: "scheduling",
              label: "Scheduling",
              description:
                "Select the time and date you want your listing to go live (non-refundable fee applies).",
            },
            {
              key: "sellAsLot",
              label: "Sell as a lot",
              description:
                "Group similar or identical items together to sell to a single buyer.",
            },
            {
              key: "autoRelist",
              label: "Auto relist",
              description:
                "Automatically relist this item up to 8 times if it doesn’t sell with no insertion or optional listing upgrade fees.",
            },
            {
              key: "privateListing",
              label: "Private listing",
              description:
                "Allow buyers to remain anonymous when they bid on or buy an item.",
            },
          ].map(({ key, label, description, indent }) => (
            <div
              key={key}
              className={`flex items-start justify-between ${
                indent ? "pl-4 border-l border-gray-200" : ""
              }`}
            >
              <div className="flex-1 pr-4">
                <label className="block font-medium">{label}</label>
                <p className="text-gray-500 text-sm">{description}</p>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={() => toggleOption(key)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition-all">
                    <div className="w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
