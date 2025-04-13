import React from "react";
import Breadcrumbs from "./Breadcrumbs";
import SearchBar from "./SearchBar";

const HeaderSection = () => {
  return (
    <div className="max-w-6xl mx-auto grid md:gap-4 md:grid-cols-3 py-10 p-4 ">
      <div className="col-span-2">
        <Breadcrumbs />
      </div>
      <div className="mt-8 md:mt-0">
        <SearchBar />
      </div>
    </div>
  );
};

export default HeaderSection;
