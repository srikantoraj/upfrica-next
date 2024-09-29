import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";

const SalesEndSection = ({ days, seconds, minutes }) => {
  return (
    <div className="flex  items-center gap-2 text-base">
       <div className="flex items-center bg-red-500  pl-1 py-1 rounded-md">
       <AiFillThunderbolt className="text-white" />
       <button className="px-2  text-white">Sales</button>
       </div>
       <span> <span></span>ends in</span>
       <span>{days}</span>
       <span>days</span>
       <span>{minutes}</span> : 
       <span>{seconds}</span>
    </div>
  );
};

export default SalesEndSection;
