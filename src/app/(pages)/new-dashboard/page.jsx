
import React from 'react';
import ProductTablePage from '../phoenixcoded/page';
import HeaderControls from '@/components/HeaderControls';
import Analytics from '@/components/analytics/Analytics';

const Dashboard = () => {
  return (
    <div className='w-full py-10 px-4 space-y-4'>
      {/* <HeaderControls /> */}
      <ProductTablePage />
      {/* <Analytics /> */}
    </div>
  );
};

export default Dashboard