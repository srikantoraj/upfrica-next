// "use client";
// import DashbordSearchBer from "@/components/dashboard/DashbordSearchBer";
// import React from "react";
// import { useSelector } from "react-redux";

// const layout = ({ children }) => {
//   const toggle = useSelector((state) => state.toggle.toggle); // access toggle value
//   return (
//     <div className="flex gap-3">
//       {toggle && <DashbordSearchBer />}
//       {children}
//     </div>
//   );
// };

// export default layout;


// "use client";
// import DashbordSearchBer from "@/components/dashboard/DashbordSearchBer";
// import React from "react";
// import { useSelector } from "react-redux";
// import clsx from "clsx"; // optional for cleaner className handling

// const Layout = ({ children }) => {
//   const toggle = useSelector((state) => state.toggle.toggle);

//   return (
//     <div className="flex gap-3 relative">
//       <div
//         className={clsx(
//           "transition-all duration-300 ease-in-out",
//           "absolute  z-10",
//           toggle ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
//         )}
//       >
//         <DashbordSearchBer />
//       </div>
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// };

// export default Layout;


"use client";
import DashbordSearchBer from "@/components/dashboard/DashbordSearchBer";
import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

const Layout = ({ children }) => {
  const toggle = useSelector((state) => state.toggle.toggle);

  return (
    <div className="flex relative w-full">
      {/* Sidebar */}
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out h-full w-64",
          "absolute z-10",
          "xl:relative xl:z-auto",
          toggle
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 xl:hidden"
        )}
      >
        <DashbordSearchBer />
      </div>

      {/* Main Content */}
      <div
        className={clsx(
          "flex-1 transition-all duration-300",
          
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;






