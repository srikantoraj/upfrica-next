// src/components/cards/SocialCardGroup.js
import React from "react";
import socialStats from "./socialStats";
import SocialCard from "./SocialCard";


const SocialCardGroup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {socialStats.map((stat, index) => (
        <SocialCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default SocialCardGroup;
