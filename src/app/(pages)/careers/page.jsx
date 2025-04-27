import JobDetails from '@/components/Careers/JobList ';
import JoinUpfrica from '@/components/Careers/JoinUpfrica';
import Header from '@/components/common/header/Header';
import React from 'react';

const page = () => {
    return (
        <div>
            <Header />
            <JoinUpfrica />
            <JobDetails />
        </div>
    );
};

export default page;