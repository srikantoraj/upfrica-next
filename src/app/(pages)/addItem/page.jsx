'use client'
import AiDescription from '@/components/AddItem/AiDescription';
import { CategorySection } from '@/components/AddItem/CategorySection';
import CompleteListing from '@/components/AddItem/CompleteListing';
import DeliveryDetails from '@/components/AddItem/DeliveryDetails';
import EbayFooter from '@/components/AddItem/EbayFooter';
import ItemDisclosures from '@/components/AddItem/ItemDisclosures';
import ItemForm from '@/components/AddItem/ItemAttributesForm';
import LegalFAQNotice from '@/components/AddItem/LegalFAQNotice';
import ListingCTA from '@/components/AddItem/ListingCTA';
import ListingFee from '@/components/AddItem/ListingFee';
import PricingSection from '@/components/AddItem/PricingSection';
import PromoteListing from '@/components/AddItem/PromoteListing';
import ScheduleListing from '@/components/AddItem/ScheduleListing';
import { TitleSection } from '@/components/AddItem/TitleSection';
import { UploaderGrid } from '@/components/AddItem/UploaderGrid';
import Header from '@/components/common/header/Header';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Item from '@/components/AddItem/Item';
import ItemConditionSelector from '@/components/AddItem/ItemConditionSelector';

const AddItem = () => {
    const [uploadedImages, setUploadedImages] = useState([]); // ⭐️ Add this line


    // const formik = useFormik({
    //     initialValues: {
    //         title: '',
    //         price: 0,
    //         schedule: { date: '', time: '' },
    //         adRate: 9,
    //     },
    //     validationSchema: Yup.object({
    //         title: Yup.string().required('Title is required'),
    //         // price: Yup.number().min(1, 'Minimum price is 1'),
    //     }),
    //     onSubmit: (values) => {
    //         console.log('✅ Final listing data:', values);

    //     },
    // });



    const formik = useFormik({
        initialValues: {
            title: '',
            price: 0,
            schedule: { date: '', time: '' },
            adRate: 9,
            images: [], // <-- Add this to formik
            itemAttributes: {}, // ⭐️ New field for ItemAttributes
            condition: 'New', // ⭐️ Add this
            description: '', // ⭐️ Add this line
            pricing: {                         // ✅ Add this block
                format: 'Auction',
                duration: '7 days',
                startingBid: '47.70',
                buyItNow: '136.91',
                immediatePay: false,
                reservePrice: '',
                quantity: 1,
            },
            deliveryDetails: {
                method: 'FLAT_RATE_LOCAL_PICKUP',
                weight: { kg: '', g: '' },
                dimensions: { length: '', width: '', depth: '' },
                location: '',
            },
            majorWeight: '',
            minorWeight: '',
            length: '',
            width: '',
            depth: ''

        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
        }),
        onSubmit: (values) => {
            console.log('✅ Final listing data:', values);
        },
    });

    const handleImagesChange = (imgs) => {
        setUploadedImages(imgs);
        formik.setFieldValue('images', imgs); // <-- Update Formik value
    };
    return (
        <div>
            <Header />
            <form onSubmit={formik.handleSubmit} className="max-w-5xl mx-auto space-y-10 py-5 px-4">
                <CompleteListing />
                <UploaderGrid onImagesChange={handleImagesChange} />
                <TitleSection formik={formik} />
                <CategorySection />
                <Item formik={formik} />
                <ItemConditionSelector formik={formik} />
                <AiDescription formik={formik} />
                <PricingSection formik={formik} />
                {/* <ScheduleListing /> */}
                <DeliveryDetails formik={formik} />
                <ItemDisclosures />
                <PromoteListing />
                <ListingFee />

                {/* footer section  */}
                {/* <ListingCTA formik={formik} />
                <LegalFAQNotice /> */}


                {/* listing cta  */}

                <div className="flex flex-col  mt-6 lg:w-2/5 space-y-3 mx-auto px-8 lg:px-0">
                    <button
                        type="button"
                        className="px-6 py-3 text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-full shadow"
                        aria-label="List it for free"
                    >
                        List it for free
                    </button>

                    <button
                        type="button"
                        className="px-6 py-3 text-sm font-medium text-gray-700 border-black border   hover:bg-gray-200 rounded-full"
                        aria-label="Save for later"
                    >
                        Save for later
                    </button>

                    <button
                        // onClick={() => console.log("Preview clicked:", formik.values)}
                        type="submit"
                        className="px-6 py-3 text-sm font-medium text-gray-700 border-black border  hover:bg-gray-200 rounded-full"
                        aria-label="Preview"
                        name="preview"
                    >
                        Preview
                    </button>
                </div>

                {/* LegalFAQNotice */}

                <div className="text-sm text-gray-700 space-y-3 leading-relaxed mt-4">
                    <p>
                        To improve your chances of selling, we may send you offers from buyers that you can choose to accept or decline.
                    </p>

                    <p>
                        Auctions will be automatically relisted up to 8 times for free and do not count towards your monthly listings
                        balance. Auctions with a 1- or 3-day duration will be relisted with a 7-day duration.
                    </p>

                    <p>
                        Funds from your sales may be unavailable and show as pending for a period of time.{" "}
                        <a
                            href="http://www.ebay.co.uk/help/selling/selling-getting-paid/pending-payments?id=4155"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Learn more
                        </a>
                    </p>
                </div>

                {/* EbayFooter */}
                <EbayFooter />

            </form>

        </div>
    );
};

export default AddItem;