import Link from "next/link";
import React from "react";

const Cover = () => {
  return (
    <Link href={"/deals"}>
      <img
        src="https://d26ukeum83vx3b.cloudfront.net/assets/blackfriday-long-a1f324588543075e71b91f6cfc8ce7e49fc41334fd5f13d721e6efb8b356ed95.jpg?w=auto&qlt=50&fmt=auto&noiser=0&fmt.jpeg.interlaced=true&fmt.jp2.qlt=40&"
        alt=""
      />
    </Link>
  );
};

export default Cover;
