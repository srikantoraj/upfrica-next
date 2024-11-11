// src/contexts/OrderContext.js
import { createContext, useContext } from "react";

export const OrderContext = createContext(null);

// Custom hook for accessing the context
export const useOrder = () => useContext(OrderContext);
