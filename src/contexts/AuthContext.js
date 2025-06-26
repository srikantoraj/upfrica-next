//src/contexts/AuthContent.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
// NEW (✅ correct)
import { getFromStorage as getItem, saveToStorage as setItem, removeFromStorage as removeItem } from '@/app/utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedToken = getItem('token');
    const savedUser = getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setHydrated(true);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setItem('user', userData);
    setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeItem('user');
    removeItem('token');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUser(res.data);
      setItem('user', res.data);
    } catch (err) {
      console.error('❌ Failed to refresh user:', err);
    }
  };

  const isBuyer = user?.account_type?.includes('buyer');
  const isSeller = user?.account_type?.some((r) =>
    ['seller_private', 'seller_business'].includes(r)
  );
  const isAgent = user?.account_type?.includes('agent');
  const requiresOnboarding = (isSeller || isAgent) && !user?.onboarded;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        hydrated,
        login,
        logout,
        refreshUser,
        isBuyer,
        isSeller,
        isAgent,
        requiresOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('❌ useAuth must be used within an <AuthProvider>');
  }
  return context;
}