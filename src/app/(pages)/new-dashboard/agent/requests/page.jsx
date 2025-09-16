// src/app/(pages)/new-dashboard/agent/requests/page.jsx
"use client";
import BrowseRequestsTable from "@/components/new-dashboard/sourcing/tables/BrowseRequestsTable";

export default function AgentRequestsPage() {
  return <BrowseRequestsTable mode="agent" />;
}