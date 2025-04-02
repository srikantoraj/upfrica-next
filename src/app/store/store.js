// /app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import exchangeRatesReducer from './slices/exchangeRatesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        exchangeRates: exchangeRatesReducer,
        user: userReducer,
    },
});
