// /app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import exchangeRatesReducer from './slices/exchangeRatesSlice';

export const store = configureStore({
    reducer: {
        exchangeRates: exchangeRatesReducer,
    },
});
