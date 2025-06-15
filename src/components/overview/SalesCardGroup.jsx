import React from "react";

const SalesCardGroup = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 shadow-md bg-white animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-300 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-300 rounded mb-1" />
            <div className="w-full h-2 bg-gray-300 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null; // 🔒 Prevent crash when stats is undefined/null

  const { daily, monthly, all_time } = stats;
  const itemsArray = [
    daily.items_sold,
    monthly.items_sold,
    all_time.items_sold,
  ];
  const maxItems = Math.max(...itemsArray, 1);

  const cards = [
    { title: "Daily Sales", data: daily },
    { title: "Monthly Sales", data: monthly },
    { title: "All Time Sales", data: all_time },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ title, data }, idx) => {
        const amount = `₵ ${(data.sales_cents / 100).toLocaleString()}`;
        const percent =
          data.growth_pct !== null ? `${data.growth_pct}%` : "--";
        const message =
          data.items_sold > 0
            ? `${data.items_sold} items sold`
            : "No items sold";
        const progress = Math.round((data.items_sold / maxItems) * 100);

        return (
          <div
            key={idx}
            className="rounded-xl p-4 shadow-md bg-white"
          >
            <h4 className="text-sm font-medium text-black">{title}</h4>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-black">{amount}</p>
              <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded">
                {percent}
              </span>
            </div>
            <p className="text-sm mt-1 text-black">{message}</p>
            <div className="w-full h-2 mt-3 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-400 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesCardGroup;