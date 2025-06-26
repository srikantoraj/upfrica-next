'use client';
import React from 'react';
import { LuMenu } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { clearToggle } from '../app/store/slices/toggleSlice';
import classNames from 'classnames';
import { useAuth } from '@/contexts/AuthContext';

const HeaderControls = () => {
  const dispatch = useDispatch();
  const toggle = useSelector((state) => state.toggle.toggle);
  const { user } = useAuth();

  const handleToggleClick = () => {
    dispatch(clearToggle());
  };

  const accountTypeLabels = {
    buyer: 'Buyer',
    seller_private: 'Seller (Private)',
    seller_business: 'Seller (Business)',
    agent: 'Sourcing Agent',
  };

  return (
    <div className={`my-2 ${toggle ? 'hidden' : 'block'}`}>
      <button
        onClick={handleToggleClick}
        className="p-2 rounded hover:bg-gray-100 transition"
        aria-label="Toggle Sidebar"
      >
        <div className="flex justify-start items-center font-medium">
          <LuMenu className="w-6 h-6 text-gray-700 mr-2" />
          Dashboard
        </div>
      </button>

      {/* ✅ Account type badges */}
      {user?.account_type && (
        <div className="flex flex-wrap gap-1 mt-2 ml-2">
          {[user.account_type].map((role) => (
            <span
              key={role}
              className={classNames('text-[10px] font-medium px-2 py-0.5 rounded', {
                'bg-green-100 text-green-800': role === 'buyer',
                'bg-yellow-100 text-yellow-800': role === 'seller_private',
                'bg-blue-100 text-blue-800': role === 'seller_business',
                'bg-purple-100 text-purple-800': role === 'agent',
              })}
            >
              {accountTypeLabels[role] || role}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderControls;