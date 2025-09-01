// lib/axiosInstance.js

import axios from "axios";

// 🔧 Create a reusable axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Inject token from localStorage (client-side only)
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const rawToken = localStorage.getItem("token");
        if (rawToken) {
          // Strip quotes if present (defensive)
          const cleanToken = rawToken.replace(/^"|"$/g, "").trim();
          config.headers.Authorization = `Token ${cleanToken}`;
        }
      } catch (err) {
        console.warn("⚠️ Failed to inject token from localStorage:", err);
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios request error:", error);
    return Promise.reject(error);
  }
);

// 🚨 Optional: Handle expired/invalid tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        console.warn("🔐 Token might be invalid or expired. Status:", status);

        // Uncomment if you want to force logout on invalid token
        /*
        localStorage.removeItem("token");
        window.location.href = "/login"; // Or redirect to your auth route
        */
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;