


'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link'; 

const UserName = () => {
  // Redux store theke user data anchi
  const user = useSelector((state) => state.auth.user);


  return (
    <div>
      <h2>
        {!user ? (
          <Link href="/signin">
            <span className="text-purple-500 text-base">Sign in</span>
          </Link>
        ) : (
          <>
            <span className="text-purple-500  text-base font-bold">{user?.first_name}</span> <br />
            <span className='text-base font-bold'>Welcome back</span>
          </>
        )}
      </h2>
    </div>
  );
};

export default UserName;

