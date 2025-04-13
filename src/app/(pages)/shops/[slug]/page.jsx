'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/home/ProductList/ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { FaArrowRight } from 'react-icons/fa';

const Shops = ({ params }) => {
    const { slug } = params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            try {
                const response = await fetch(
                    `https://media.upfrica.com/api/shops/${slug}/products/`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Assuming the API returns JSON data. If it returns a plain text representation
                // of a JSON object, you might need to parse it with JSON.parse().
                const data = await response.json();
                setProducts(data?.results || []);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug]);

    if (loading) {
        // Render a few skeleton cards during loading
        return (
            <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p>There was a problem loading the products. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="px-4">
            <div className="flex flex-col items-center py-20 mx-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2">
                    Browse Online Shops
                </h1>
                <p className="text-base lg:text-lg text-center text-gray-700 mb-4">
                    Variety of Shops in Ghana, Nigeria and more selling at low prices.
                </p>
                <p className="text-base lg:text-lg text-center text-gray-700">
                    Have something to sell?{' '}
                    <span className="font-bold underline">Sell on Upfrica</span>
                </p>
            </div>

            <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shops;
