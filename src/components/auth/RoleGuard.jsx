// components/auth/RoleGuard.jsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function RoleGuard({ children, allowed }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!user || !allowed.includes(user.account_type)) {
      router.replace('/unauthorized'); // or /login if needed
    }
  }, [hydrated, user]);

  return hydrated && allowed.includes(user?.account_type) ? children : null;
}