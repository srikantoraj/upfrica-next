import { createSlice } from '@reduxjs/toolkit';

// Helper to load basket items from localStorage if available
const loadBasketFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const basket = localStorage.getItem('basket');
    return basket ? JSON.parse(basket) : [];
  }
  return [];
};

const initialState = {
  items: loadBasketFromLocalStorage(),
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.items = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('basket', JSON.stringify(state.items));
      }
    },
    addToBasket: (state, action) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('basket', JSON.stringify(state.items));
      }
    },
    removeFromBasket: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('basket', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('basket', JSON.stringify(state.items));
      }
    },
  },
});

export const {
  setBasket,
  addToBasket,
  removeFromBasket,
  updateQuantity,
} = basketSlice.actions;

export default basketSlice.reducer;
