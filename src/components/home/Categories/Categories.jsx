// components/home/Categore/Categore.tsx
// 'use client';
import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import CategoryItem from './CategoryItem';
// import Slider from "react-slick";

 const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Default to 1 slide
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 640, // For small devices (sm)
        settings: {
          slidesToShow: 3, // Show 3 slides on sm devices
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // For medium devices (md)
        settings: {
          slidesToShow: 6, // Show 6 slides on md devices
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // For medium devices (md)
        settings: {
          slidesToShow: 7, // Show 6 slides on md devices
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1280, // For medium devices (md)
        settings: {
          slidesToShow: 8, // Show 6 slides on md devices
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1536, // For medium devices (md)
        settings: {
          slidesToShow: 9, // Show 6 slides on md devices
          slidesToScroll: 3,
        },
      },
    ],
  };


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
    <div className="py-10 shadow  mb-2 lg:px-10 px-4 flex justify-center">
      <div className="container">
        <div className="flex gap-4 md:gap-10 items-center">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">Shop by Category</h1>
          <IoIosArrowRoundForward className="h-14 w-14 pt-4 text-gray-700" />
        </div>
        <div className="hidden xl:flex justify-around">
          {categories.map((data) => (
            <CategoryItem key={data.id} data={data} />
          ))}
        </div>
       
        <div className="xl:hidden overflow-x-auto">
            <div className="flex whitespace-nowrap ">
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
