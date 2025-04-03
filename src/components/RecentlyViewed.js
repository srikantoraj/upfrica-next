// components/RecentlyViewed.js
'use client'
import { useEffect } from 'react';

const RECENTLY_VIEWED_KEY = 'upfricaRecentlyViewed';

const RecentlyViewed = ({ product }) => {
    useEffect(() => {
        if (typeof window !== 'undefined' && product) {
            // Retrieve the existing list from localStorage
            const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
            let viewedItems = stored ? JSON.parse(stored) : [];

            // Remove any duplicate of the current product
            viewedItems = viewedItems.filter(item => item.id !== product.id);

            // Add current product at the beginning
            viewedItems.unshift(product);

            // Limit the list to 10 items (or any preferred number)
            if (viewedItems.length > 10) {
                viewedItems = viewedItems.slice(0, 10);
            }

            // Save the updated list back to localStorage
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewedItems));
        }
    }, [product]);

    return null;
};

export default RecentlyViewed;
