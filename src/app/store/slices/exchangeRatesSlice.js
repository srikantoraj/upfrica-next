// /app/store/slices/exchangeRatesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialRates = () => {
  if (typeof window !== "undefined") {
    const savedRates = localStorage.getItem("exchangeRates");
    return savedRates ? JSON.parse(savedRates) : [];
  }
  return [];
};

const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState: {
    rates: getInitialRates(),
  },
  reducers: {
    setExchangeRates: (state, action) => {
      state.rates = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("exchangeRates", JSON.stringify(state.rates));
      }
    },
  },
});

export const { setExchangeRates } = exchangeRatesSlice.actions;
export default exchangeRatesSlice.reducer;
