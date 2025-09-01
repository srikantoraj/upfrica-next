// src/components/charts/EarningsChart.js
"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { earningsData } from "./earningsData";
// import { earningsData } from "../../data/analyticsData";

const EarningsChart = () => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <p className="text-lg font-bold text-gray-800">
      Total Earnings: {earningsData.total}
    </p>
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={earningsData.chart}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={3}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default EarningsChart;
