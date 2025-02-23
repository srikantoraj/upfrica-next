import Link from 'next/link';
import React from 'react';

const Selling = ({color}) => {
    return (
        <div className={`container mx-auto grid md:grid-cols-3 py-10 md:py-16 px-4 text-white rounded-[40px] my-1 space-y-4 ${
            color  ? "bg-[#0A8800]" : "bg-black"
        }`}>
            <div className='col-span-2 space-y-2'>
                <h1 className='text-xl lg:text-4xl font-bold'>Selling locally? It's a free listing too!</h1>
                <p className='text-lg md:text-xl font-bold'>No sale No Fee. From Electronic and tech to fashion, make money across categories.</p>
            </div>
            <div className='col-span-1'>
                <Link href={'/products/new'}>
                <button className='font-bold text-black bg-white px-8 py-2 rounded-full'>Start selling</button>
                </Link>
            </div>
        </div>
    );
};

export default Selling;