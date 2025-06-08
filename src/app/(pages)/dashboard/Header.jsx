// src/app/(pages)/dashboard/Header.jsx
export default function Header() {
    return (
      <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">Upfrica Admin</div>
  
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
  
          <button className="relative">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.4 18 14V11a6 6 0 10-12 0v3c0 .4-.21.79-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
  
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </header>
    );
  }