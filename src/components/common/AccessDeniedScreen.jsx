//src/components/common/AccessDeniedScreen.jsx
"use client";

import React from "react";
import Link from "next/link";

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-600">
        You don’t have permission to view this dashboard.
      </p>
      <Link href="/new-dashboard">
        <button className="btn-base btn-primary">Go Back to Dashboard</button>
      </Link>
    </div>
  );
}
