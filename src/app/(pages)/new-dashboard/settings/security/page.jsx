//src/app/(pages)/new-dashboard/settings/security/page.jsx
"use client"; // Ensures it's a Client Component if needed

import React from "react";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <p className="text-gray-600">
        This is the main settings dashboard. Customize your profile, security,
        and payout settings here.
      </p>

      {/* Dummy links to sub-settings pages */}
      <ul className="mt-6 space-y-2">
        <li>
          <a
            href="/new-dashboard/settings/profile"
            className="text-blue-500 hover:underline"
          >
            Profile Settings
          </a>
        </li>
        <li>
          <a
            href="/new-dashboard/settings/security"
            className="text-blue-500 hover:underline"
          >
            Security Settings
          </a>
        </li>
        <li>
          <a
            href="/new-dashboard/settings/payout"
            className="text-blue-500 hover:underline"
          >
            Payout Settings
          </a>
        </li>
      </ul>
    </div>
  );
}
