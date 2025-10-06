// components/LocaleRedirect/LocaleRedirect.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.upfrica.com/api/user-country/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { country_code } = await res.json();
        if (country_code) {
          const target = `/${country_code.toLowerCase()}`;
          if (router.asPath !== target) {
            router.replace(target);
          }
        }
      } catch {
        // silently fail—user can still browse /
      }
    })();
  }, [router]);

  return null;
}
