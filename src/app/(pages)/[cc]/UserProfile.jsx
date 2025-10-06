// components/User.jsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/app/store/slices/userSlice";

export default function User() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Try URL first, then localStorage
    const urlToken = params.get("token");
    // const storedToken = typeof window !== "undefined" && localStorage.getItem("token");
    // const token = urlToken || storedToken;
    const token = urlToken;

    if (!token) {
      // nothing to do
      return;
    }

    // If we got a new token in the URL, persist it (and clean up the URL)
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // remove token param from URL without reloading
      const cleaned = new URL(window.location.href);
      cleaned.searchParams.delete("token");
      router.replace(cleaned.pathname + cleaned.search, { scroll: false });
    }

    // Fetch the user's profile
    fetchProfile(token);

    async function fetchProfile(token) {
      try {
        const res = await fetch("https://api.upfrica.com/api/view-profile/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const user = await res.json();
        // dispatch into your slic
        dispatch(setUser({ user, token }));
      } catch (err) {
        console.error(err);
        dispatch(clearUser());
      }
    }
  }, [params, dispatch, router]);

  return null;
}
