"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { IoMdSearch } from 'react-icons/io';
import UserName from './UserName';
import UserMenu from './UserMenu';

const ShopingCart = () => {
    const [hasProductsInCart, setHasProductsInCart] = useState(false);
    const [basketCount, setBasketCount] = useState(0);

    useEffect(() => {
        // লোকাল স্টোরেজ থেকে 'basket' নামক প্রোডাক্টগুলি বের করা হচ্ছে
        const basket = JSON.parse(localStorage.getItem('basket') || '[]');

        // চেক করা হচ্ছে যে 'basket' এ কোনো প্রোডাক্ট আছে কিনা
        if (basket.length > 0) {
            setHasProductsInCart(true); // যদি প্রোডাক্ট থাকে, তাহলে স্টেট true হবে
            setBasketCount(basket.length); // প্রোডাক্টের সংখ্যা সেট করা হচ্ছে
        } else {
            setHasProductsInCart(false); // না থাকলে false
        }
    }, []);

    return (
        <div>
             {hasProductsInCart && (
                <Link href='/cart'>

                    <div className="relative flex items-center mx-4">
                        <FaShoppingCart className="h-6 lg:h-8 w-6 lg:w-8 text-purple-500" />

                        {/* যদি প্রোডাক্ট সংখ্যা 0 এর বেশি হয়, তাহলে ব্যাজ দেখান */}
                        {basketCount > 0 && (
                            <span className="absolute top-[-8px] right-[-12px] bg-purple-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                {basketCount}
                            </span>
                        )}
                    </div>
                </Link>
            )}
        </div>
    );
}

export default ShopingCart;