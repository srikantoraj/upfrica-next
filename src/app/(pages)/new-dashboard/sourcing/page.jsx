// src/app/(pages)/new-dashboard/sourcing/page.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import RequestForm from "@/components/sourcing/RequestForm";

export default function SourcingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const intent = sp.get("intent") || "";

  return (
    <RequestForm
      cc="gh"
      initialTitle={intent}
      onSuccess={(created) => {
        // Send buyer to the request detail; fallback to list
        if (created?.id) {
          router.push(`/new-dashboard/requests/${created.id}`);
        } else {
          router.push("/new-dashboard/agent/requests?tab=my");
        }
      }}
    />
  );
}