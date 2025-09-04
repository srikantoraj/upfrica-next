//src/components/common/LangDomSync.jsx:
"use client";
import { useEffect } from "react";
import { useLocalization } from "@/contexts/LocalizationProvider";

export default function LangDomSync() {
  const { resolvedLanguage } = useLocalization();

  useEffect(() => {
    try {
      document.documentElement.lang = resolvedLanguage || "en";
      // Optional RTL support later:
      // document.documentElement.dir = /^ar|he|fa/.test(resolvedLanguage) ? "rtl" : "ltr";
    } catch {}
  }, [resolvedLanguage]);

  return null;
}