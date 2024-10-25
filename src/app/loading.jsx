import Loading from '@/components/ui/Loading';
import React from 'react';

const loading = () => {
    return (
        <div className="h-screen flex justify-center  items-center">
            <Loading/>
        </div>
    );
};

export default loading;