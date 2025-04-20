'use client'
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateSelector() {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-11-12T11:00:00'));

  return (
    <div className="mt-0 rounded-md bg-blue-600 p-1 w-full max-w-sm">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="yyyy-MM-dd'T'HH:mm:ss"
        className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholderText="Select date"
      />
    </div>
  );
}
