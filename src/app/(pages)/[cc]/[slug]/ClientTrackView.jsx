//app/(pages)/[cc]/[slug]/ClientTrackView.jsx  Client “view” tracker (co-located with PDP route)
"use client";

import { useEffect } from "react";

/**
 * Pings a lightweight API to increment counters (view, basket add, etc.)
 * De-dupes one view per session per product.
 */
export default function ClientTrackView({ productId, slug }) {
  useEffect(() => {
    if (!productId && !slug) return;
    const sidKey = "upfrica_sid";
    const getSid = () => {
      try {
        let id = localStorage.getItem(sidKey);
        if (!id) {
          id = Math.random().toString(36).slice(2) + Date.now().toString(36);
          localStorage.setItem(sidKey, id);
        }
        return id;
      } catch {
        return "";
      }
    };
    const onceKey = `pdp_viewed:${productId || slug}`;
    try {
      if (sessionStorage.getItem(onceKey) === "1") return;
      sessionStorage.setItem(onceKey, "1");
    } catch {}

    const payload = JSON.stringify({
      type: "view",
      productId,
      slug,
      sessionId: getSid(),
      ua: navigator.userAgent,
    });

    const url = "/api/pdp-signal";
    try {
      if ("sendBeacon" in navigator) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }, [productId, slug]);

  return null;
}