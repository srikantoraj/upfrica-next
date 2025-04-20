import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DateSelector from './DateSelector';

export default function Promotions() {
    const [promotionsOpen, setPromotionsOpen] = useState(true);
    const [salesOpen, setSalesOpen] = useState(false);
    const [multiBuyOpen, setMultiBuyOpen] = useState(false);
    const [salesActive, setSalesActive] = useState('yes');
    const [salePrice, setSalePrice] = useState('329.00');
    const [multiBuyActive, setMultiBuyActive] = useState(false);
    const [wholesalePrice, setWholesalePrice] = useState('0.00');
    const [minOrderQty, setMinOrderQty] = useState(1);

    return (
        <>
            {/* <DateSelector /> */}
            <div className="bg-white shadow-md rounded-md mb-4">
                {/* Header */}
                <div className="border-b p-4">
                    <h5 className="text-lg font-semibold mb-0">Promotions</h5>
                </div>

                <div className="p-4">
                    {/* Toggle Promotions */}
                    <div className="flex items-center mb-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={promotionsOpen}
                                onChange={() => setPromotionsOpen(!promotionsOpen)}
                                className="form-checkbox w-5 h-5 text-purple-600 mr-2"
                            />
                            <span className="text-sm font-medium">
                                {promotionsOpen ? 'Opened' : 'Closed'}
                            </span>
                        </label>
                    </div>

                    {promotionsOpen && (
                        <div>
                          
                            <div className="space-y-4">
                                {/* Sales Accordion */}
                                <div>
                                    <button
                                        className="w-full flex justify-between items-center text-lg font-semibold  px-4 py-2 rounded-md"
                                        onClick={() => setSalesOpen(!salesOpen)}
                                    >
                                        <span>Sales</span>
                                        {salesOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                                    </button>
                                    {salesOpen && (
                                        <div className="p-4 border rounded-md mt-2 text-sm text-gray-700">
                                            <p className="text-center mb-3">
                                                Reduce the Item price for a period of time
                                            </p>
                                            <hr className="my-2" />

                                            {/* Activate Sales */}
                                            <div className="mb-4 flex flex-wrap items-center gap-4">
                                                <h5 className="text-base w-full sm:w-auto">Activate Sales?</h5>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="sales"
                                                        value="yes"
                                                        checked={salesActive === 'yes'}
                                                        onChange={() => setSalesActive('yes')}
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="sales"
                                                        value="no"
                                                        checked={salesActive === 'no'}
                                                        onChange={() => setSalesActive('no')}
                                                    />
                                                    No
                                                </label>
                                            </div>

                                            {/* Sales Price */}
                                            <div className="mb-4">
                                                <label className="block mb-1 font-medium">
                                                    Sales Price{' '}
                                                    <span className="text-red-600 text-xs">
                                                        numbers only & must be less than the item price showing above
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={salePrice}
                                                    onChange={(e) => setSalePrice(e.target.value)}
                                                    placeholder="Enter value"
                                                    className="w-full border px-3 py-2 rounded-md"
                                                />
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block mb-1 font-medium">Sales start date</label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value="2023-06-11T23:00:00"
                                                        className="w-full border px-3 py-2 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 font-medium">Sales end date</label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value="2025-04-30T11:00:00"
                                                        className="w-full border px-3 py-2 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Horizontal Divider */}
                                <hr className="border-t-2  border-gray-300 my-4" />

                                {/* Multi-buy Accordion */}
                                <div>
                                    <button
                                        className="w-full flex justify-between items-center text-lg font-semibold  px-4 py-2 rounded-md"
                                        onClick={() => setMultiBuyOpen(!multiBuyOpen)}
                                    >
                                        <span>Multi-buy</span>
                                        {multiBuyOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                                    </button>
                                    {multiBuyOpen && (
                                        <div className="p-4 border rounded-md mt-2 text-sm text-gray-700">
                                            <p className="text-center mb-3">
                                                Offer a discount when buyers purchase more than one item at a time.
                                            </p>
                                            <hr className="my-2" />

                                            {/* Activate Multi-buy */}
                                            <div className="flex items-center mb-4 gap-4">
                                                <h5 className="text-base">Activate multi-buy?</h5>
                                                <input
                                                    type="checkbox"
                                                    checked={multiBuyActive}
                                                    onChange={() => setMultiBuyActive(!multiBuyActive)}
                                                    className="form-checkbox w-5 h-5 text-blue-600"
                                                />
                                            </div>

                                            {/* Price Each */}
                                            <div className="mb-4">
                                                <label className="block mb-1 font-medium">
                                                    Price each{' '}
                                                    <span className="text-red-600 text-xs">
                                                        numbers only & must be less than the standard price showing above
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wholesalePrice}
                                                    onChange={(e) => setWholesalePrice(e.target.value)}
                                                    placeholder="Enter a value"
                                                    className="w-full border px-3 py-2 rounded-md"
                                                />
                                            </div>

                                            {/* Minimum Order Quantity */}
                                            <div className="mb-4">
                                                <label className="block mb-1 font-medium">Minimum Order Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={minOrderQty}
                                                    onChange={(e) => setMinOrderQty(Number(e.target.value))}
                                                    placeholder="e.g: 2"
                                                    className="w-full border px-3 py-2 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
