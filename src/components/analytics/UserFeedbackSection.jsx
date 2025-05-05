// src/components/UserFeedbackSection.js
import React from "react";
import { FaStar, FaCheck, FaTimes } from "react-icons/fa";

// Ratings data
const ratings = {
  average: 4.7,
  counts: {
    5: 384,
    4: 145,
    3: 24,
    2: 1,
    1: 0,
  },
};

// Recent users data
const recentUsers = [
  {
    name: "Quinn Flynn",
    role: "Android developer",
    time: "11 May 12:30",
    color: "text-orange-400",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    name: "Garrett Winters",
    role: "Android developer",
    time: "11 May 12:30",
    color: "text-green-400",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Ashton Cox",
    role: "Android developer",
    time: "11 May 12:30",
    color: "text-blue-400",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    name: "Cedric Kelly",
    role: "Android developer",
    time: "11 May 12:30",
    color: "text-red-400",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
];

const UserFeedbackSection = () => {
  const total = Object.values(ratings.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Ratings Box */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Recent Users</h3>
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(ratings.average) ? "" : "text-gray-300"} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-4xl font-bold text-yellow-500">{ratings.average}</span>
          <span className="text-gray-400 text-lg">/5</span>
        </div>

        <div className="space-y-3">
          {Object.entries(ratings.counts).map(([star, count]) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-6 text-sm font-semibold">{star}★</span>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${(count / total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users Box */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Users</h3>
        <ul className="space-y-4">
          {recentUsers.map((user, i) => (
            <li key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${user.color}`}>{user.time}</span>
                <button className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
                <button className="text-green-500 hover:text-green-700">
                  <FaCheck />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserFeedbackSection;
