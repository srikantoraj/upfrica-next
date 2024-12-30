'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js-এর জন্য রাউটার
import Link from 'next/link';

const UserName = () => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // রাউট করার জন্য

  useEffect(() => {
    // লোকালস্টোরেজ থেকে ডেটা আনা
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo); // JSON ফর্ম্যাটে রূপান্তর
        if (parsedUser.user) {
          setUser(parsedUser.user); // state-এ ব্যবহারকারীর ডেটা সেট
        } else {
          router.push('/signin'); // user ডেটা না থাকলে /signin-এ পাঠানো
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/signin'); // JSON.parse সমস্যা হলে সাইন ইন পেজে পাঠানো
      }
    } else {
      router.push('/signin'); // লোকালস্টোরেজে কিছুই না থাকলে সাইন ইন পেজে পাঠানো
    }
  }, [router]);

  // console.log(user?.first_name)

  return (
    <div>
      <h2>
        <span className="font-bold">Hello,</span>
        {!user ? (
          <Link href="/signin">
            <span className="text-purple-500">Sign in |</span>
          </Link>
        ) : (
          <>
          <span className="text-purple-500 font-bold">{user?.first_name}</span> <br />
          <span className='font-bold'>Wellcome back</span>
          </>
          // UI-তে firstname দেখানো
        )}
      </h2>
    </div>
  );
};

export default UserName;
