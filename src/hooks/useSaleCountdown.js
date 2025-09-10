'use client'; // keep if you’re on Next.js App Router; otherwise remove
import * as React from 'react';

// Call with ISO strings (or null)
export function useSaleCountdown(startISO, endISO) {
  const startMs = Number.isFinite(Date.parse(startISO || '')) ? Date.parse(startISO) : null;
  const endMs   = Number.isFinite(Date.parse(endISO   || '')) ? Date.parse(endISO)   : null;

  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = (startMs && endMs) ? (endMs - startMs) : null;
  const left  = endMs ? Math.max(0, endMs - now) : 0;

  const progressPct = total ? ((now - startMs) / total) * 100 : 0;

  const days    = Math.floor(left / 86400000);
  const hours   = Math.floor((left % 86400000) / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  const urgency =
    left <= 5 * 60 * 1000      ? 'critical' :
    left <= 60 * 60 * 1000     ? 'high'     :
    left <= 24 * 60 * 60 * 1000? 'medium'   : 'low';

  return {
    timeRemaining: { days, hours, minutes, seconds },
    progressPct,
    urgency,
  };
}