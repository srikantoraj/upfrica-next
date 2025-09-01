// src/lib/geo.js
export const CC_ALIAS = { gb: "uk" }; // prefer /uk

export function canonCc(cc) {
  const v = String(cc || "").toLowerCase();
  return v ? (CC_ALIAS[v] || v) : "";
}

export function isTwoLetter(s) {
  return /^[a-z]{2}$/i.test(String(s || ""));
}