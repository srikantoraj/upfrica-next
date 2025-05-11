
import RecentOrders from '@/components/overview/RecentOrders';
import SalesCardGroup from '@/components/overview/SalesCardGroup';
import SellerOrdersData from '@/components/overview/SellerOrdersData';
import React from 'react';

const page = () => {
    return (
        <div className='my-4 space-y-4'>
            <SalesCardGroup />
            <SellerOrdersData />
            <RecentOrders />

        </div>
    );
};

export default page;