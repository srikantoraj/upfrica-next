import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";

const SalesEndSection = ({ days, seconds, minutes }) => {
  return (
    <div className="flex  items-center gap-2 text-base text-[#CC0C39] font-bold">
      <div className="flex items-center bg-[#CC0C39] rounded-md px-2">
        <AiFillThunderbolt className="text-white" />
        <button className="  text-white">Sales</button>
      </div>
      <span>
        {" "}
        <span></span>ends in
      </span>
      <span>{days}</span>
      <span>days</span>
      <span>{minutes}</span> :<span>{seconds}</span>
    </div>
  );
};

export default SalesEndSection;
