import React from "react";

const headers = [
  "Select",
  "Edit your listing",
  "Status",
  "Photos",
  "Item category 1",
  "Title",
  "Custom label (SKU)",
  "Format",
  "Available quantity",
  "Price",
  "Item cost",
  "Sales tax",
  "Fees",
  "Net proceeds",
  "Promotions",
  "Sold",
  "Unsold",
  "Views",
  "Watchers",
  "Start date",
  "End date",
  "Duration",
  "Time left",
  "Actions",
];

// Dummy row data (just an example row)
const rowData = [
  {
    select: "✔",
    edit: "Edit",
    status: "Active",
    photos: "📷",
    category: "Electronics",
    title: "Smartphone",
    sku: "SKU123",
    format: "Fixed Price",
    qty: 10,
    price: "$299",
    cost: "$200",
    tax: "$15",
    fees: "$20",
    proceeds: "$264",
    promo: "None",
    sold: 5,
    unsold: 2,
    views: 120,
    watchers: 3,
    start: "2025-04-01",
    end: "2025-04-30",
    duration: "30 days",
    left: "10d left",
    actions: "Action",
  },
  // Add more rows here if needed
];

export default function FullDraftTable() {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-left text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase">
            {headers.map((header, index) => (
              <th key={index} className="p-2 whitespace-nowrap border-l border-r border-gray-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-l border-r border-gray-300"
            >
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex} className="p-2 whitespace-nowrap">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
