// src/components/auth/LoginForm.jsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import PasswordInput from "@/components/ui/PasswordInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/slices/userSlice";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

const DRAFT_KEY = "sourcing_draft_v1";

function sanitizeNext(n) {
  if (!n || typeof n !== "string") return "";
  try {
    const val = decodeURIComponent(n);
    return val.startsWith("/") && !val.startsWith("//") ? val : "";
  } catch {
    return "";
  }
}

function ensureResume(next, hasDraft) {
  if (!next) return "";
  try {
    const url = new URL(next, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (hasDraft && url.pathname.includes("/sourcing") && !url.searchParams.has("resume")) {
      url.searchParams.set("resume", "1");
    }
    return url.pathname + (url.search || "");
  } catch {
    return next;
  }
}

function defaultNextFromDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return "";
    const d = JSON.parse(raw);
    const cc = String(d?.cc || "gh").toLowerCase();
    return `/${cc}/sourcing?resume=1`;
  } catch {
    return "";
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { login } = useAuth();

  useEffect(() => {
    console.log("🟣 LoginForm mounted (cookie-first auth)");
  }, []);

  const nextRaw = searchParams.get("next");
  const nextSafe = sanitizeNext(nextRaw);
  const hasDraft = useMemo(() => {
    try {
      return !!sessionStorage.getItem(DRAFT_KEY);
    } catch {
      return false;
    }
  }, []);
  const draftNext = useMemo(defaultNextFromDraft, []);

  // Social login (preserve next + resume)
  const googleHref = useMemo(() => {
    const base =
      process.env.NODE_ENV === "production"
        ? "https://api.upfrica.com/accounts/google/login/?process=login"
        : "http://127.0.0.1:8000/accounts/google/login/?process=login";
    const n = ensureResume(nextSafe || draftNext, hasDraft);
    return n ? `${base}&next=${encodeURIComponent(n)}` : base;
  }, [nextSafe, draftNext, hasDraft]);

  const formik = useFormik({
    initialValues: { email: "", password: "", rememberMe: true },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email.trim(), values.password, !!values.rememberMe);

        const meRes = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        const me = meRes.ok ? await meRes.json() : null;
        if (me) dispatch(setUser({ user: me, token: null }));

        const hasAccountType = Array.isArray(me?.account_type) && me.account_type.length > 0;

        let target = "/new-dashboard";
        if (!hasAccountType) target = "/onboarding/account-type";

        // Prefer `next`, otherwise fall back to draft resume
        if (nextSafe) target = ensureResume(nextSafe, hasDraft) || target;
        else if (hasDraft && draftNext) target = draftNext;

        router.replace(target);
      } catch (err) {
        console.error("❌ Login error:", err);
        setErrors({ email: err?.message || "Login failed. Please try again." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-4 rounded-lg shadow">
        <h2 className="text-center text-xl font-extrabold text-gray-900">Sign in to your account</h2>

        <div className="mt-4 flex space-x-4">
          <a href={googleHref} className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
            <FcGoogle className="text-2xl" />
            <span className="ml-2 text-gray-700 font-medium">Google</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaFacebookF className="text-2xl text-blue-600" />
            <span className="ml-2 text-gray-700 font-medium">Facebook</span>
          </a>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="px-2 bg-white text-gray-500 text-sm">or continue with</span></div>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email address</label>
            <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
            {formik.errors.email && <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>}
          </div>

          <div>
            <PasswordInput id="password" name="password" value={formik.values.password} onChange={formik.handleChange} placeholder="Enter your password" />
            {formik.errors.password && <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" name="rememberMe" checked={formik.values.rememberMe} onChange={formik.handleChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span className="ml-2">Remember me</span>
            </label>
            <Link href="/password/new" className="text-sm text-purple-600 hover:underline">Forgot password?</Link>
          </div>

          <div>
            <button type="submit" disabled={formik.isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60">
              {formik.isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : ("Log In")}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button className="text-sm text-gray-500 hover:underline">Need help?</button>
        </div>
      </div>
    </div>
  );
}