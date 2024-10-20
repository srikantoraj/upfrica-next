import React from "react";
import Link from "next/link";

export default function CategoryItem({ data }) {
  const { image, name,slug } = data;
  if(!image) return; 

  return (
    <div className="min-w-32">
      <Link href={`/categories/${slug}`}>
      <div className="flex flex-col items-center">
        {/* <Link href='/categories'> */}
          <img
            className="h-24 2xl:h-28 w-24 2xl:w-28 rounded-full"
            src={image || "https://images.pexels.com/photos/46216/sunflower-flowers-bright-yellow-46216.jpeg?cs=srgb&dl=bloom-blossom-flora-46216.jpg&fm=jpg"}
            alt=""
          />
        {/* </Link> */}
        <p className="text-sm lg:text-base tracking-wide">{name}</p>
      </div>
      </Link>
    </div>
  );
}