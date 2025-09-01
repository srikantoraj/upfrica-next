// src/lib/cc.js
export const isoToCc = (iso) => (String(iso).toLowerCase() === "gb" ? "uk" : String(iso).toLowerCase());
export const ccToISO = (cc) => (String(cc).toLowerCase() === "uk" ? "GB" : String(cc).toUpperCase());
export const isTwoLetter = (s) => /^[a-z]{2}$/i.test(s);