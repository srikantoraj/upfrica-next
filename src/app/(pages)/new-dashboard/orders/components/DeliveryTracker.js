"use client";

import React from "react";

export default function DeliveryTracker({ stage = 0, steps = [] }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-4 px-6 transition-all duration-300">
      {steps.map((step, index) => {
        const isCompleted = index <= stage;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {index > 0 && (
              <div className="absolute top-3 left-[-50%] w-full h-1 bg-gray-200 dark:bg-gray-700 z-0">
                <div
                  className={`h-1 transition-colors duration-300 ${
                    isCompleted ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            )}

            {/* Circle */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 mb-1 transition-colors duration-300 ${
                isCompleted
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-white"
              }`}
            >
              ✓
            </div>

            {/* Label */}
            <div className="text-center text-sm font-semibold text-gray-800 dark:text-white">
              {step.label}
            </div>

            {/* Date or note */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              {step.date || step.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}