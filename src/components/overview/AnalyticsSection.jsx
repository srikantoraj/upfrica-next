// src/components/AnalyticsSection.js
import React from "react";
import EarningsChart from "./EarningsChart";
import SummaryGroup from "./SummaryGroup";
import MapPlaceholder from "./MapPlaceholder";

const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <EarningsChart />
    </div>
  );
};

export default AnalyticsSection;
