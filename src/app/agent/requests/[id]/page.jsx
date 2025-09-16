// src/app/agent/requests/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { ArrowLeft, Coins, CalendarDays, MapPin, ImageIcon, Loader2 } from "lucide-react";

async function getRequest(id) {
  const { data } = await axios.get(`/api/sourcing/requests/${id}/`);
  return data;
}
async function getOffers(id) {
  const { data } = await axios.get(`/api/sourcing/offers/`, { params: { request: id, ordering: "-created_at" } });
  return data?.results || [];
}

export default function AgentRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [req, setReq] = useState(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const [r, o] = await Promise.all([getRequest(id), getOffers(id)]);
        if (!alive) return;
        setReq(r || null);
        setOffers(o || []);
      } catch (e) {
        toast.error("Couldn’t load request.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-gray-800 dark:text-white">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (!req) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-gray-800 dark:text-white">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="mt-4">Not found.</div>
      </div>
    );
  }

  const mediaCount = Number(req.media_count || 0);
  const budget =
    req.budget_min || req.budget_max
      ? `${req.budget_min ?? "—"} – ${req.budget_max ?? "—"}`
      : "—";

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-800 dark:text-white">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
        <h1 className="text-xl font-semibold">{req.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{req.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs mt-4">
          <Field icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={`${req.city || "—"}, ${(req.country || "—").toUpperCase()}`} />
          <Field icon={<Coins className="w-3.5 h-3.5" />} label="Budget" value={budget} />
          <Field icon={<CalendarDays className="w-3.5 h-3.5" />} label="Needed by" value={req.needed_by || "—"} />
          <Field icon={<ImageIcon className="w-3.5 h-3.5" />} label="Media" value={mediaCount || "—"} />
        </div>
      </div>

      <section className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Offers</h2>
        {offers.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm text-gray-600 dark:text-gray-400">
            No offers yet. Go back and use <strong>Propose offer</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {offers.map((o) => (
              <div key={o.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <div className="text-sm">
                  <div className="font-medium">Status: {o.status || "pending"}</div>
                  <div className="mt-1">Price: {o.price_display || `${o.currency || ""} ${o.price ?? "—"}`}</div>
                  <div className="mt-1">ETA: {o.eta_days ? `${o.eta_days} day(s)` : "—"}</div>
                  <div className="mt-1">Condition: {o.condition || "—"}</div>
                </div>
                {o.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{o.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 dark:text-gray-400">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </div>
        <div className="text-sm truncate">{value}</div>
      </div>
    </div>
  );
}