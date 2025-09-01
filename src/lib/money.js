// src/lib/money.js
export function ccToCurrency(cc) {
  switch (String(cc || "").toLowerCase()) {
    case "gh": return "GHS";
    case "ng": return "NGN";
    case "uk": return "GBP";
    case "id": return "IDR";
    case "in": return "INR";
    default:   return "USD";
  }
}

export function localeFromCc(cc) {
  // simple default; tweak if you want en-GB for UK, etc.
  switch (String(cc || "").toLowerCase()) {
    case "uk": return "en-GB";
    case "ng": return "en-NG";
    case "gh": return "en-GH";
    case "id": return "id-ID";
    case "in": return "en-IN";
    default:   return "en";
  }
}

export function formatMoney(amount, currency, locale = "en") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  } catch {
    // fallback
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}