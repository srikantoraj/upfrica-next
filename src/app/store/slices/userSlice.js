// // userSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     token: null,
//     user: null,
// };

// const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         setUser(state, action) {
//             // state.token = action.payload.token;
//             state.user = action.payload.user;
//         },
//         clearUser(state) {
//             // state.token = null;
//             state.user = null;
//         },
//     },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;


// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            }
        },
        clearUser(state) {
            state.user = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
            }
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

