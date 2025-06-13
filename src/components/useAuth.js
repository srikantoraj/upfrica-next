'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/constants';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setHydrated(true);
    }
  }, []);

  const refreshUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_API_URL}/api/users/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        console.warn('⚠️ refreshUser failed with status:', res.status);
        return; // 🔁 Don’t logout — just stop here
      }

      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error('❌ refreshUser error:', error);
      // Don't force logout on error — only on actual logout action
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/signin');
  };

  return { user, token, hydrated, refreshUser, logout };
};

export default useAuth;