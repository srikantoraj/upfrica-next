// src/app/store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from "@/app/utils/storage";

const initialState = {
  user: getFromStorage("user", null),
  token: getFromStorage("token", null),
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload || {};
      state.user = user ?? null;
      state.token = token ?? null;
      saveToStorage("user", state.user);
      saveToStorage("token", state.token);
    },
    // Update only user fields (keep token)
    patchUser(state, action) {
      const patch = action.payload || {};
      state.user = { ...(state.user || {}), ...patch };
      saveToStorage("user", state.user);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      removeFromStorage("user");
      removeFromStorage("token");
    },
  },
});

export const { setUser, patchUser, clearUser } = userSlice.actions;

// Selectors
export const selectAuth = (s) => s.auth;
export const selectCurrentUser = (s) => s.auth?.user || null;
export const selectToken = (s) => s.auth?.token || null;
export const selectIsLoggedIn = (s) => Boolean(s.auth?.token && s.auth?.user);

export default userSlice.reducer;