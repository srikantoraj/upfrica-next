import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import React from 'react';

const layout = ({children}) => {
    return (
        <div>
            <Header></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default layout;