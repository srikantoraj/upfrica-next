// store/slices/tokenSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = null;
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
