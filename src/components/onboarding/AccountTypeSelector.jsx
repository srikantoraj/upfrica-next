"use client";

import { motion } from "framer-motion";
import classNames from "classnames";

const accountTypes = [
  {
    key: "buyer",
    label: "Buy on Upfrica",
    description: "Find and purchase products from African sellers worldwide.",
    color: "bg-green-100 border-green-300",
  },
  {
    key: "seller_private",
    label: "Sell as Individual",
    description: "List products, manage orders, and earn from home.",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    key: "seller_business",
    label: "Sell as Business",
    description: "Grow your business with advanced tools and storefront.",
    color: "bg-blue-100 border-blue-300",
  },
  {
    key: "agent",
    label: "Sourcing Agent",
    description:
      "Find items for buyers, coordinate pickups, and earn commissions.",
    color: "bg-purple-100 border-purple-300",
  },
  {
    key: "affiliate",
    label: "Affiliate Marketer",
    description: "Promote products and earn commissions for each sale.",
    color: "bg-pink-100 border-pink-300",
  },
];

export default function AccountTypeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {accountTypes.map((type) => (
        <motion.div
          key={type.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(type.key)}
          className={classNames(
            "p-5 border-2 rounded-xl cursor-pointer shadow-sm transition-all",
            selected === type.key
              ? `ring-2 ring-purple-500 ${type.color}`
              : "border-gray-200 bg-white",
          )}
        >
          <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
          <p className="text-sm text-gray-600 mt-2">{type.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
