import React from "react";

const Footer = () => {
  return (
    <div className="px-2 flex md:justify-between pb-4 text-base ">
      <div>
        <ul className="md:flex hidden  gap-5 text-gray-600">
          <li>Support Center</li>
          <li>Payment Security</li>
          <li>Privacy Policy</li>
          <li>EMI</li>
        </ul>
      </div>
      <div className="text-center mx-auto md:mx-0">
        <p>
          Copyright © 2024. <span className="text-pink-400">GoGirls</span> All
          rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
