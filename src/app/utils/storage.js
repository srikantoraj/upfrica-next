// src/app/utils/storage.js

export function getFromStorage(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Invalid JSON in localStorage key "${key}"`, e);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function removeFromStorage(key) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}