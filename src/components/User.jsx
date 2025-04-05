// "use client"
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link'; // Link component is missing in your code
// import useAuth from './useAuth';


// const User = () => {

//     const user = null;
//     // const [user, setUser] = useState(null);

//     // useEffect   (() => {
//     //     setUser(localStorage.getItem("user"));
//     // }, []);
//     // const user = useAuth();
//     // const user = localStorage.getItem("user");
//     // Check if the user does not exist, then return the sign-in section
//     if (!user) {
//         return (
//             <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 shadow-lg text-white">
//                 <div className="flex items-center justify-center mx-auto py-4 px-6">
//                     <p className="text-lg">Sign in for the best experience</p>
//                     <button className="ml-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition duration-300">
//                         <Link href={"/signin"}>Sign in</Link>
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // If user exists, return null or any other content
//     return null;
// };

// export default User;


"use client"
import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// import { setUser } from '../app/store/slices/userSlice';


const User = () => {
    // const dispatch = useDispatch()
    // Get user from Redux store
    const user = useSelector((state) => state.user.user);
    console.log(user);
    
    // dispatch(()=>setUser(user))
    

    // If no user, show sign-in section
    
    if (!user) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 shadow-lg text-white z-50">
                <div className="flex items-center justify-center mx-auto py-4 px-6">
                    <p className="text-lg">Sign in for the best experience</p>
                    <Link href="/signin" className="ml-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-semibold transition duration-300">
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    // If user exists, show nothing
    return null;
};

export default User;
