
'use client'
import React from 'react'
import Link from 'next/link';

const UserName = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
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