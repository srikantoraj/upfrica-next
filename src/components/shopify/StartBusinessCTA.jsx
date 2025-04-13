import React from 'react';

const StartBusinessCTA = () => {
  return (
    <div className="p-6 bg-green-400 sticky top-0 ">
      <p className="text-2xl leading-tight text-black tracking-tight mb-2 font-semibold">
        Start your online business today.
      </p>
      <p className="text-2xl font-bold text-black tracking-tight mb-9">
        For free.
      </p>
      <a
        href="https://accounts.shopify.com/store-create?locale=en&language=en&signup_page=https%3A%2F%2Fwww.shopify.com%2Fblog%2Finternational-import-shipping&signup_types%5B%5D=paid_trial_experience"
        className="flex justify-between items-center text-black no-underline border-b border-black group w-fit"
      >
        <span className="text-base tracking-tight">Start free trial</span>
        <span className="flex justify-center items-center w-6 h-6 ml-4 transition-all duration-500 transform group-hover:translate-x-full group-hover:opacity-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00025 15.9998C7.74425 15.9998 7.48825 15.9018 7.29325 15.7068C6.90225 15.3158 6.90225 14.6838 7.29325 14.2928L11.5862 9.99976L7.29325 5.70676C6.90225 5.31576 6.90225 4.68376 7.29325 4.29276C7.68425 3.90176 8.31625 3.90176 8.70725 4.29276L13.7073 9.29276C14.0982 9.68376 14.0982 10.3158 13.7073 10.7068L8.70725 15.7068C8.51225 15.9018 8.25625 15.9998 8.00025 15.9998Z"
              fill="black"
            />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default StartBusinessCTA;
