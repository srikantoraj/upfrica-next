// src/components/cards/SummaryCard.js
import React from "react";

const SummaryCard = ({ title, value, icon, bg, text }) => (
  <div className={`rounded-xl px-4 py-3 shadow ${bg}`}>
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-lg font-bold ${text}`}>{value}</p>
      </div>
    </div>
  </div>
);

export default SummaryCard;
