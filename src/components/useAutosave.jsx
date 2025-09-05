"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

export default function useAutosave({ url, method = "PATCH", delay = 600 }) {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const pendingRef = useRef(null); // last payload

  const flush = useCallback(async () => {
    if (!pendingRef.current) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${BASE_API_URL}${url}`, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify(pendingRef.current),
      });
      if (!res.ok) {
        let detail = "";
        try { detail = JSON.stringify(await res.json()); }
        catch { try { detail = await res.text(); } catch {} }
        throw new Error(`${method} ${url} → ${res.status} ${detail}`);
      }
      setLastSavedAt(Date.now());
      pendingRef.current = null;
    } catch (e) {
      setError(e.message || "Autosave failed");
    } finally {
      setSaving(false);
    }
  }, [url, method]);

  const save = useCallback((payload) => {
    pendingRef.current = { ...(pendingRef.current || {}), ...(payload || {}) };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, delay);
  }, [delay, flush]);

  // ensure final flush on unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { save, flush, saving, lastSavedAt, error };
}