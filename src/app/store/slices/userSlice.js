// src/app/store/slices/userSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from '@/app/utils/storage';

const initialState = {
  user: getFromStorage('user', null),
  token: getFromStorage('token', null),
  items: getFromStorage('basket', []),
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      saveToStorage('user', user);
      saveToStorage('token', token);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      removeFromStorage('user');
      removeFromStorage('token');
    },

    // Basket logic
    addToBasket(state, action) {
      const item = action.payload;
      const exists = state.items.some((i) => i.id === item.id);
      if (!exists) {
        state.items.push(item);
        saveToStorage('basket', state.items);
      }
    },
    removeFromBasket(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToStorage('basket', state.items);
    },
    clearBasket(state) {
      state.items = [];
      removeFromStorage('basket');
    },
  },
});

export const {
  setUser,
  clearUser,
  addToBasket,
  removeFromBasket,
  clearBasket,
} = userSlice.actions;

export default userSlice.reducer;