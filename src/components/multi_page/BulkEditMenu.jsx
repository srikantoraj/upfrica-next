export default function BulkEditMenu() {
  const items = [
    "Auto relist",
    "Available quantity",
    "Buy it now",
    "Charity",
    "Duration",
  ];

  return (
    <div className="relative inline-block">
      <button className="btn bg-gray-100 px-3 py-1 text-sm rounded shadow">
        Bulk edit ▼
      </button>
      {/* <div className="absolute mt-2 bg-white border rounded shadow-lg z-10 w-48">
          {items.map((item) => (
            <div key={item} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
              {item}
            </div>
          ))}
        </div> */}
    </div>
  );
}
