
// 'use client'
// import React from 'react';
// import { useFormik } from 'formik';
// import PasswordInput from '@/components/ui/PasswordInput';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { setUser } from '@/app/store/slices/userSlice'; // Adjust the import path as necessary
// import Link from 'next/link';

// const LoginForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch();

//   const formik = useFormik({
//     initialValues: {
//       email: 'upfricasite@gmail.com',
//       password: 'casford262',
//     },
//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       console.log('Form Data:', values);
//       try {
//         const response = await fetch(
//           'https://media.upfrica.com/api/login/',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(values),
//           }
//         );

//         const data = await response.json();
//         console.log('Response Data:', data.token);

//         if (response.ok) {
//           // Save user data to your Redux store
//           dispatch(setUser(data));
//           // Read the "next" query parameter; if not provided, default to '/'
//           const nextPath = searchParams.get('next') || '/';
//           router.push(nextPath);
//         } else {
//           // Handle server-side validation errors
//           setErrors({ email: data.message || 'Login failed' });
//         }
//       } catch (error) {
//         console.error('An unexpected error occurred:', error);
//         setErrors({ email: 'An unexpected error occurred. Please try again.' });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit} className="space-y-4">
//       {/* Email Input */}
//       <div className="space-y-2">
//         <label htmlFor="email" className="block text-left text-xl font-medium text-[#85878A]">
//           Enter email id
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           onChange={formik.handleChange}
//           value={formik.values.email}
//           placeholder="Enter your email"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           required
//         />
//         {formik.errors.email && (
//           <div className="text-red-500 text-sm">{formik.errors.email}</div>
//         )}
//       </div>

//       {/* Password Input */}
//       <PasswordInput
//         id="password"
//         name="password"
//         value={formik.values.password}
//         onChange={formik.handleChange}
//         placeholder="Enter your password"
//       />
//       {formik.errors.password && (
//         <div className="text-red-500 text-sm">{formik.errors.password}</div>
//       )}

//       {/* Remember me & Forgot password */}
//       <div className="flex justify-between items-center w-full">
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="rememberMe"
//             name="rememberMe"
//             className="h-4 w-4 text-[#A435F0] border-gray-300 rounded focus:ring-purple-500"
//           />
//           <label htmlFor="rememberMe" className="ml-2 block text-xl text-[#85878A]">
//             Remember me
//           </label>
//         </div>
//         <div>
//           <Link
//             href="/password/new"
//             className="text-xl text-purple-500 hover:text-purple-700"
//           >
//             Forgot password?
//           </Link>
//         </div>
//       </div>

//       {/* Login Button */}
//       {!formik.isSubmitting && (
//         <button
//           type="submit"
//           className="w-full text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           disabled={formik.isSubmitting}
//         >
//           Log In
//         </button>
//       )}
//       {formik.isSubmitting && (
//         <button
//           type="submit"
//           className="w-full text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           disabled={formik.isSubmitting}
//         >
//           <div className="flex space-x-2 justify-center items-center h-6">
//             <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
//             <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
//             <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
//           </div>
//         </button>
//       )}

//       {/* Help Button */}
//       <button
//         type="button"
//         className="w-full text-xl px-4 py-2 bg-gray-100 rounded-md font-bold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         onClick={() => {
//           // Implement help functionality or navigation
//         }}
//       >
//         Help
//       </button>
//     </form>
//   );
// };

// export default LoginForm;
'use client'

import React from 'react'
import { useFormik } from 'formik'
import PasswordInput from '@/components/ui/PasswordInput'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setUser } from '@/app/store/slices/userSlice'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: 'upfricasite@gmail.com',
      password: 'casford262',
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch('https://media.upfrica.com/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await response.json()
        if (response.ok) {
          dispatch(setUser(data))
          const nextPath = searchParams.get('next') || '/'
          router.push(nextPath)
        } else {
          setErrors({ email: data.message || 'Login failed' })
        }
      } catch (error) {
        setErrors({ email: 'An unexpected error occurred. Please try again.' })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className=" flex items-center justify-center ">
      <div className="max-w-md w-full bg-white p-4 rounded-lg shadow">
        {/* Header */}
        <h2 className="text-center text-xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        {/* Social Buttons */}
        <div className="mt-4 flex space-x-4">
          <a
            href="https://media.upfrica.com/accounts/google/login/"
            className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-2xl" />
            <span className="ml-2 text-gray-700 font-medium">Google</span>
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              // router.push('https://media.upfrica.com/accounts/facebook/login/')
            }}
            className="flex-1 flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaFacebookF className="text-2xl text-blue-600" />
            <span className="ml-2 text-gray-700 font-medium">Facebook</span>
          </a>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-gray-500 text-sm">or continue with</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <PasswordInput
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Enter your password"
            />
            {formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link href="/password/new" className="text-sm text-purple-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {formik.isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                'Log In'
              )}
            </button>
          </div>
        </form>

        {/* Help Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // help action
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Need help?
          </button>
        </div>
      </div>
    </div>
  )
}
