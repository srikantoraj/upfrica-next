// components/auth/LoginForm.tsx
'use client'
import React from 'react';
import { useFormik } from 'formik';
import PasswordInput from '@/components/ui/PasswordInput';
import { useRouter } from 'next/navigation';


const LoginForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: 'srikantorajbongshi139@gmail.com',
      password: '@srikanto12345',
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log('Form Data:', values);
      try {
        const response = await fetch(
          'https://upfrica-staging.herokuapp.com/api/v1/auth.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();
        console.log('Response Data:', data);

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data));
          router.push('/');
        } else {
          // Handle server-side validation errors
          setErrors({ email: data.message || 'Login failed' });
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setErrors({ email: 'An unexpected error occurred. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-left text-xl font-medium text-[#85878A]">
          Enter email id
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {formik.errors.email && (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        )}
      </div>

      {/* Password Input */}
      <PasswordInput
        id="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        placeholder="Enter your password"
      />
      {formik.errors.password && (
        <div className="text-red-500 text-sm">{formik.errors.password}</div>
      )}

      {/* Remember me & Forgot password */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            className="h-4 w-4 text-[#A435F0] border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-xl text-[#85878A]">
            Remember me
          </label>
        </div>
        <div>
          <a
            href="#"
            className="text-xl text-purple-500 hover:text-purple-700"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full text-xl px-4 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Logging in...' : 'Log In'}
      </button>

      {/* Help Button */}
      <button
        type="button"
        className="w-full text-xl px-4 py-2 bg-gray-100 rounded-md font-bold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => {
          // Implement help functionality or navigation
        }}
      >
        Help
      </button>
    </form>
  );
};

export default LoginForm;
