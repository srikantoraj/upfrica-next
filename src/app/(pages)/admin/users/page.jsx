import Users from "@/components/user/Users";
import UserContent from "@/components/user/UserContent";
import React from "react";

const page = () => {
  return (
    <div className=" md:grid md:grid-cols-12  gap-4 p-4">
      <div className="md:col-span-2">
        <Users />
      </div>
      <div className="md:col-span-9">
        <UserContent />
      </div>
    </div>
  );
};

export default page;
