// src/components/auth/AuthCookieBridge.jsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCookieBridge() {
  const { token } = useAuth();

  useEffect(() => {
    // write or clear the cookie so the proxy can mint Authorization
    const secure = typeof window !== "undefined" && window.location.protocol === "https:";
    if (token) {
      document.cookie = [
        `up_auth=${encodeURIComponent(token)}`,
        "Path=/",
        "SameSite=Lax",
        secure ? "Secure" : "",   // ok to omit on localhost
        // session cookie; add `Max-Age=2592000` if you want 30 days
      ].filter(Boolean).join("; ");
    } else {
      // clear on logout
      document.cookie = `up_auth=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  }, [token]);

  return null;
}