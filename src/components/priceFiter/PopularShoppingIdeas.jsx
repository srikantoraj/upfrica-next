import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

/**
 * Example data matching the snippet:
 * Wireless, Mechanical, Console, Ergonomic are shown first,
 * then “Backlit,” “Portable,” “Retro,” and “Clicky” appear when expanded.
 */
const popularShoppingItems = [
  {
    label: "Wireless",
    href: "/s?k=wireless+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_0",
  },
  {
    label: "Mechanical",
    href: "/s?k=mechanical+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_1",
  },
  {
    label: "Console",
    href: "/s?k=console+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_2",
  },
  {
    label: "Ergonomic",
    href: "/s?k=ergonomic+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_3",
  },
  {
    label: "Backlit",
    href: "/s?k=backlit+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_4",
  },
  {
    label: "Portable",
    href: "/s?k=portable+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_5",
  },
  {
    label: "Retro",
    href: "/s?k=retro+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_6",
  },
  {
    label: "Clicky",
    href: "/s?k=clicky+gaming+keyboard&ref=sr_nr_p_cosmo_multi_pt_7",
  },
];

const PopularShoppingIdeas = () => {
  const [expanded, setExpanded] = useState(false);

  // Show only the first 4 items unless expanded is true.
  const visibleItems = expanded
    ? popularShoppingItems
    : popularShoppingItems.slice(0, 4);

  return (
    <div className="mb-4 w-full">
      {/* Title */}
      <h2 className="font-semibold text-base lg:text-lg text-gray-700">
        Popular Shopping Ideas
      </h2>

      {/* List of items */}
      <ul className="space-y-1">
        {visibleItems.map((item) => (
          <li key={item.label} className="text-lg">
            <a
              href={item.href}
              className="text-gray-600"
              role="link"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Toggle button */}
      {popularShoppingItems.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="See more or see less items"
          className="mt-2 flex items-center text-base  text-blue-700 hover:underline"
        >
          {expanded ? <div className='flex items-center gap-1 text-base'><IoIosArrowUp className='h-6 w-6 text-gray-800' /> <p>See Less</p></div> : <div className='flex items-center gap-1'><IoIosArrowDown className='h-6 w-6 text-gray-800' /> <p className='flex items-center gap-1 text-base'>See More</p></div>}
        </button>
      )}
    </div>
  );
};

export default PopularShoppingIdeas;
