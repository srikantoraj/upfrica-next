// src/components/cards/UserStats.js
import React from "react";
import IdeasLocations from "./IdeasLocations";

const UserStats = () => {
    return (
        <div>
            <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Users From United States</h3>
                <div className="text-xl font-bold text-gray-900">$249.95</div>
                <p className="text-sm text-gray-400 mt-2">Total Earnings</p>
                <div className="mt-4 text-blue-500">[Line Chart Placeholder]</div>
            </div>
            {/* <IdeasLocations /> */}
        </div>
    );
};

export default UserStats;
