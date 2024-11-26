// components/home/Categore/Categore.tsx
// 'use client';
import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import CategoryItem from './CategoryItem';





const Categories = async () => {
  const res = await fetch('https://upfrica-staging.herokuapp.com/api/v1/categories', {
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  const categories = data.categories;

  if (!categories || categories.length === 0) {
    return <p className="text-center">No categories available.</p>;
  }

  return (
    <div className="py-10 bg-white shadow-md  mb-2  container mx-auto p-5">
      <div className="">
        <div className="flex gap-4 md:gap-10 items-center">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">Shop by Category</h1>
          <IoIosArrowRoundForward className="h-14 w-14 pt-4 text-gray-700" />
        </div>
        <div className="hidden xl:flex justify-around py-5">
          {categories.map((data) => (
            <CategoryItem key={data.id} data={data} />
          ))}
        </div>
       
        <div className="xl:hidden overflow-x-auto py-5">
            <div className="flex gap-2 whitespace-nowrap">
                {categories.map((data) => (
                <CategoryItem key={data.id} data={data} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;
