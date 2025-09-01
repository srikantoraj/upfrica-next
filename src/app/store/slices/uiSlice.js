// src/app/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    basketSheetOpen: false,
  },
  reducers: {
    openBasketSheet(state) { state.basketSheetOpen = true; },
    closeBasketSheet(state) { state.basketSheetOpen = false; },
    toggleBasketSheet(state) { state.basketSheetOpen = !state.basketSheetOpen; },
  },
});

export const { openBasketSheet, closeBasketSheet, toggleBasketSheet } = uiSlice.actions;
export const selectBasketSheetOpen = (s) => s.ui.basketSheetOpen;
export default uiSlice.reducer;