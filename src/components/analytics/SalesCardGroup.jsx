// src/components/SalesCardGroup.js
import React from "react";
import salesData from "./salesData";
import StatCard from "./StatCard";


const SalesCardGroup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {salesData.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
};

export default SalesCardGroup;
