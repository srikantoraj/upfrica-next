import OrderSection from '@/components/order/OrderSection';
import ProfileCard from '@/components/order/ProfileCard';
import React from 'react';

const OrderPage = () => {
    return (
        <div className='bg-gray-50'>
            <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 py-5 gap-10'>
                <div className='col-span-1'>
                    <ProfileCard />
                </div>
                <div className='col-span-3'>
                    <OrderSection />
                </div>
            </div>
        </div>
    );
};

export default OrderPage;