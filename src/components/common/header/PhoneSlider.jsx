import Link from 'next/link';
import React from 'react';

const PhoneSlider = () => {
    const categories = [
        { id: 1, slug: "my-listings", url: "/categories/my-listings" },
        { id: 2, slug: "help-support", url: "/categories/help-support" },
        { id: 3, slug: "our-location", url: "/categories/our-location" },
        { id: 4, slug: "uk-site", url: "/categories/uk-site" },
        { id: 5, slug: "all-listings", url: "/categories/all-listings" },
        { id: 6, slug: "deals-up-to-50-off", url: "/categories/deals-up-to-50-off" },
        { id: 7, slug: "shops", url: "/categories/shops" },
        { id: 8, slug: "affiliate-jobs", url: "/categories/affiliate-jobs" },
        { id: 9, slug: "how-to-sell", url: "/categories/how-to-sell" },
        { id: 10, slug: "help", url: "/categories/help" },
        { id: 11, slug: "blenders", url: "/categories/blenders" },
        { id: 12, slug: "women-bags", url: "/categories/women-bags" },
        { id: 13, slug: "rice-cooker", url: "/categories/rice-cooker" },
        { id: 14, slug: "machines", url: "/categories/machines" },
        { id: 15, slug: "my-purchases", url: "/categories/my-purchases" },
        { id: 16, slug: "my-sales", url: "/categories/my-sales" },
        { id: 17, slug: "sellplus", url: "/categories/sellplus" },
        { id: 18, slug: "projectors", url: "/categories/projectors" },
        { id: 19, slug: "help-centre", url: "/support" },
    ];


    return (
        <div className="xl:hidden overflow-x-auto py-5">
            <div className="flex gap-4 whitespace-nowrap ">
                {categories.map((data) => (
                    <div key={data.id}>
                        <Link href={data.url}>
                            <p className='border border-black py-1 px-4 rounded-3xl text-base font-bold'>{data.slug}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhoneSlider;