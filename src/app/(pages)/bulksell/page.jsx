import { FaRegEdit, FaImage, FaSortUp, FaSortDown } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

const headers = [
  { label: "", width: "64px" }, // Checkbox
  { label: "Edit", width: "68px" },
  { label: "Status", width: "69px" },
  { label: "Photos", width: "86px" },
  { label: "Item category 1", width: "144px" },
  { label: "Title", width: "324px" },
  { label: "Custom label (SKU)", width: "132px" },
  { label: "Format", width: "134px" },
  { label: "Duration", width: "144px" },
  { label: "Available quantity", width: "136px" },
  { label: "Buy it now", width: "145px" },
  { label: "Starting bid", width: "128px" },
  { label: "Offers", width: "128px" },
  { label: "Dispatch time", width: "185px" },
  { label: "VAT", width: "128px" },
  { label: "Start time", width: "144px" },
  { label: "Condition", width: "150px" },
  { label: "Postage details", width: "144px" },
  { label: "Item specifics", width: "132px" },
  { label: "Item description", width: "144px" },
  { label: "Sell it faster", width: "130px" },
  { label: "Last modified", width: "144px" },
  { label: "Hazard information", width: "144px" },
  { label: "Selling fees", width: "148px" },
];

export default function BulkGridTable() {
  return (
    <div className="overflow-auto border rounded-lg shadow max-w-full container">
      <table className="min-w-[3400px] w-full border-collapse">
        <thead className="sticky top-0 bg-gray-100 z-10 text-xs text-gray-800">
          <tr>
            {headers.map((head, idx) => (
              <th
                key={idx}
                className="border-b px-2 py-3 font-medium text-left whitespace-nowrap"
                style={{ width: head.width, minWidth: head.width }}
              >
                <div className="flex items-center justify-between">
                  {head.label || <input type="checkbox" />}
                  {head.label && (
                    <span className="ml-1 text-gray-400">
                      <FaSortUp className="-mb-1" />
                      <FaSortDown className="-mt-1" />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50 text-sm">
            <td className="px-2 py-2">
              <input type="checkbox" />
            </td>
            <td className="px-2 py-2 text-blue-600">
              <FaRegEdit />
            </td>
            <td className="px-2 py-2 text-yellow-500">
              <FiAlertCircle />
            </td>
            <td className="px-2 py-2">
              <img
                src="https://pics.ebaystatic.com/aw/pics/stockimage1.jpg"
                className="w-10 h-10 object-cover"
                alt="product"
              />
            </td>
            <td className="px-2 py-2">Antiques &gt; Lighting</td>
            <td className="px-2 py-2">
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                placeholder="Item title"
              />
            </td>
            <td className="px-2 py-2 text-gray-400">N/A</td>
            <td className="px-2 py-2">
              <select className="border rounded px-2 py-1 w-full">
                <option>Buy it now</option>
                <option>Auction</option>
              </select>
            </td>
            <td className="px-2 py-2">7 Days</td>
            <td className="px-2 py-2 text-right">1</td>
            <td className="px-2 py-2">£49.99</td>
            <td className="px-2 py-2">£39.99</td>
            <td className="px-2 py-2">Yes</td>
            <td className="px-2 py-2">2 Days</td>
            <td className="px-2 py-2">N/A</td>
            <td className="px-2 py-2">Today</td>
            <td className="px-2 py-2">Used</td>
            <td className="px-2 py-2">UK Post</td>
            <td className="px-2 py-2">Size, Brand</td>
            <td className="px-2 py-2">Edit</td>
            <td className="px-2 py-2">Yes</td>
            <td className="px-2 py-2">Now</td>
            <td className="px-2 py-2">No</td>
            <td className="px-2 py-2 text-right">£0.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
