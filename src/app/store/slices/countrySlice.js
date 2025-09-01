import { createSlice } from "@reduxjs/toolkit";

const countries = [
  { name: "Ghana", code: "GHS", symbol: "₵", region: "gh" },
  { name: "United States", code: "USD", symbol: "$", region: "us" },
  { name: "United Kingdom", code: "GBP", symbol: "£", region: "uk" },
  { name: "Nigeria", code: "NGN", symbol: "₦", region: "ng" },
  { name: "Kenya", code: "KES", symbol: "KSh", region: "ke" },
  { name: "South Africa", code: "ZAR", symbol: "R", region: "za" },
  { name: "Eurozone", code: "EUR", symbol: "€", region: "eu" },
  { name: "China", code: "CNY", symbol: "¥", region: "cn" },
  { name: "Bangladesh", code: "BDT", symbol: "৳", region: "bd" },
];

const initialState = {
  list: countries,
  // ← default to the first entry (Ghana)
  selected: countries[0],
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountry(state, action) {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedCountry } = countrySlice.actions;
export const selectCountryList = (state) => state.country.list;
export const selectSelectedCountry = (state) => state.country.selected;
export default countrySlice.reducer;
