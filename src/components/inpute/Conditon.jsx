import React, { useState, useRef, useEffect } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import useCategories from "../api/data";

const Conditon = ({ formik }) => {
    const { conditions, loading, error } = useCategories();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectCondition = (condition) => {
        formik.setFieldValue("condition_id", condition.id);
        formik.setFieldValue("condition_name", condition.name);
        setDropdownOpen(false);
    };

    return (
        <div className="py-4" ref={wrapperRef}>
            <h2 className="text-2xl font-bold mb-2">*Condition</h2>
            <p className="mb-2 text-gray-600">
                Use keywords people would search for when looking for your item.
                Include details such as colour, size, brand, and model.
            </p>
            <hr className="border-gray-300 mb-4" />
            <div className="relative flex items-center">
                <input
                    id="condition_name"
                    name="condition_name"
                    type="text"
                    placeholder="Select Condition"
                    value={formik.values.condition_name || ""}
                    readOnly
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-full border rounded-md py-2 px-3 cursor-pointer"
                />
                <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="ml-2 focus:outline-none"
                >
                    {dropdownOpen ? (
                        <MdOutlineArrowDropUp size={24} />
                    ) : (
                        <MdOutlineArrowDropDown size={24} />
                    )}
                </button>
            </div>
            {dropdownOpen && (
                <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
                    {loading ? (
                        <div className="p-3 text-gray-500">Loading...</div>
                    ) : error ? (
                        <div className="p-3 text-red-500">{error}</div>
                    ) : (
                        <ul>
                            {conditions && conditions.length > 0 ? (
                                conditions.map((condition) => (
                                    <li
                                        key={condition.id}
                                        onClick={() => handleSelectCondition(condition)}
                                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {condition.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-3 text-gray-500">No conditions found</li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Conditon;
