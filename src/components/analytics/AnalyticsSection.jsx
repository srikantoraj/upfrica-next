// src/components/AnalyticsSection.js
import React from "react";
import EarningsChart from "./EarningsChart";
import SummaryGroup from "./SummaryGroup";
import MapPlaceholder from "./MapPlaceholder";


const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <MapPlaceholder className="col-span-1 lg:col-span-2" />
      <EarningsChart />
      {/* <SummaryGroup /> */}
    </div>
  );
};

export default AnalyticsSection;
