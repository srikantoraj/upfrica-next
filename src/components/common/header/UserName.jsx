


// 'use client'
// import React from 'react';
// import { useSelector } from 'react-redux';
// import Link from 'next/link';

// const UserName = () => {
//   // Redux store theke user data anchi
//   const user = useSelector((state) => state.auth.user);


//   return (
//     <div>
//       {!user ? (
//         <Link href="/signin">
//           <span className="text-purple-500 text-base">Sign in</span>
//         </Link>
//       ) : (
//         <>
//           <p className="text-purple-500  text-base font-medium">{user?.first_name}</p>
//           <p className='text-base font-medium'>Welcome back</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserName;

'use client'

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const UserName = () => {
  const user = useSelector((state) => state.auth.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // useEffect শুধু Client এ চলবে
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server Render এর সময় কিছুই render করবো না
    return null;
  }

  return (
    <div>
      {!user ? (
        <Link href="/signin">
          <span className="text-purple-500 text-base">Sign in</span>
        </Link>
      ) : (
        <>
          <p className="text-purple-500 text-base font-medium">{user?.first_name}</p>
          <p className="text-base font-medium">Welcome back</p>
        </>
      )}
    </div>
  );
};

export default UserName;


