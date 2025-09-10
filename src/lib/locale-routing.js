// src/lib/locale-routing.js
function normalizeCc(cc, fallback = "gh") {
  let code = (cc ?? "").toString().trim().slice(0, 2).toLowerCase();

  // If invalid, try to read /{cc}/ from the current path (client only)
  if (!/^[a-z]{2}$/.test(code) && typeof window !== "undefined") {
    const m = window.location.pathname.match(/^\/([a-z]{2})(?=\/)/i);
    if (m && m[1]) code = m[1].toLowerCase();
  }

  return /^[a-z]{2}$/.test(code) ? code : fallback.toLowerCase();
}

/**
 * Prefix an href with /{cc}. Accepts href with or without leading slash,
 * and strips any existing leading /{xx}/ country segment before reappending.
 *
 * Examples:
 *  withCountryPrefix('gh', '/electronics/cameras') -> '/gh/electronics/cameras'
 *  withCountryPrefix(undefined, '/ng/phones')      -> '/ng/phones' (uses URL cc or fallback)
 */
export function withCountryPrefix(cc, href = "/") {
  const cleanHref = `/${String(href || "/").replace(/^\/+/, "")}`; // ensure single leading slash
  // remove an existing country segment at the start of href
  const stripped = cleanHref.replace(/^\/[a-z]{2}(?=\/)/i, "");
  const code = normalizeCc(cc, "gh");
  return `/${code}${stripped}`;
}