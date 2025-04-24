import { useState } from "react";
import { ChevronDown, Plus, MoreVertical, Check } from "lucide-react";

export default function DomesticPostage() {
  const [selectedRate, setSelectedRate] = useState("None");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRateSelect = (rate) => {
    setSelectedRate(rate);
    setDropdownOpen(false);
  };

  return (
    <div className="">
      <h3 className="text-lg font-semibold mb-1">Domestic postage</h3>
      <p className="text-sm text-gray-600 mb-4">
        For complete seller protection, choose postage with tracking and
        purchase the postage label through eBay.
      </p>

      <div className="mb-4">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Add primary service
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Rate table <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative inline-block w-full max-w-xs">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex justify-between items-center border rounded px-3 py-2 bg-gray-50 text-sm"
            >
              <span>{selectedRate}</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute mt-1 w-full border bg-white shadow rounded z-10"
                role="listbox"
              >
                <div
                  role="option"
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    selectedRate === "None" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleRateSelect("None")}
                >
                  <span>None</span>
                  {selectedRate === "None" && <Check size={16} />}
                </div>
                {/* তুমি চাইলে এখানে আরও অপশন যোগ করতে পারো */}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreVertical size={24} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10"
            >
              <div
                role="menuitem"
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  alert("Create new clicked");
                  setMenuOpen(false);
                }}
              >
                <span>Create new</span>
                <Check size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
