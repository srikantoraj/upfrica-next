// app/login/page.tsx
"use client";

import React, { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import signinImage from "../../image/signin.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LocalStorageComponent from "@/components/LocalStorageComponent";

const LoginPage = () => {
  const { user, hydrated, refreshUser } = useAuth();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🧪 DEBUG: Show token on initial load
  useEffect(() => {
    if (token) {
      console.log("🧪 Token in localStorage:", token);
    }
  }, [token]);

  // ✅ Automatically refresh user if token exists but no user is loaded yet
  useEffect(() => {
    if (token && !user && hydrated) {
      console.log("🔄 Token found but no user. Attempting to refresh...");
      refreshUser();
    }
  }, [token, user, hydrated, refreshUser]);

  // ✅ Redirect if already logged in and hydrated
  useEffect(() => {
    if (hydrated && user) {
      console.log("✅ Authenticated, redirecting to /new-dashboard...");
      router.push("/new-dashboard"); // 🧭 Destination after login
    }
  }, [hydrated, user, router]);

  // ⏳ Optionally hide page while redirecting
  if (hydrated && user) return null;

  return (
    <div className="max-w-screen-2xl flex justify-center items-center mx-auto lg:p-10 min-h-screen">
      <div className="bg-white container grid lg:grid-cols-2 py-10 lg:px-20 shadow-xl border rounded-md">
        {/* Image Column */}
        <div className="col-span-1 order-2 lg:order-1 flex justify-center items-center p-2 lg:p-4">
          <LocalStorageComponent />
          <Image
            className="h-80 sm:h-full"
            src={signinImage}
            alt="Welcome to Upfrica Login"
            width={500}
            height={500}
            priority
          />

          {token && (
            <div className="text-xs text-green-600 mt-2">
              🔐 Token exists in localStorage
            </div>
          )}
        </div>

        {/* Form Column */}
        <div className="col-span-1 order-1 lg:order-2 lg:p-4">
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                className="h-10 lg:h-14 mx-auto"
                src={logo}
                alt="Upfrica Logo"
                width={140}
                height={56}
                priority
              />
            </div>

            {/* Sign-up link */}
            <p className="text-base">
              Don’t have an account?{" "}
              <Link href="/register">
                <span className="text-purple-500 hover:underline">
                  Sign up here
                </span>
              </Link>
            </p>

            {/* Login Form */}
            <LoginForm />

            {/* Footer */}
            <p className="text-gray-500 text-sm mt-4">
              © {new Date().getFullYear()} Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;