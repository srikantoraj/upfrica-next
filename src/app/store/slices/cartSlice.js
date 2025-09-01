// src/app/store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "basket";

const read = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const initialState = {
  items: read(),
};

const cartSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      write(state.items);
    },

    // Replaces quantity (not +=) if the item exists; otherwise pushes new
    addToBasket(state, action) {
      const payload = action.payload || {};
      const qty = Math.max(1, Number(payload.quantity ?? 1));
      const idx = state.items.findIndex(
        (i) => i.id === payload.id && i.sku === payload.sku
      );

      if (idx !== -1) {
        // keep existing fields, refresh with latest payload, set quantity
        state.items[idx] = { ...state.items[idx], ...payload, quantity: qty };
      } else {
        state.items.push({ ...payload, quantity: qty });
      }
      write(state.items);
    },

    updateQuantity(state, action) {
      const { id, sku, quantity } = action.payload || {};
      const idx = state.items.findIndex((i) => i.id === id && i.sku === sku);
      if (idx === -1) return;

      const q = Number(quantity);
      if (!Number.isFinite(q) || q <= 0) {
        // treat <= 0 as remove
        state.items.splice(idx, 1);
      } else {
        state.items[idx].quantity = q;
      }
      write(state.items);
    },

    removeFromBasket(state, action) {
      // Accept either { id, sku } or just id (legacy)
      const payload = action.payload;
      if (payload && typeof payload === "object") {
        const { id, sku } = payload;
        state.items = state.items.filter(
          (i) => !(i.id === id && (sku ? i.sku === sku : true))
        );
      } else {
        const id = payload;
        state.items = state.items.filter((i) => i.id !== id);
      }
      write(state.items);
    },

    clearBasket(state) {
      state.items = [];
      write(state.items);
    },
  },
});

export const {
  setBasket,
  addToBasket,
  updateQuantity,
  removeFromBasket,
  clearBasket,
} = cartSlice.actions;

// ---- Selectors -------------------------------------------------------------
export const selectBasketItems = (s) => s.basket.items;
export const selectBasketCount = (s) =>
  s.basket.items.reduce((n, i) => n + (i.quantity || 0), 0);

// If each item stores a per-unit price in cents (e.g., price_cents), this works:
export const selectBasketSubtotalCents = (s) =>
  s.basket.items.reduce(
    (sum, i) => sum + (i.price_cents || 0) * (i.quantity || 1),
    0
  );

export default cartSlice.reducer;