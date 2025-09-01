// src/components/cards/RecentUsers.js
import React from "react";
import recentUsers from "./recentUsers";
import { FaCheck, FaTimes } from "react-icons/fa";

const RecentUsers = () => {
  return (
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
  );
};

export default RecentUsers;
