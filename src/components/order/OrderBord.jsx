"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { FaTimesCircle, FaUndoAlt } from 'react-icons/fa';

const OrderBord = () => {
    const pathname = usePathname();

    const links = [
        { href: '/order', label: 'All Orders', icon: BiSolidShoppingBag },
        { href: '/your-sales', label: 'Your Sales', icon: BiSolidShoppingBag },
        { href: '/orders', label: 'Orders', icon: BiSolidShoppingBag },
        { href: '/cancellations', label: 'Cancellations', icon: FaTimesCircle },
        { href: '/returns', label: 'Returns', icon: FaUndoAlt },
    ];

    return (
        <div>
            <ul className='flex justify-around items-center text-base font-bold border-t border-b  bg-white shadow-xl'>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link href={link.href} key={link.href}>
                            <li className={`flex items-center h-10 cursor-pointer px-4 ${isActive ? 'text-purple-600  border-b-4 border-purple-600 bottom-0' : 'text-[#747579] hover:text-purple-600'}`}>
                                <link.icon className='mr-2' /> {link.label}
                            </li>
                         </Link>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrderBord;