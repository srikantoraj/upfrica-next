// app/(pages)/login/page.jsx  (rename from .tsx if you use JSX)
"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/public/images/logo.png";
import signinImage from "../../image/signin.svg";

// Render LoginForm only on the client to avoid SSR/CSR mismatches
const LoginForm = dynamic(() => import("@/components/auth/LoginForm"), {
  ssr: false,
});

export default function LoginPage() {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If already authenticated, redirect away from the login screen
  useEffect(() => {
    if (hydrated && user) {
      const next = searchParams.get("next");
      router.replace(next || "/new-dashboard");
    }
  }, [hydrated, user, router, searchParams]);

  // Hide the page while redirecting to prevent flash
  if (hydrated && user) return null;

  return (
    <main
      className="max-w-screen-2xl flex justify-center items-center mx-auto lg:p-10 min-h-screen"
      suppressHydrationWarning
    >
      <div className="bg-white container grid lg:grid-cols-2 py-10 lg:px-20 shadow-xl border rounded-md">
        {/* Illustration */}
        <div className="col-span-1 order-2 lg:order-1 flex justify-center items-center p-2 lg:p-4">
          <Image
            className="h-80 sm:h-full"
            src={signinImage}
            alt="Welcome to Upfrica Login"
            width={500}
            height={500}
            priority
          />
        </div>

        {/* Form */}
        <div className="col-span-1 order-1 lg:order-2 lg:p-4">
          <div className="text-center space-y-4">
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

            <p className="text-base">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-purple-500 hover:underline">
                Sign up here
              </Link>
            </p>

            <LoginForm />

            <p className="text-gray-500 text-sm mt-4">
              © {new Date().getFullYear()} Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}