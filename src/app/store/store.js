// /app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import exchangeRatesReducer from './slices/exchangeRatesSlice';
import basketReducer from './slices/cartSlice';
import userReducer from './slices/userSlice'

export const store = configureStore({
    reducer: {
        basket: basketReducer,
        exchangeRates: exchangeRatesReducer,
        auth: userReducer,

    },
});
