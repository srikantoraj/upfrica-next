
import React from 'react';
import ProductTablePage from '../phoenixcoded/page';
import HeaderControls from '@/components/HeaderControls';

const Dashboard = () => {
  return (
    <div className='w-full py-10'>
      <HeaderControls />
      <ProductTablePage />
    </div>
  );
};

export default Dashboard