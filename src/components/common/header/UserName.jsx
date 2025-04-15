


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
            <p className="text-purple-500  text-base font-medium">{user?.first_name}</p> 
            <p className='text-base font-medium'>Welcome back</p>
          </>
        )}
      </h2>
    </div>
  );
};

export default UserName;

