// /app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import exchangeRatesReducer from './slices/exchangeRatesSlice';
import basketReducer from './slices/basketSlice';

export const store = configureStore({
    reducer: {
        basket: basketReducer,
        exchangeRates: exchangeRatesReducer,
        
    },
});
