'use client'
import React from 'react';
import { useSelector } from "react-redux";
import clsx from "clsx";
import DashbordSearchBar from '../dashboard/DashbordSearchBar';

const Dashboard = () => {
    const toggle = useSelector((state) => state.toggle.toggle);
    return (
        <div
            // className={clsx(
            //     "transition-all duration-500 ease-in-out h-full bg-white shadow-md overflow-hidden  ",
            //     "fixed top-0 left-0 z-50",
            //     "xl:relative xl:z-auto",
            //     toggle ? "w-64 opacity-100 shrink-0" : "w-0 opacity-0",
            //     " xl:opacity-100 xl:translate-x-0"
            // )}

            className={clsx(
                // fixed to viewport, full-screen height, allow vertical scroll
                "fixed top-0 left-0 z-50 h-screen overflow-y-auto bg-white shadow-md transition-all duration-500 ease-in-out",
                // ensure always visible & positioned correctly on xl+
                "xl:relative xl:z-auto xl:opacity-100 xl:translate-x-0",
                // width & opacity based on toggle state
                toggle ? "w-64 opacity-100 shrink-0" : "w-0 opacity-0"
            )}
        >
            <DashbordSearchBar />
        </div>
    );
};

export default Dashboard;


