// src/lib/socialLoginUrl.js
export function buildSocialUrl(provider = "google", opts = {}) {
  const isBrowser = typeof window !== "undefined";
  const onLocalhost =
    isBrowser &&
    (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));

  // Prefer explicit env var if you set it; otherwise pick by host.
  const AUTH_ORIGIN =
    process.env.NEXT_PUBLIC_AUTH_BASE_URL ||
    (onLocalhost ? "http://127.0.0.1:8000" : "https://media.upfrica.com");

  // After Allauth completes, we send users to your SSO bridge
  // (set in Django: LOGIN_REDIRECT_URL = "/sso/complete/").
  const next = opts.next || "/sso/complete/";

  const qs = new URLSearchParams({
    process: "login",
    next, // lets you override if needed
  }).toString();

  return `${AUTH_ORIGIN}/accounts/${provider}/login/?${qs}`;
}