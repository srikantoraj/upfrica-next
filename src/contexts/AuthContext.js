// src/contexts/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { deriveRawRoles } from "@/app/utils/roles";

const AuthContext = createContext(null);
const ME_ENDPOINT = "/api/auth/me";
const LOGIN_ENDPOINT = "/api/auth/login";
const LOGOUT_ENDPOINT = "/api/auth/logout";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const hydrate = useCallback(async () => {
    try {
      const res = await fetch(ME_ENDPOINT, { cache: "no-store", credentials: "include" });
      if (!res.ok) throw new Error("unauthorized");
      const data = await res.json();
      const roles = deriveRawRoles(data);
      setUser({ ...data, account_type: roles });
    } catch {
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(
    async (email, password, remember = true) => {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: String(email || "").trim(), password, remember: !!remember }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Login failed");
      }
      await hydrate(); // HttpOnly cookie is set by the route; now load /me
      return data?.onboarding || null;
    },
    [hydrate]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(LOGOUT_ENDPOINT, { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setHydrated(true);
  }, []);

  const refreshUser = useCallback(async () => {
    await hydrate();
    return user;
  }, [hydrate, user]);

  const roles = useMemo(() => user?.account_type || deriveRawRoles(user || {}), [user]);
  const isBuyer = roles.includes("buyer");
  const isSeller = roles.includes("seller") || roles.includes("seller_private") || roles.includes("seller_business");
  const isAgent = roles.includes("agent");
  const isAffiliate = roles.includes("affiliate");

  const onboarding = user?.onboarding || null;
  const requiresOnboarding = onboarding ? !onboarding.complete : (isSeller || isAgent) && !user?.onboarded;

  const fullyReady = hydrated && !!user;

  return (
    <AuthContext.Provider
      value={{
        user, setUser,
        hydrated, fullyReady,
        login, logout, refreshUser,
        isBuyer, isSeller, isAgent, isAffiliate,
        onboarding, requiresOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("❌ useAuth must be used within an <AuthProvider>");
  return ctx;
}