import { FaImage } from "react-icons/fa"; // optional icon
import { SlOptionsVertical } from "react-icons/sl"; // for options icon

const CompleteListing = () => {
  return (
    <div className=" border-b py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Complete your listing</h2>
          <p className="text-sm mt-2 font-semibold">PHOTOS & VIDEO</p>
        </div>
        <button className="flex items-center gap-2 text-sm border px-3 py-1 rounded-full hover:bg-gray-100">
          <SlOptionsVertical className="h-4 w-4" />
          See photo options
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2 max-w-2xl">
        You can add up to 24 photos and a 1-minute video. Buyers want to see all details and angles.{" "}
        <a
          href="#"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Tips for taking pro photos
        </a>
      </p>
    </div>
  );
};

export default CompleteListing;
