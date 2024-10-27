import React, { useState } from 'react';
import useCategories from '../api/data';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';

const Conditon = ({ formik }) => {
    const { conditions } = useCategories();
    const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false); // To control condition dropdown
    const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
    return (
        <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">*Condition</h2>
            <p>
                Use keywords people would search for when looking for your item.
                Include details such as colour, size, brand & model.
            </p>
            <hr className="border-gray-300 mb-4" />

            <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
                <input
                    className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3 hover:cursor-pointer"
                    id="condition_id"
                    name="condition_name"
                    placeholder="Search Upfrica BD"
                    value={formik?.values?.condition_name} // Set Formik value
                    onClick={() => setConditionDropdownOpen(!conditionDropdownOpen)} // Toggle dropdown on click
                    onChange={formik.handleChange} // Handle input change
                    readOnly={true} // Input is read-only
                />
                {arrowshowDropdown ? (
                    <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                        <MdOutlineArrowDropUp />
                    </button>
                ) : (
                    <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                        <MdOutlineArrowDropDown />
                    </button>
                )}

                {/* Dropdown list */}
                {conditionDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                        <ul className="py-2">
                            {conditions.length > 0 ? (
                                conditions.map((condision) => (
                                    <li
                                        key={condision.id} // Assuming each category has an id
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            formik.setFieldValue("condition_id", condision.id); // Set the selected value to Formik field
                                            formik.setFieldValue("condition_name", condision.name); // Set the selected value to Formik field
                                            setConditionDropdownOpen(false); // Hide dropdown after selection
                                        }}
                                    >
                                        {condision.name}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-500">Loading...</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Conditon;