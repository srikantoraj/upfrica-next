"use client";
import React from "react";
import FormInput from "@/components/ui/FormInput";
import Checkbox from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/button";
const UserEdit = () => {
  return (
    <div className="w-full bg-white shadow-2xl rounded-md space-y-4 md:p-10 p-2">
      <div className="md:flex justify-between">
        <h2 className="text-base md:text-2xl lg:text-3xl font-bold">
          Edit User jeobless
        </h2>
        <Button label="Show User jeobless"></Button>
      </div>
      <hr />
      <form className="lg:w-2/3 md:p-10 mx-auto space-y-4 py-10">
        <FormInput
          label="Full Name:"
          type="text"
          id="fullName"
          placeholder="Enter your full name"
        />
        <FormInput
          label="Username:"
          type="text"
          id="username"
          placeholder="Enter your username"
        />
        <FormInput
          label="Email:"
          type="email"
          id="email"
          placeholder="Enter your email"
        />
        <FormInput
          label="Password:"
          type="password"
          id="password"
          placeholder="Enter your password"
        />
        <FormInput
          label="Password Confirmation:"
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
        />
        <Checkbox label="Admin" id="isAdmin" />
        <Checkbox label="Terms of service" id="terms" />

        {/* Button centered on small devices */}
        <div className="flex justify-center">
          <Button label="Update User" />
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
