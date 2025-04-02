// // store/basketSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = []

// const basketSlice = createSlice({
//   name: 'basket',
//   initialState,
//   reducers: {
//     addToBasket: (state, action) => {
//       const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
//       if (existingIndex >= 0) {
//         state.items[existingIndex].quantity += 1;
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//       localStorage.setItem('basket', JSON.stringify(state.items));
//     },
//     removeFromBasket: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//       localStorage.setItem('basket', JSON.stringify(state.items));
//     },
//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.items.find(i => i.id === id);
//       if (item) {
//         item.quantity = quantity;
//         localStorage.setItem('basket', JSON.stringify(state.items));
//       }
//     },
//     clearBasket: (state) => {
//       state.items = [];
//       localStorage.removeItem('basket');
//     }
//   }
// });

// export const { addToBasket, removeFromBasket, updateQuantity, clearBasket } = basketSlice.actions;
// export default basketSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.items = action.payload;
    },
    addToBasket: (state, action) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('basket', JSON.stringify(state.items));
    },
    removeFromBasket: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('basket', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('basket', JSON.stringify(state.items));
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

