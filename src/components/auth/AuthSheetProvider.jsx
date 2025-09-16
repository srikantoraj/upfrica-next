// src/components/auth/AuthSheetProvider.jsx
"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Ctx = createContext(null);

export function AuthSheetProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [next, setNext] = useState("");
  const [reason, setReason] = useState("");

  const openAuth = useCallback(({ mode = "login", next = "", reason = "" } = {}) => {
    setMode(mode);
    setNext(next);
    setReason(reason);
    setOpen(true);
  }, []);
  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ open, mode, next, reason, openAuth, closeAuth, setMode }}>
      {children}
      <AuthSheet />
    </Ctx.Provider>
  );
}

export function useAuthSheet() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuthSheet must be used within <AuthSheetProvider>");
  return v;
}

/* --------------------------- Bottom Sheet UI --------------------------- */
function AuthSheet() {
  const { open, mode, setMode, next, reason, closeAuth } = useAuthSheet();
  const { login, refreshUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [signupOk, setSignupOk] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const OAUTH = `${BASE}/accounts`;

  const onLogin = async (e) => {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email");
    const password = fd.get("password");
    const remember = fd.get("remember") === "on";
    try {
      setLoading(true);
      await login(email, password, remember); // uses your /api/auth/login proxy
      await refreshUser?.();
      closeAuth();
      if (next) router.push(next);
    } catch (ex) {
      setErr(ex?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: fd.get("email"),
      first_name: fd.get("first_name") || "",
      last_name: fd.get("last_name") || "",
      username: fd.get("username") || "",
      password: fd.get("password"),
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    };
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.message || "Signup failed");
      // If backend sent token → cookie is set by our route; otherwise ask to verify email.
      if (data?.authed) {
        await refreshUser?.();
        closeAuth();
        if (next) router.push(next);
      } else {
        setSignupOk(true);
      }
    } catch (ex) {
      setErr(ex?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // accessibility: don’t render when closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={closeAuth}
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 w-full sm:max-w-lg sm:mx-auto rounded-t-2xl bg-white dark:bg-neutral-900 shadow-2xl border-t border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        {/* Grab handle */}
        <div className="flex items-center justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <button
                onClick={() => setMode("login")}
                className={`px-4 py-1.5 text-sm font-semibold ${
                  mode === "login"
                    ? "bg-purple-600 text-white"
                    : "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`px-4 py-1.5 text-sm font-semibold ${
                  mode === "signup"
                    ? "bg-purple-600 text-white"
                    : "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                Sign up
              </button>
            </div>

            <button
              onClick={closeAuth}
              className="px-3 py-1.5 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              ✕
            </button>
          </div>

          {reason ? (
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              {reason}
            </p>
          ) : null}
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 pb-24 overflow-y-auto">
          {/* Social */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`${OAUTH}/google/login/`}
              className="inline-flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-md h-10 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span>🔵</span><span className="text-sm">Google</span>
            </a>
            <a
              href={`${OAUTH}/facebook/login/`}
              className="inline-flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-md h-10 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span>📘</span><span className="text-sm">Facebook</span>
            </a>
          </div>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3 text-[11px] text-neutral-500">
            <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span>or continue with email</span>
            <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Forms */}
          {mode === "login" ? (
            <form onSubmit={onLogin} className="space-y-3">
              <label className="block">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Email</span>
                <input
                  name="email" type="email" required
                  className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Password</span>
                <input
                  name="password" type="password" required
                  className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="remember" defaultChecked />
                Keep me signed in
              </label>

              {err && (
                <div className="text-sm text-rose-600 dark:text-rose-400">{err}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60"
              >
                {loading ? "Logging in…" : "Log in"}
              </button>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-purple-600 dark:text-purple-400 font-semibold"
                >
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            <div>
              {!signupOk ? (
                <form onSubmit={onSignup} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">First name</span>
                      <input name="first_name" className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 focus:ring-2 focus:ring-purple-500" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">Last name</span>
                      <input name="last_name" className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 focus:ring-2 focus:ring-purple-500" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Username</span>
                    <input name="username" required className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 focus:ring-2 focus:ring-purple-500" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Email</span>
                    <input name="email" type="email" required className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 focus:ring-2 focus:ring-purple-500" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Password</span>
                    <input name="password" type="password" required className="mt-1 w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 focus:ring-2 focus:ring-purple-500" />
                  </label>

                  {err && (
                    <div className="text-sm text-rose-600 dark:text-rose-400">{err}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60"
                  >
                    {loading ? "Creating account…" : "Create account"}
                  </button>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-purple-600 dark:text-purple-400 font-semibold"
                    >
                      Log in
                    </button>
                  </p>
                </form>
              ) : (
                <div className="text-sm text-neutral-700 dark:text-neutral-200 space-y-3">
                  <p className="font-semibold">Check your email to verify your account</p>
                  <p>
                    We’ve sent a verification link. After verifying, come back and continue.
                  </p>
                  <button
                    onClick={closeAuth}
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}