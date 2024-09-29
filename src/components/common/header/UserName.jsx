'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const UserName = () => {
     const [user, setUser] = useState(null);
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    setUser(userInfo)
  }, [])
    
  return (
      <div>
          <h2>
                <span className="font-bold">Hello </span>
              {!user?.user?.username && <Link href="/signin">
                  <span className="text-purple-500">Sign in |</span>
              </Link>}
              {user &&<span className="text-purple-500">{user?.user?.username} |</span>}
              </h2>
    </div>
  )
}

export default UserName