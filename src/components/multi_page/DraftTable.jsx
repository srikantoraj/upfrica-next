import DraftRow from "./DraftRow";

export default function DraftTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase">
            <th className="p-2">Select</th>
            <th className="p-2">Edit</th>
            <th className="p-2">Status</th>
            <th className="p-2">Photo</th>
            <th className="p-2">Category</th>
            <th className="p-2">Title</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Format</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Buy It Now</th>
          </tr>
        </thead>
        <tbody>
          <DraftRow />
          {/* You can duplicate DraftRow here for more rows */}
        </tbody>
      </table>
    </div>
  );
}
