"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiMessageCircle,
  FiShoppingCart,
  FiBox,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useSelector } from "react-redux";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/dashboard/all-products", label: "Products", icon: FiBox },
  { href: "/dashboard/chat", label: "Chat", icon: FiMessageCircle },
  { href: "/dashboard/orders", label: "Orders", icon: FiShoppingCart },
  { href: "/dashboard/stats", label: "Statistic", icon: FiBarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: FiSettings },
  { href: "/logout", label: "Logout", icon: FiLogOut },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-1/6 bg-white p-6 border-r border-gray-200 flex flex-col justify-between">
      <div>
        <Link href="/" className="flex items-center mb-10">
          <img
            src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark_170x-94d438d62a4c6b2c2c70fe1084c008f4584357ed2847dac5fc38818a0de6459d.webp"
            alt="Upfrica Logo"
            className="h-12"
          />
        </Link>
        <nav className="space-y-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-4 py-2 rounded
                  ${
                    active
                      ? "bg-purple-200 text-purple-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <Icon className="mr-2" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg">
        <p className="text-sm mb-3 text-gray-700">
          Hi {user?.username}, upgrade your account for more features!
        </p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Learn more
        </button>
      </div>
    </aside>
  );
}

// // components/Sidebar.js
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// const groups = [
//     {
//         title: 'Navigation',
//         items: [
//             { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
//             { label: 'Layouts', href: '/layouts', icon: '📐' },
//         ],
//     },
//     {
//         title: 'Widget',
//         items: [
//             { label: 'Statistics', href: '/statistics', icon: '📊' },
//             { label: 'User', href: '/user', icon: '👤' },
//             { label: 'Data', href: '/data', icon: '💾' },
//             { label: 'Chart', href: '/chart', icon: '📈' },
//         ],
//     },
//     {
//         title: 'Application',
//         items: [
//             { label: 'Calendar', href: '/calendar', icon: '📅' },
//             { label: 'Chat', href: '/chat', icon: '💬' },
//             { label: 'Gallery', href: '/gallery', icon: '🖼️' },
//             {
//                 label: 'Ecommerce', href: '#', icon: '🛒', children: [
//                     { label: 'Product List', href: '/products' },
//                     { label: 'Product Detail', href: '/products/1' },
//                 ]
//             },
//         ],
//     },
// ];

// export default function Sidebar() {
//     const router = useRouter();
//     return (
//         <aside className="w-64 h-screen bg-white border-r flex flex-col">
//             <div className="p-4 flex items-center space-x-2 border-b">
//                 <img src="/logo.png" alt="Logo" className="h-6 w-6" />
//                 <span className="font-bold text-lg">Light able</span>
//             </div>

//             <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
//                 {groups.map((g) => (
//                     <div key={g.title}>
//                         <h6 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
//                             {g.title}
//                         </h6>
//                         <ul className="space-y-1">
//                             {g.items.map((it) => (
//                                 <li key={it.label}>
//                                     {!it.children ? (
//                                         <Link href={it.href}>
//                                             <span
//                                                 className={`flex items-center px-2 py-2 text-sm rounded hover:bg-gray-100 ${router.pathname === it.href
//                                                         ? 'bg-gray-200 font-medium'
//                                                         : 'text-gray-700'
//                                                     }`}
//                                             >
//                                                 <span className="mr-3">{it.icon}</span>
//                                                 {it.label}
//                                             </span>
//                                         </Link>
//                                     ) : (
//                                         <details className="group">
//                                             <summary
//                                                 className="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer
//                           group-open:bg-gray-200"
//                                             >
//                                                 <span className="mr-3">{it.icon}</span>
//                                                 {it.label}
//                                             </summary>
//                                             <ul className="ml-8 mt-1 space-y-1">
//                                                 {it.children.map((child) => (
//                                                     <li key={child.label}>
//                                                         <Link href={child.href}>
//                                                             <span
//                                                                 className={`block px-2 py-1 text-sm rounded hover:bg-gray-100 ${router.pathname === child.href
//                                                                         ? 'bg-gray-200 font-medium'
//                                                                         : 'text-gray-600'
//                                                                     }`}
//                                                             >
//                                                                 {child.label}
//                                                             </span>
//                                                         </Link>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </details>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))}
//             </nav>

//             <div className="p-4 border-t flex items-center space-x-3">
//                 <img
//                     src="/avatar.png"
//                     alt="User avatar"
//                     className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div>
//                     <div className="font-medium">John Smith</div>
//                     <div className="text-xs text-gray-500">Administrator</div>
//                 </div>
//             </div>
//         </aside>
//     );
// }
