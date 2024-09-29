// src/components/NavSection.tsx

import Link from "next/link";



const Navbar = () => {
  const datas = [
    { title: "Home", id: 1 },
    { title: "Browse", id: 2 },
    { title: "Deals", id: 3 },
    { title: "Shops", id: 4 },
    { title: "Categories", id: 5 },
    { title: "How It Works", id: 6 },
    { title: "UK Site", id: 7 },
  ];

  return (
    <div className="hidden lg:flex justify-center py-4 bg-white">
      <ul className="text-base font-bold flex gap-6 tracking-wide text-gray-600">
        {datas.map((data) => (
          <li key={data.id} className="hover:text-purple-500">
            <Link href={`/drafPage/${data.id}`} legacyBehavior>
              <a>{data.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
