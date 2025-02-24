import { IoMdSearch } from "react-icons/io";
import { FaImage } from "react-icons/fa";

const SearchBox = () => {
    return (
        <div className="relative w-full md:w-[40vw]  xl:w-[55vw]">
            <input
                type="text"
                placeholder="Search for products or images..."
                className="w-full pl-4 pr-28 py-[7px] mt-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                    <IoMdSearch className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <FaImage className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default SearchBox;
