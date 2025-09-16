// src/components/new-dashboard/AgentShell.jsx
"use client";

export default function AgentShell({ title, actions, children }) {
  return (
    <div className="max-w-7xl mx-auto p-4text-gray-800 dark:text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}