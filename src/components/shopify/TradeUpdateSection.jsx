import React from 'react';
import StartBusinessCTA from './StartBusinessCTA';
import TariffNoticeSection from './TariffNoticeSection';
import DdpLabelsSection from './DdpLabelsSection';
import SidebarNewsletterCTA from './SidebarNewsletterCTA';

const TradeUpdateSection = () => {
    return (
        <div className='container grid lg:grid-cols-4 py-10 gap-5 px-6'>
            {/* col one  */}
            <div className='col-span-1 hidden lg:block'>
                <StartBusinessCTA/>
            </div>
            <div className='col-span-2'>
                <TariffNoticeSection/>
                <DdpLabelsSection/>
            </div>
            <div className='col-span-1 hidden lg:block'>
                <SidebarNewsletterCTA/>
            </div>
            
        </div>
    );
};

export default TradeUpdateSection;