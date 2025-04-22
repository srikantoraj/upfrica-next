
'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DateSelector from './DateSelector';

export default function Promotions({ formik }) {
    // collapse state mirrors the formik “yes”/“no” flags:
    const [salesOpen, setSalesOpen] = useState(formik.values.on_sales === 'yes');
    const [multiBuyOpen, setMultiBuyOpen] = useState(
        formik.values.multi_buy === 'yes'
    );

    // keep collapse panels in sync if parent formik.initialValues come in “yes”
    useEffect(() => {
        setSalesOpen(formik.values.on_sales === 'yes');
    }, [formik.values.on_sales]);

    useEffect(() => {
        setMultiBuyOpen(formik.values.multi_buy === 'yes');
    }, [formik.values.multi_buy]);

    const handleAddTier = () =>
        formik.setFieldValue('multi_buy_tiers', [
            ...formik.values.multi_buy_tiers,
            { min_quantity: '', price_each: '' },
        ]);

    const handleRemoveTier = idx => {
        const updated = [...formik.values.multi_buy_tiers];
        updated.splice(idx, 1);
        formik.setFieldValue('multi_buy_tiers', updated);
    };

    return (
        <div className="bg-white shadow-md rounded-md mb-4">
            <div className="border-b p-4">
                <h5 className="text-lg font-semibold mb-0">
                    Promotions (On Sale & Multi‑Buy)
                </h5>
            </div>

            <div className="p-4 space-y-4">
                {/* ===== Sales Section ===== */}
                <div className="border rounded-md">
                    <div className="flex items-center justify-between px-4 py-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="on_sales"
                                checked={formik.values.on_sales === 'yes'}
                                onChange={e => {
                                    const yes = e.target.checked ? 'yes' : 'no';
                                    formik.setFieldValue('on_sales', yes);
                                }}
                                className="form-checkbox w-5 h-5 text-violet-700 mr-2 rounded"
                            />
                            <span className="text-lg font-semibold">Sales</span>
                        </label>
                        <button
                            type="button"
                            disabled={formik.values.on_sales !== 'yes'}
                            onClick={() =>
                                formik.values.on_sales === 'yes' && setSalesOpen(!salesOpen)
                            }
                            className={`flex items-center ${formik.values.on_sales === 'yes'
                                    ? ''
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {salesOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>

                    {formik.values.on_sales === 'yes' && salesOpen && (
                        <div className="p-4 text-sm text-gray-700">
                            <p className="text-center mb-3">
                                Reduce the item price for a period of time.
                            </p>
                            <hr className="my-2" />

                            <div className="mb-4">
                                <label className="block mb-1 font-medium">
                                    Sales Price{' '}
                                    <span className="text-red-600 text-xs">
                                        (numbers only &amp; must be less than the item price above)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="sale_price_cents"
                                    value={formik.values.sale_price_cents}
                                    onChange={formik.handleChange}
                                    placeholder="Enter value"
                                    className="w-full border px-3 py-2 rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Sales start date
                                    </label>
                                    <DateSelector name="sale_start_date" formik={formik} />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Sales end date
                                    </label>
                                    <DateSelector name="sale_end_date" formik={formik} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <hr className="border-t-2 border-gray-300" />

                {/* ===== Multi‑Buy Section ===== */}
                <div className="border rounded-md">
                    <div className="flex items-center justify-between px-4 py-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="multi_buy"
                                checked={formik.values.multi_buy === 'yes'}
                                onChange={e => {
                                    const yes = e.target.checked ? 'yes' : 'no';
                                    formik.setFieldValue('multi_buy', yes);
                                }}
                                className="form-checkbox w-5 h-5 text-violet-700 mr-2 rounded"
                            />
                            <span className="text-lg font-semibold">Multi‑Buy</span>
                        </label>
                        <button
                            type="button"
                            disabled={formik.values.multi_buy !== 'yes'}
                            onClick={() =>
                                formik.values.multi_buy === 'yes' &&
                                setMultiBuyOpen(!multiBuyOpen)
                            }
                            className={`flex items-center ${formik.values.multi_buy === 'yes'
                                    ? ''
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {multiBuyOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>

                    {formik.values.multi_buy === 'yes' && multiBuyOpen && (
                        <div className="p-4 text-sm text-gray-700">
                            <p className="text-center mb-3">
                                Offer a discount when buyers purchase more than one item.
                            </p>
                            <hr className="my-2" />

                            {formik.values.multi_buy_tiers.map((tier, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
                                >
                                    <div>
                                        <label className="block mb-1 font-medium">
                                            Min Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name={`multi_buy_tiers[${idx}].min_quantity`}
                                            min="1"
                                            placeholder="e.g. 2"
                                            value={tier.min_quantity}
                                            onChange={formik.handleChange}
                                            className="w-full border px-3 py-2 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">
                                            Price Each{' '}
                                            <span className="text-red-600 text-xs">
                                                (must be less than standard price)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name={`multi_buy_tiers[${idx}].price_each`}
                                            placeholder="e.g. 9.99"
                                            value={tier.price_each}
                                            onChange={formik.handleChange}
                                            className="w-full border px-3 py-2 rounded-md"
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTier(idx)}
                                            className="px-3 py-2 border rounded-md hover:bg-gray-100"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddTier}
                                            className="px-3 py-2 border rounded-md hover:bg-gray-100"
                                        >
                                            Add Tier
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {formik.values.multi_buy_tiers.length === 0 && (
                                <button
                                    type="button"
                                    onClick={handleAddTier}
                                    className="px-4 py-2 bg-violet-700 text-white rounded-md"
                                >
                                    Add First Tier
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

