// src/hooks/useEntitlements.js
"use client";
import { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";

const ALIASES = {
  contact_display: "allow_display_seller_contact",
  shop_creation: "allow_shop_creation",
  bnpl: "allow_bnpl",
  storefront_unlock: "storefront_unlock",
  bulk_product_upload: "allow_bulk_product_upload",
};

// Set NEXT_PUBLIC_ENTS_NOCACHE=1 in .env.local if you want to bypass server cache in dev
const NOCACHE = typeof window !== "undefined" && process.env.NEXT_PUBLIC_ENTS_NOCACHE === "1";

export default function useEntitlements() {
  const [active, setActive] = useState(null);      // Set<string> of active flags
  const [states, setStates] = useState(new Map()); // Map<flag, {state, why_locked, source}>
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/users/me/entitlements/?full=1${NOCACHE ? "&nocache=1" : ""}`;
        const { data } = await axiosInstance.get(url);

        // Build "active" set from compact list
        const act = new Set();
        for (const code of data?.entitlements ?? []) {
          act.add(ALIASES[code] || code);
        }

        // Build detailed map from full list
        const map = new Map();
        for (const item of data?.entitlements_full ?? []) {
          const code = item?.feature_code || item?.code || item?.key || item?.name;
          if (!code) continue;
          const flag = ALIASES[code] || code;
          map.set(flag, {
            state: item?.state || (act.has(flag) ? "active" : "available"),
            why_locked: item?.why_locked || "",
            source: item?.source || "",
          });
        }

        // Ensure every "active" flag appears as active in the map (no accidental downgrade)
        for (const flag of act) {
          const existing = map.get(flag);
          if (!existing || existing.state !== "active") {
            map.set(flag, { state: "active", why_locked: "", source: existing?.source || "" });
          }
        }

        if (alive) {
          setActive(act);
          setStates(map);
        }
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load entitlements");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const has = (flag) => !!(flag && active?.has(flag));

  // Never downgrade to "available" if active set says we have it
  const stateOf = (flag) => {
    const st = states.get(flag)?.state;
    if (active?.has(flag) && (!st || st === "available")) return "active";
    return st || (active?.has(flag) ? "active" : "available");
  };

  const whyLocked = (flag) => states.get(flag)?.why_locked || "";

  // Optionally expose a memoized snapshot if a component needs them
  const entitlements = useMemo(() => ({
    active: active ? new Set(active) : new Set(),
    states: new Map(states),
  }), [active, states]);

  return { loading, error, has, stateOf, whyLocked, entitlements };
}