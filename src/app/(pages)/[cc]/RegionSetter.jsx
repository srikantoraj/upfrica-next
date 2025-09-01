// app/(pages)/[cc]/RegionSetter.jsx
"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCountryList,
  setSelectedCountry,
} from "@/app/store/slices/countrySlice";

const ALIAS = { gb: "uk" }; // canonicalize GB → uk

export default function RegionSetter({ cc }) {
  const dispatch = useDispatch();
  const countryList = useSelector(selectCountryList);

  // Normalize/alias incoming cc prop
  const normCc = useMemo(() => {
    const v = String(cc || "").toLowerCase();
    return ALIAS[v] || v || "gh";
  }, [cc]);

  useEffect(() => {
    if (!Array.isArray(countryList) || countryList.length === 0) return;

    // try cc match (fallback to first in list)
    const target =
      countryList.find(
        (c) => String(c.cc || c.code || "").toLowerCase() === normCc
      ) || countryList[0];

    dispatch(setSelectedCountry(target));

    // persist for 1 year so middleware & global pages know the country
    try {
      document.cookie = `cc=${normCc}; path=/; max-age=31536000; samesite=lax`;
      // legacy cookie for any old code still reading "r"
      document.cookie = `r=${normCc}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }

    // optional: expose to DOM for styling/analytics
    try {
      document.documentElement.setAttribute("data-cc", normCc);
    } catch {
      /* ignore */
    }
  }, [normCc, countryList, dispatch]);

  return null;
}