
import React from 'react';
import ProductList from '@/components/e-commerce/products-list/ProductList';

const Dashboard = () => {
  return (
    <div className='w-full py-10 px-4 space-y-4'>
      <ProductList />
      {/* <h1>dashboard</h1> */}
    </div>
  );
};

export default Dashboard