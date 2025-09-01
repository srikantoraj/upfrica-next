// src/app/utils/storage.js

// ✅ Safe get from localStorage with JSON parsing + fallback
export function getFromStorage(key, fallback = null) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`⚠️ Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
}

// ✅ Save to localStorage with JSON stringify and error handling
export function saveToStorage(key, value) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`❌ Failed to save key "${key}" to localStorage:`, err);
    }
  }
}

// ✅ Remove key from localStorage
export function removeFromStorage(key) {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`❌ Failed to remove key "${key}" from localStorage:`, err);
    }
  }
}