import React from 'react';

const Selling = () => {
    return (
        <div className='container mx-auto grid md:grid-cols-3 py-10 px-4 bg-black text-white rounded-[40px] my-1 space-y-4'>
            <div className='col-span-2 space-y-2'>
                <h1 className='text-xl lg:text-4xl font-bold'>Selling locally? It's a free listing too!</h1>
                <p className='text-lg md:text-xl font-bold'>No sale No Fee. From Electronic and tech to fashion, make money across categories.</p>
            </div>
            <div className='col-span-1'>
                <button className='font-bold text-black bg-white px-8 py-2 rounded-full'>Start selling</button>
            </div>
        </div>
    );
};

export default Selling;