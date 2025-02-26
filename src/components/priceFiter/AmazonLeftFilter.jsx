import React, { useState } from 'react';
import PopularShoppingIdeas from './PopularShoppingIdeas';
import PriceRefinements from '../home/ProductList/PriceRefinements';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';

/**
 * A simple filter group / accordion for each section
 */
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="">
        <h2 className="font-semibold text-base lg:text-lg text-gray-700">{title}</h2>
      </div>

      {/* Collapsible content */}
      {open && (
        <div className="mt-2 text-base lg:text-lg">
          {children}
        </div>
      )}

      {/* {<button
        onClick={() => setOpen(!open)}
        className="text-base lg:text-lg  text-blue-600 focus:outline-none mt-3"
        aria-expanded={open ? 'true' : 'false'}
      >
        {open  ? <div className='flex items-center gap-1 text-base'><IoIosArrowUp className='h-6 w-6 text-gray-800' /> <p>See Less</p></div> : <div className='flex items-center gap-1'><IoIosArrowDown className='h-6 w-6 text-gray-800' /> <p className='flex items-center gap-1 text-base'>See More</p></div>}
      </button>} */}
    </div>
  );
}

function AmazonLeftFilter() {
  return (
    <aside
      className="
        w-full
        md:w-60
        lg:w-64
        xl:w-full
        bg-gray-50
        p-10
        pr-28
         
        border-gray-200
        space-y-4
      "
      aria-label="Filter panel"
    >
      <PopularShoppingIdeas />

      {/* Price */}
      <PriceRefinements />

      {/* Customer Reviews */}
      <FilterGroup title="Customer Reviews">
        <ul className="space-y-2 text-base lg:text:lg text-gray-600">
          <li className="flex items-center space-x-2 text-yellow-400 text-lg">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </li>
          {/* Additional star rating checkboxes, etc. */}
        </ul>
      </FilterGroup>

      {/* Deals & Discounts */}
      <FilterGroup title="Deals & Discounts">
        <ul className="space-y-1  text-gray-600">
          <li><a href="#allDiscounts" className="hover:text-blue-700">All Discounts</a></li>
          <li><a href="#todaysDeals" className="hover:text-blue-700">Today's Deals</a></li>
        </ul>
      </FilterGroup>



      {/* Example for brand list — can be huge, so might want its own collapsible “See more” */}
      <FilterGroup title="Brands" >
        <ul className="text-base lg:text-lg space-y-1 text-gray-600">
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand1" />
            <label htmlFor="brand1">Bissell</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand2" />
            <label htmlFor="brand2">Rubbermaid</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">O-Cedar</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">Scrub Daddy</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">CLOROX</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">OXO</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">Shark</label>
          </li>
          <li className="flex items-center space-x-2">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">Holikme</label>
          </li>
          {/* ... etc ... */}
        </ul>
      </FilterGroup>

      {/* Additional sections for Connectivity, Special Features, Condition, Departments, etc.
          Each can be structured similarly using <FilterGroup> for the heading & collapsible logic.
      */}

      {/* Example: More-Sustainable Products / Climate Pledge Friendly */}
      <FilterGroup title="Department">
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Household Cleaning Tools</label>
        </div>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Household Mops, Buckets &</label>
        </div>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Household Squeegees</label>
        </div>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Fruit & Vegetable Tools</label>
        </div>

      </FilterGroup>

      {/* all top brand  */}
      <FilterGroup title={"All Top Brands"}>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Top Brands</label>
        </div>
      </FilterGroup>

      {/* seller  */}
      <FilterGroup title={"Seller"}>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Amazon.com</label>
        </div>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Triplenet Pricing INC</label>
        </div>
      </FilterGroup>

      {/* our brands  */}

      <FilterGroup title={"From Our Brands"}>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Amazon Brands</label>
        </div>

      </FilterGroup>

      {/* more products  */}
      <FilterGroup title={"More-sustainable Products"}>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">Climate Pledge Friendly</label>
        </div>
      </FilterGroup>

      {/* HSA Eligible  */}
      <FilterGroup title={"More-sustainable Products"}>
        <div className="flex items-center space-x-2 text-base lg:text-lg text-gray-600">
          <input type="checkbox" id="climatePledgeFriendly" />
          <label htmlFor="climatePledgeFriendly">FSA or HSA Eligible</label>
        </div>

      </FilterGroup>
    </aside>
  );
}

export default AmazonLeftFilter;
