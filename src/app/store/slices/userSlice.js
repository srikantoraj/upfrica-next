

// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial data from localStorage (only if window is defined)
const initialUser =
    typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : null;
const initialToken =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const initialState = {
    user: initialUser,
    token: initialToken,
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            // Persist data to localStorage (client-side only)
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
            }
        },
        clearUser(state) {
            state.user = null;
            state.token = null;
            // Remove data from localStorage (client-side only)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
