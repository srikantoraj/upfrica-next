// src/contexts/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  getFromStorage as getItem,
  saveToStorage as setItem,
  removeFromStorage as removeItem,
} from "@/app/utils/storage";
import { deriveRawRoles } from "@/app/utils/roles";

const AuthContext = createContext();
const ME_ENDPOINT = "/api/users/me/";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("[Auth] useEffect: starting hydration");

    const savedToken = getItem("token");
    const savedUser = getItem("user");

    console.log("[Auth] Saved token:", savedToken);
    console.log("[Auth] Saved user from storage:", savedUser);

    if (savedToken) {
      setToken(savedToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Token ${savedToken}`;
    }
    if (savedUser) setUser(savedUser);

    const hydrate = async () => {
      if (savedToken) {
        try {
          console.log("[Auth] Fetching /me...");
          const res = await axiosInstance.get(ME_ENDPOINT, { cache: "no-store" });

          console.log("[Auth] /me payload keys:", Object.keys(res.data || {}));
          console.log("[Auth] /me payload:", res.data);

          // ✅ Inject derived roles as account_type if missing
          const roles = deriveRawRoles(res.data);
          const userWithRoles = {
            ...res.data,
            account_type: roles, // make sure downstream consumers see it
          };
          console.log("[Auth] derived roles:", roles);

          setUser(userWithRoles);
          setItem("user", userWithRoles);
        } catch (err) {
          console.error("❌ Failed to hydrate user:", err);
          logout();
        }
      } else {
        console.log("[Auth] No token found, skipping /me request");
      }
      setHydrated(true);
      console.log("[Auth] Hydration complete");
    };

    hydrate();
  }, []);

  const logout = () => {
    console.log("[Auth] Logging out...");
    setUser(null);
    setToken(null);
    removeItem("user");
    removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    console.log("[Auth] Logout complete, storage cleared");
  };

  const login = async (loginPayload) => {
    console.log("[Auth] Login called with payload:", loginPayload);

    const authToken = loginPayload?.token;
    if (!authToken) throw new Error("Missing token");

    setToken(authToken);
    setItem("token", authToken);
    axiosInstance.defaults.headers.common["Authorization"] = `Token ${authToken}`;

    try {
      console.log("[Auth] Fetching /me after login...");
      const res = await axiosInstance.get(ME_ENDPOINT, { cache: "no-store" });

      console.log("[Auth] /me payload keys (after login):", Object.keys(res.data || {}));
      console.log("[Auth] /me payload (after login):", res.data);

      const roles = deriveRawRoles(res.data);
      const userWithRoles = { ...res.data, account_type: roles };
      console.log("[Auth] derived roles (after login):", roles);

      setUser(userWithRoles);
      setItem("user", userWithRoles);
      setHydrated(true);
      return res.data?.onboarding || loginPayload?.onboarding || null;
    } catch (err) {
      console.error("❌ Failed to fetch user after login:", err);
      const fallbackRaw = {
        ...(loginPayload?.user || {}),
        onboarding: loginPayload?.onboarding || null,
      };
      const roles = deriveRawRoles(fallbackRaw);
      const fallback = { ...fallbackRaw, account_type: roles };
      console.log("[Auth] Using fallback user after login error:", fallback);

      setUser(fallback);
      setItem("user", fallback);
      setHydrated(true);
      return fallback.onboarding;
    }
  };

  const refreshUser = async () => {
    const authToken = token || getItem("token");
    console.log("[Auth] Refreshing user, token:", authToken);
    if (!authToken) return;
    try {
      axiosInstance.defaults.headers.common["Authorization"] = `Token ${authToken}`;
      const res = await axiosInstance.get(ME_ENDPOINT, { cache: "no-store" });

      console.log("[Auth] /me payload keys (refresh):", Object.keys(res.data || {}));
      console.log("[Auth] /me payload (refresh):", res.data);

      const roles = deriveRawRoles(res.data);
      const userWithRoles = { ...res.data, account_type: roles };
      console.log("[Auth] derived roles (refresh):", roles);

      setUser(userWithRoles);
      setItem("user", userWithRoles);
      return userWithRoles;
    } catch (err) {
      console.error("❌ Failed to refresh user:", err);
    }
  };

  const fullyReady = hydrated && !!token && !!user;

  // From now on, roles are always present on user.account_type
  const roles = user?.account_type || [];
  const isBuyer = roles.includes("buyer");
  const isSeller = roles.includes("seller") || roles.includes("seller_private") || roles.includes("seller_business");
  const isAgent = roles.includes("agent");
  const isAffiliate = roles.includes("affiliate");

  const onboarding = user?.onboarding || null;
  const requiresOnboarding = onboarding
    ? !onboarding.complete
    : (isSeller || isAgent) && !user?.onboarded;

  return (
    <AuthContext.Provider
      value={{
        user, setUser,
        token, setToken,
        hydrated, fullyReady,
        login, logout, refreshUser,
        // roles
        isBuyer, isSeller, isAgent, isAffiliate,
        // onboarding
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