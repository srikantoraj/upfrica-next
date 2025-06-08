"use client";

import React from "react";

export default function DeliveryTracker({ stage = 0, steps = [] }) {
  return (
    <div className="border-b-2"><h4 className="text-[16px] sm:text-[18px] leading-6 font-bold text-[#0f1111] mb-1 mt-4">Tracking details</h4>
    <div className="flex justify-between items-center py-4 px-6">
      {steps.map((step, index) => {
        const isCompleted = index <= stage;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {index > 0 && (
              <div className="absolute top-3 left-[-50%] w-full h-1 bg-gray-200 z-0">
                <div
                  className={`h-1 ${
                    isCompleted ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            )}

            {/* Circle */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 mb-1 ${
                isCompleted ? "bg-blue-600 text-white" : "bg-gray-300 text-white"
              }`}
            >
              ✓
            </div>

            {/* Label */}
            <div className="text-center text-sm font-semibold">
              {step.label}
            </div>

            {/* Date or note */}
            <div className="text-center text-xs text-gray-500 mt-1">
              {step.date || step.note}
            </div>
          </div>
        );
      })}
    </div></div>
  );
}