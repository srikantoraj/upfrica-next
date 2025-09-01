"use client";
import React, { useState } from "react";

const ScheduleListing = () => {
  const [isScheduled, setIsScheduled] = useState(true);
  const [date, setDate] = useState("2025-04-22");
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  const hours = [...Array(24).keys()].map((h) => String(h).padStart(2, "0"));
  const minutes = [...Array(60).keys()].map((m) => String(m).padStart(2, "0"));

  return (
    <div className="">
      <div className="flex justify-between items-start mb-4">
        <div>
          <label className="text-lg font-medium block mb-1">
            Schedule your listing
          </label>
          <p className="text-gray-600 text-sm max-w-md">
            Your listing goes live immediately, unless you select a time and
            date you want it to start.
          </p>
        </div>

        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isScheduled}
              onChange={() => setIsScheduled(!isScheduled)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>

      {isScheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
          <div>
            <label
              htmlFor="schedule-date"
              className="block text-sm font-medium"
            >
              Day
            </label>
            <input
              id="schedule-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium mb-1">Time</legend>
              <div className="flex items-center gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="text-lg font-semibold">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="ml-2 text-sm text-gray-600">BST</span>
              </div>
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleListing;
