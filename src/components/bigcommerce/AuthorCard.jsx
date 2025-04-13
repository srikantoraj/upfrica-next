import React from "react";

const AuthorCard = () => {
  return (
    <div className="text-center space-y-3">
      <img
        className="w-24 h-24 rounded-full object-cover mx-auto"
        src="https://images.ctfassets.net/wowgx05xsdrr/2NikpkcEp1a6ck0pDOFyE7/da5149e9031c924e555c540ce2d8cd5b/577.png"
        alt="Reed Hartman"
      />
      <a
        href="https://www.bigcommerce.com/blog/author/reed-hartman/"
        className="text-blue-600 hover:underline text-sm"
      >
        Reed Hartman
      </a>
      <p className="text-sm text-gray-600">
        Content Marketing Manager at BigCommerce, helping ecommerce businesses grow.
      </p>
    </div>
  );
};

export default AuthorCard;
