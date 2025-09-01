//src/components/Guard.jsx
"use client";
import React from "react";

/** Simple guard. Show children if `allow`, otherwise `onBlocked()` and show `fallback`. */
export default function Guard({ allow, onBlocked, fallback = null, children }) {
  if (allow) return children;
  if (onBlocked) onBlocked();
  return fallback;
}