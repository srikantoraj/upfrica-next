// src/components/cards/SummaryGroup.js
import React from "react";
import { summaryCards } from "./summaryCards";
import SummaryCard from "./SummaryCard";


const SummaryGroup = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {summaryCards.map((item, i) => (
      <SummaryCard key={i} {...item} />
    ))}
  </div>
);

export default SummaryGroup;
