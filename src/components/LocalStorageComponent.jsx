'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, removeFromStorage } from '@/app/utils/storage';

const LocalStorageComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const user = getFromStorage('user');

    if (user?.token) {
      router.push('/');
    } else {
      removeFromStorage('user'); // Optional cleanup of bad data
    }
  }, [router]);

  return null; // You can return a loading spinner or null
};

export default LocalStorageComponent;