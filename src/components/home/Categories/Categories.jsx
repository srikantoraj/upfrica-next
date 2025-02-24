import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import CategoryItem from './CategoryItem';

const Categories = async () => {
  const res = await fetch('https://upfrica.com/api/v1/categories', {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  let categories = data.categories;

  // Filter out categories that don't have an image
  categories = categories.filter((category) => category.image);

  if (!categories || categories.length === 0) {
    return <p className="text-center text-lg font-medium">No categories available.</p>;
  }

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
          Shop by Category
        </h1>
        <IoIosArrowRoundForward className="h-12 w-12 text-gray-700" />
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="overflow-x-auto whitespace-nowrap py-4">
        <div className="flex gap-4 md:gap-6" style={{ scrollbarWidth: 'none' }}>
          {categories.map((data) => (
            <div
              key={data.id}
              className="min-w-[180px] md:min-w-[220px] h-[180px] md:h-[220px] flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md p-4"
            >
              {/* Category Image */}
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-[120px] md:h-[150px] object-cover rounded-lg"
              />

              {/* Truncated Category Name */}
              <p className="text-sm md:text-base font-medium text-center mt-2 truncate w-full">
                {data.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

