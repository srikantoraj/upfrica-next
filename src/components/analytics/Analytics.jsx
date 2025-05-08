import React from 'react';
import SalesCardGroup from './SalesCardGroup.jsx';
import AnalyticsSection from './AnalyticsSection.jsx';
import SocialCardGroup from './SocialCardGroup.jsx';
import UserFeedbackSection from './UserFeedbackSection.jsx';


const Analytics = () => {
    return (
        <div className='space-y-4'>
            <SalesCardGroup />

            <AnalyticsSection />

            <SocialCardGroup />

            <UserFeedbackSection />
        </div>
    );
};

export default Analytics;