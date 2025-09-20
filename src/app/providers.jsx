// src/app/providers.jsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { SWRConfig } from "swr";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <SWRConfig
        value={{
          dedupingInterval: 2000,      // collapse repeat calls within 2s
          revalidateOnFocus: false,    // don’t refetch on window focus
          revalidateIfStale: true,
          revalidateOnReconnect: true,
          errorRetryCount: 1,
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </SWRConfig>
    </Provider>
  );
}