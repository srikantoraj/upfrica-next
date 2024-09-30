import React from "react";
// import FormInput from '@components/ui/FormInput';

// import Button from "./Button";
import FormInput from "@/components/ui/FormInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

const UserEdit = () => {
  return (
    <div className=" w-full bg-white shadow-2xl rounded-md space-y-4 md:p-10 p-2">
      {/* <h2 className="text-2xl font-bold">Edit User timtooni</h2> */}
      <div className="lg:flex justify-between">
        <h2 className="text-base md:text-2xl lg:text-3xl font-bold">Edit User jeobless</h2>
        <Button label="Show User jeobless"></Button>
      </div>
      <hr />
      <form className="w-full lg:w-2/3  md:p-10 flex flex-col justify-center items-center space-y-4">
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
        <Button label="Update User" />
      </form>
    </div>
  );
};

export default UserEdit;
