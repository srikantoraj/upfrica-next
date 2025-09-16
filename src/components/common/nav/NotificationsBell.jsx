// src/components/common/nav/NotificationsBell.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNotifSummary } from "@/lib/notifications";
import { Inbox, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function NotificationsBell({ dashboardHref = "/new-dashboard" }) {
  const { summary } = useNotifSummary();
  const { total, buyer_quotes, agent_approvals, hrefs = {} } = summary || {};
  const [open, setOpen] = useState(false);

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Click-away to close
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      const b = btnRef.current;
      const m = menuRef.current;
      if (b && b.contains(e.target)) return;
      if (m && m.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Optional: tiny dot elsewhere in the UI
  useEffect(() => {
    const dot = document.getElementById("m-notif-dot");
    if (!dot) return;
    dot.style.display = total ? "inline-block" : "none";
  }, [total]);

  const countBadge = total > 9 ? "9+" : total || null;
  const toBuyer = hrefs.buyer_quotes || `${dashboardHref}?tab=sourcing&filter=quotes`;
  const toAgent = hrefs.agent_approvals || `${dashboardHref}?tab=sourcing&filter=approvals`;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={total ? `You have ${total} notifications` : "Notifications"}
        className="relative px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
      >
        <span className="text-[18px]" aria-hidden>🔔</span>
        {countBadge && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                       rounded-full bg-indigo-600 dark:bg-indigo-500 text-white
                       text-[10px] leading-[18px] text-center font-bold"
            aria-hidden
          >
            {countBadge}
          </span>
        )}
      </button>

      {/* Dropdown — matches the provided UI structure */}
      <div
        ref={menuRef}
        role="menu"
        className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border rounded shadow z-50
                    border-gray-200 dark:border-gray-700 ${open ? "" : "hidden"}`}
      >
        <Link
          href={toBuyer}
          onClick={() => setOpen(false)}
          className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
        >
          <span className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Buyer: Quotes to review
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600">
            {buyer_quotes || 0}
          </span>
        </Link>

        <Link
          href={toAgent}
          onClick={() => setOpen(false)}
          className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Agent: Awaiting buyer approval
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600">
            {agent_approvals || 0}
          </span>
        </Link>

        <Link
          href={dashboardHref}
          onClick={() => setOpen(false)}
          className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Open dashboard
          </span>
          {/* Right-side placeholder to mirror the "check" slot in your sample */}
          <span className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}