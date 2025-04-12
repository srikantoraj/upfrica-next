import React from "react";

const ShareButtons = () => {
  const links = [
    {
      href: "https://twitter.com/intent/tweet?text=AI%20Is%20Reshaping...",
      icon: "fa-brands fa-twitter",
      label: "Twitter",
    },
    {
      href: "https://www.linkedin.com/shareArticle?url=https://...",
      icon: "fa-brands fa-linkedin",
      label: "LinkedIn",
    },
    {
      href: "https://www.facebook.com/sharer/sharer.php?u=https://...",
      icon: "fa-brands fa-facebook",
      label: "Facebook",
    },
  ];

  return (
    <div className="sticky top-[150px] mt-10">
      <span className="text-xs uppercase text-bc-black font-medium">
        Share this article
      </span>
      <ul className="flex flex-wrap gap-2 mt-3">
        {links.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              title={item.label}
            >
              <i className={`${item.icon} text-2xl`}></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareButtons;
