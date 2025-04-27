import CareersHero from '@/components/Careers/CareersHero';
import JobDetails from '@/components/Careers/JobList ';
import JoinUpfrica from '@/components/Careers/JoinUpfrica';
import JoinUsSection from '@/components/Careers/JoinUsSection';
import Header from '@/components/common/header/Header';
import React from 'react';

const page = () => {
    return (
        <div>
            <Header />
            <CareersHero/>
            {/* <JoinUsSection/> */}
            <JoinUpfrica />
            <JobDetails />
        </div>
    );
};

export default page;