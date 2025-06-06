
import Link from "next/link";

const Navbar = () => {
  const datas = [
    { title: "Home", id: 1, url: "/" },
    { title: "Browse", id: 2, url: "/browse" },
    { title: "Deals", id: 3, url: "/todays-deals" },
    { title: "Shops", id: 4, url: "/shops" },
    { title: "Categories", id: 5, url: "/categories" },
    { title: "Help", id: 6, url: "/help" },
    { title: "UK Site", id: 7, url: "/uk-site" },
    { title: "Careers", id: 7, url: "/careers" },
  ];

  return (
    <div className="hidden lg:flex justify-center py-4 border-t border-b">
      <ul className=" text-base font-medium flex gap-6 tracking-wide text-gray-800">
        {datas.map((data) => (
          <li key={data.id} className="hover:text-purple-500">
            <Link href={data.url} >
              {data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
