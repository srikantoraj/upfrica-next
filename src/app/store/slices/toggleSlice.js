// store/slices/tokenSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggle: true,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    setToggle(state, action) {
      state.toggle = action.payload;
    },
    clearToggle(state) {
      state.toggle = !state.toggle;
    },
  },
});

export const { setToggle, clearToggle } = toggleSlice.actions;
export default toggleSlice.reducer;
