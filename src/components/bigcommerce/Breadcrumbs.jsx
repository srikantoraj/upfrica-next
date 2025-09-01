import React from "react";

const Breadcrumbs = () => {
  const items = [
    { name: "Blog Home", href: "https://www.bigcommerce.com/blog/" },
    {
      name: "Fashion & Apparel",
      href: "https://www.bigcommerce.com/blog/category/fashion-apparel/",
    },
    { name: "AI Is Reshaping How Fashion Brands Do Business Online" },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-gray-600 [&_a]:text-bc-blue [&_a:hover]:text-bc-black flex w-full text-xs"
    >
      <ul className="flex w-full">
        {items.map((item, index) => (
          <li
            key={index}
            className="min-w-0 items-center font-medium flex shrink-auto md:shrink-0 first:shrink-0"
          >
            {index !== 0 && (
              <svg
                className="w-2 h-2 fill-current mx-2 shrink-0"
                viewBox="0 0 8 15"
              >
                <path d="M5.605 7.943.277 13.322a.988.988 0 0 0 .032 1.403c.398.379 1.03.364 1.411-.032l6.003-6.08a.988.988 0 0 0-.015-1.387l-6.003-6.13a1.003 1.003 0 0 0-1.413 0 .988.988 0 0 0 0 1.404l5.313 5.443Z" />
              </svg>
            )}
            <span className="truncate flex-1">
              {item.href ? (
                <a href={item.href} className="hover:text-bc-black">
                  {item.name}
                </a>
              ) : (
                <span className="hidden md:flex">{item.name}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
