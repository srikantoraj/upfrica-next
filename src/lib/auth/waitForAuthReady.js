// src/lib/auth/waitForAuthReady.js
export function hasCookie(name = "up_auth") {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some(c => c.trim().startsWith(`${name}=`));
}

export async function waitForAuthReady({ timeout = 2000, interval = 100, cookie = "up_auth" } = {}) {
  if (typeof window === "undefined") return true; // SSR: nothing to wait for
  const start = Date.now();
  if (hasCookie(cookie)) return true;
  while (Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, interval));
    if (hasCookie(cookie)) return true;
  }
  return false; // timed out – caller can still try (and handle 401/403)
}