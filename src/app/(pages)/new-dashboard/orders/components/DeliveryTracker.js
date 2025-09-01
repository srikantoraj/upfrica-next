"use client";

import React from "react";

export default function DeliveryTracker({ stage = 0, steps = [] }) {
  if (!steps.length) {
    return (
      <div className="text-sm text-center text-gray-500 dark:text-gray-400 p-4">
        No delivery steps available.
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-4 px-2 overflow-x-auto transition-all duration-300">
      {steps.map((step, index) => {
        const isCompleted = index < stage;
        const isCurrent = index === stage;
        const isUpcoming = index > stage;

        return (
          <div
            key={index}
            className="relative flex-1 flex flex-col items-center min-w-[80px]"
          >
            {/* Connector line from previous step */}
            {index > 0 && (
              <div className="absolute top-3 left-[-50%] w-full h-1 bg-gray-200 dark:bg-gray-700 z-0">
                <div
                  className={`h-1 transition-colors duration-300 ${
                    isCompleted || isCurrent
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{ width: "100%" }}
                />
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`w-7 h-7 rounded-full z-10 mb-1 flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                isCompleted
                  ? "bg-blue-600 text-white"
                  : isCurrent
                    ? "bg-white border-2 border-blue-600 text-blue-600 dark:bg-gray-800"
                    : "bg-gray-300 dark:bg-gray-600 text-white"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            {/* Step Label */}
            <div className="text-center text-sm font-semibold text-gray-800 dark:text-white">
              {step.label}
            </div>

            {/* Optional note/date */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              {step.date || step.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}
