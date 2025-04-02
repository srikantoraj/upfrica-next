// app/login/page.tsx
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import logo from '@/public/images/logo.png'; // Ensure the logo image is present
import Link from 'next/link';
import LocalStorageComponent from '@/components/LocalStorageComponent';


const LoginPage = () => {
  return (
    <div className="max-w-screen-2xl flex justify-center items-center mx-auto lg:p-10 p-4 min-h-screen">
      <div className="bg-white container grid lg:grid-cols-2 py-10 lg:px-20 shadow-xl border rounded-md">
        {/* Image Column */}
        <LocalStorageComponent/>
        <div className="col-span-1 order-2 lg:order-1 flex justify-center items-center p-2 lg:p-4">
          <Image
            className="h-80 sm:h-full"
            src="https://booking.webestica.com/assets/images/element/signin.svg" // Place signin.svg in public/images/
            alt="Sign In Image"
            width={500}
            height={500}
          />
        </div>

        {/* Text Column */}
        <div className="col-span-1 order-1 lg:order-2 p-4">
          <div className="text-center space-y-4 px-4">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                className="h-10 lg:h-14 mx-auto"
                src={logo} // Ensure the logo image is present
                alt="Upfrica Logo"
                width={140}
                height={56}
              />
            </div>

            {/* Heading */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Log in to your account
            </h2>

            {/* Sign-up text */}
            <p className="text-base">
              Or{' '}
              <Link href="/signup">
                <span className="text-purple-500 cursor-pointer">
                  sign up for an account
                </span>
              </Link>
            </p>

            {/* Login Form */}
            <LoginForm />

            {/* Copyright Text */}
            <p className="text-gray-500 text-sm mt-4">
              © 2024 Upfrica. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
