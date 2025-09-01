// /app/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import exchangeRatesReducer from "./slices/exchangeRatesSlice";
import basketReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import toggleReducer from "./slices/toggleSlice";
import countryReducer from "./slices/countrySlice";
import reviewsReducer from "./slices/reviewsSlice";
import uiReducer from "./slices/uiSlice";                    // ⬅️ add this

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    exchangeRates: exchangeRatesReducer,
    auth: userReducer,
    toggle: toggleReducer,
    country: countryReducer,
    reviews: reviewsReducer,
    ui: uiReducer,                                           // ⬅️ add this
  },
});