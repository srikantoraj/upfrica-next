// LocalStorageComponent.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LocalStorageComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user?.token) {
      router.push('/');
    }
  }, [router]);

  return null; // You can return any JSX you need here
};

export default LocalStorageComponent;
