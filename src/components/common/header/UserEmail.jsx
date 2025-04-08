
'use client'
import React, { useEffect, useState } from 'react'
import { FaRegUser } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import UserName from './UserName';
import { useSelector } from 'react-redux';

const UserEmail = () => {
  const [user, setUser] = useState(null);
  const { user: userData, token } = useSelector((state) => state.auth);
  // const token = useSelector((state) => state.user.token);
  useEffect(() => {
    const user = localStorage.getItem('user');
    setUser(user)
  }, [])
  return (
    <div className='flex gap-5'>
      <div className="flex items-center">
        <FaRegUser
          className="h-7 w-7 text-purple-500 cursor-pointer" />
        {!userData && <span className="ml-2 font-bold">Please login!</span>}
        {userData && <span className="ml-2 font-bold">{userData?.name}</span>}
      </div>
      <UserName />
    </div>
  )
}

export default UserEmail