import React from 'react';
import SalesCardGroup from './SalesCardGroup.jsx';
import AnalyticsSection from './AnalyticsSection.jsx';
import SocialCardGroup from './SocialCardGroup.jsx';
import UserFeedbackSection from './UserFeedbackSection.jsx';


const Analytics = () => {
    return (
        <>
            <SalesCardGroup />

            <AnalyticsSection />

            <SocialCardGroup />

            <UserFeedbackSection />
        </>
    );
};

export default Analytics;