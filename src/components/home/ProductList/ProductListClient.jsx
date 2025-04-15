// /app/components/ProductListClient.jsx
'use client';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import { setExchangeRates } from '@/app/store/slices/exchangeRatesSlice';
import { IoIosArrowRoundForward } from 'react-icons/io';

export default function ProductListClient({ title, productsData }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (productsData && productsData.exchange_rates) {
            dispatch(setExchangeRates(productsData.exchange_rates));
        }
    }, [productsData, dispatch]);

    return (
        <div className="container bg-white  py-5 md:py-10 font-sans ">
            {/* Header */}
            <div className="mb-8">
                
                <div className="flex gap-4 pb-4">
                    <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">{title}</h1>
                    <IoIosArrowRoundForward className="h-10 w-10 text-gray-700" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-3 lg:gap-5">
                {productsData?.results && productsData.results.length > 0 ? (
                    productsData.results.slice(0, 20).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}
