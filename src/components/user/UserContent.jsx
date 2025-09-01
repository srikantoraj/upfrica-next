import React from "react";
import Link from "next/link";

const UserContent = () => {
  // Sample data array
  const data = [
    {
      id: 1,
      createdAt: "2023-09-01",
      fullName: "John Doe",
      username: "johndoe",
      country: "USA",
      email: "john@example.com",
      accounts: 3,
      connectedAccounts: 2,
    },
    {
      id: 2,
      createdAt: "2023-09-02",
      fullName: "Jane Smith",
      username: "janesmith",
      country: "Canada",
      email: "jane@example.com",
      accounts: 5,
      connectedAccounts: 3,
    },
    // ... more objects
  ];

  return (
    <div className="bg-white shadow-2xl p-4 sm:p-6 md:p-8 rounded-md container mx-auto mt-4">
      {/* Header section: Title + Search + New user button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Users</h2>

        {/* Right side: Search & Button in a row for larger screens, column for small */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search box wrapper */}
          <div className="relative border rounded-md bg-white w-full sm:w-auto">
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300 pl-2">
                {/* Search icon (SVG or React Icons) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 border-none"
                type="text"
                id="search"
                placeholder="Search users..."
              />
            </div>
          </div>

          {/* New user button */}
          <button className="text-white font-bold bg-[#1976D2] px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto">
            New user
          </button>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Table section with horizontal scroll on small devices */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-sm sm:text-base bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                ID
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Created At
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Full Name
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Username
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Country
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Email
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Accounts
              </th>
              <th className="text-left py-2 px-4 hover:text-blue-500 whitespace-nowrap">
                Connected
              </th>
              <th className="text-left py-2 px-4"></th>
              <th className="text-left py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.createdAt}</td>
                <td className="py-3 px-4">{item.fullName}</td>
                <td className="py-3 px-4">{item.username}</td>
                <td className="py-3 px-4 whitespace-nowrap">{item.country}</td>
                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.accounts} accounts</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {item.connectedAccounts} connected
                </td>
                <td className="py-3 px-4 text-blue-600 hover:underline">
                  <Link href="/edit">Edit</Link>
                </td>
                <td className="py-3 px-4 text-red-500 hover:underline">
                  Destroy
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserContent;
