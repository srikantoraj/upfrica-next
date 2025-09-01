// import Link from 'next/link';
// import React from 'react';

// const NavTitle = () => {
//   return (
//     <div className="absolute  left-0 w-full h-[400px] bg-white z-50 shadow-md 2xl:hidden ">
//       {/* <ul className="flex flex-col items-center justify-center gap-4 py-10 text-black">
//         <li className="nav-item">
//           <Link href="/" className="nav-link">Home</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/products" className="nav-link">Browse</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/todays-deals" className="nav-link">Deals</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/shops" className="nav-link">Shops</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/categories" className="nav-link">Categories</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/how-it-works" className="nav-link">How It Works</Link>
//         </li>
//         <li className="nav-item">
//           <a
//             href="https://upfrica.co.uk"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="nav-link"
//           >
//             UK Site
//           </a>
//         </li>
//       </ul> */}
//       <ul className="flex flex-col  gap-8 text-black navbar-nav nav-active-line navbar-nav-scroll ">
//         <li className="nav-item">
//           <Link href="/" className="nav-link">Home</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/products" className="nav-link">Browse</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/todays-deals" className="nav-link">Deals</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/shops" className="nav-link">Shops</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/categories" className="nav-link">Categories</Link>
//         </li>
//         <li className="nav-item">
//           <Link href="/how-it-works" className="nav-link">How It Works</Link>
//         </li>
//         <li className="nav-item">
//           <a
//             href="https://upfrica.co.uk"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="nav-link"
//           >
//             UK Site
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default NavTitle;

// import Link from 'next/link';
// import React from 'react';

// const navItems = [
//   { name: 'Home', href: '/' },
//   { name: 'Browse', href: '/products' },
//   { name: 'Deals', href: '/todays-deals' },
//   { name: 'Shops', href: '/shops' },
//   { name: 'Categories', href: '/categories' },
//   { name: 'How It Works', href: '/how-it-works' },
//   { name: 'UK Site', href: 'https://upfrica.co.uk', external: true },
// ];

// const NavTitle = () => {
//   return (
//     <div className="absolute left-0 w-full h-auto bg-white z-50 shadow-md 2xl:hidden">
//       <ul className="flex flex-col text-black">
//         {navItems.map((item, index) => (
//           <li
//             key={index}
//             className="nav-item border-t border-b px-6 py-4 text-left"
//           >
//             {item.external ? (
//               <a
//                 href={item.href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="nav-link"
//               >
//                 {item.name}
//               </a>
//             ) : (
//               <Link href={item.href} className="nav-link">
//                 {item.name}
//               </Link>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NavTitle;

import Link from "next/link";
import React from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/products" },
  { name: "Deals", href: "/todays-deals" },
  { name: "Shops", href: "/shops" },
  { name: "Categories", href: "/categories" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "UK Site", href: "https://upfrica.co.uk", external: true },
  { name: "Careers", href: "/careers", external: true },
];

const NavTitle = ({ isOpen }) => {
  return (
    // <div
    //   className={`absolute  left-0 w-full  bg-white z-50 top-40 transition-all duration-200 ease-in-out transform
    //     ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
    //     2xl:hidden`}
    // >
    //   <ul className="flex flex-col text-black py-4 ">
    //     {navItems.map((item, index) => (
    //       <li
    //         key={index}
    //         className="nav-item border-t border-b border-gray-200 px-4 py-3 text-left text-base"
    //       >
    //         {item.external ? (
    //           <a
    //             href={item.href}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="nav-link"
    //           >
    //             {item.name}
    //           </a>
    //         ) : (
    //           <Link href={item.href} className="nav-link">
    //             {item.name}
    //           </Link>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>

    <>
      {/* BACKDROP */}
      <div
        className={`fixed 2xl:hidden inset-0 bg-white transition-opacity duration-300 ease-in-out top-10 z-40 ${
          isOpen ? "opacity-80 visible" : "opacity-0 invisible"
        }`}
      />

      {/* MENU */}
      <div
        className={`absolute left-0 w-full  bg-white z-50 top-24 lg:top-40 transition-all duration-300 ease-in-out transform 
          ${isOpen ? "bg-opacity-100 " : "-translate-y-full opacity-0"} 
          2xl:hidden`}
      >
        <ul className="flex flex-col text-black py-4">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="nav-item border-t border-b border-gray-200 px-4 py-3 text-left text-base"
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  {item.name}
                </a>
              ) : (
                <Link href={item.href} className="nav-link">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavTitle;
