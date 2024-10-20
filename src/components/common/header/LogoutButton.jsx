'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const LogoutButton = () => {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('user')) || {};

    
    
      const logOut = () => {
        localStorage.removeItem('user'); 
        router.push('/')
     }
     

  return (
      <div>
          {!user && <Link href="/signup">
              <button className="px-4 py-1 bg-purple-500 text-white rounded text-xl font-bold">
                  Join
              </button>
          </Link>}
          {user && 
              <button className="px-2 py-1 bg-purple-500 text-white rounded  font-bold" onClick={logOut}>
                  Logout
              </button>
          }
    </div>
  )
}

export default LogoutButton