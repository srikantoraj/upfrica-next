
'use client'
import React, { useEffect, useState } from 'react'
import { FaRegUser } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import UserName from './UserName';

const UserEmail = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUser(user)
  }, [])
  return (
    <div className='flex gap-5'>
      <div className="flex items-center">
        <FaRegUser
          className="h-7 w-7 text-purple-500 cursor-pointer" />
        {!user && <span className="ml-2 font-bold">Please login!</span>}
        {user && <span className="ml-2 font-bold">{user?.user?.email}</span>}
      </div>
      <UserName />
    </div>
  )
}

export default UserEmail