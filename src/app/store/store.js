// /app/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import exchangeRatesReducer from './slices/exchangeRatesSlice';
import basketReducer from './slices/basketSlice';
import userReducer from './slices/userSlice'
import tokenReducer from './slices/tokenSlice'

export const store = configureStore({
    reducer: {
        basket: basketReducer,
        exchangeRates: exchangeRatesReducer,
        user:userReducer,
        token: tokenReducer,
        
    },
});
