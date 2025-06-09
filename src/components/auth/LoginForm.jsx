'use client'

import React, { useEffect } from 'react'
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

  // ✅ Log the API base URL to verify it's loading
  useEffect(() => {
    console.log('✅ NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
  }, [])

  const formik = useFormik({
    initialValues: {
      email: 'upfricasite@gmail.com',
      password: 'casford262',
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        console.log('📡 Fetching from:', `${apiUrl}/api/login`) // Debug log

const response = await fetch(`${apiUrl}/api/login/`, {
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
        console.error('Login error:', error)
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
