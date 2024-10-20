// app/components/useAuth.js
'use client'; // Ensure this hook is used in client components

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    } else {
      // Redirect to Sign-In page if user does not exist
      // router.push('/signin');
    }
  }, [router]);

  return user;
};

export default useAuth;
