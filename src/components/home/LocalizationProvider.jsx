// components/home/LocalizationProvider.jsx
"use client";

import React, { createContext, useContext, useMemo } from "react";

const Ctx = createContext({
  format: (amount, ccy = "USD") =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(amount ?? 0),
  price: (amount, fromCcy) => amount, // stub: add FX conversion if you have rates
});

export function LocalizationProvider({ children, fx = null }) {
  const value = useMemo(() => {
    const format = (amount, ccy = "USD") =>
      new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(amount ?? 0);
    const price = (amount /*, fromCcy */) => amount;
    return { format, price, ...(fx || {}) };
  }, [fx]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocalization() {
  return useContext(Ctx);
}