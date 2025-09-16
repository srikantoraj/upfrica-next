// src/lib/notifications.js
import useSWR from "swr";

export const NOTIF_URL =
  process.env.NEXT_PUBLIC_NOTIF_SUMMARY_URL ||
  "/api/sourcing/me/notifications/summary/";

const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  // Not signed in or endpoint hidden: treat as zero notifications.
  if (res.status === 401 || res.status === 403 || res.status === 404) return {};

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Notifications fetch failed: ${res.status} ${text}`);
  }
  // Be defensive against empty bodies
  try {
    return await res.json();
  } catch {
    return {};
  }
};

function normalizeSummary(raw) {
  if (!raw || typeof raw !== "object")
    return { buyer_quotes: 0, agent_approvals: 0, total: 0, hrefs: {} };

  const buyer_quotes = Number(raw.buyer_quotes ?? raw.sourcing_buyer_quotes ?? 0) || 0;
  const agent_approvals =
    Number(raw.agent_approvals ?? raw.sourcing_agent_approvals ?? 0) || 0;
  const total = Number(raw.total ?? buyer_quotes + agent_approvals) || 0;
  const hrefs = raw.hrefs || {};

  return { buyer_quotes, agent_approvals, total, hrefs };
}

export function useNotifSummary(opts = {}) {
  const { url = NOTIF_URL, enabled = true } = opts;

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? url : null, // allow caller to disable (e.g., before auth hydrates)
    fetcher,
    {
      refreshInterval: 30_000, // poll every 30s
      dedupeInterval: 15_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        // Retry up to 3x on 5xx/Network; don't retry on 4xx
        if (/Notifications fetch failed: (\d{3})/.test(err.message)) {
          const code = Number(err.message.match(/(\d{3})$/)?.[1]);
          if (code && code < 500) return;
        }
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), Math.min(60_000, 2_000 * (retryCount + 1)));
      },
    }
  );

  return {
    summary: normalizeSummary(data),
    error,
    isLoading,
    mutate,
  };
}