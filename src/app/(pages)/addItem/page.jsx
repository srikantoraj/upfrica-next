'use client'
import AiDescription from '@/components/AddItem/AiDescription';
import { CategorySection } from '@/components/AddItem/CategorySection';
import CompleteListing from '@/components/AddItem/CompleteListing';
import DeliveryDetails from '@/components/AddItem/DeliveryDetails';
import EbayFooter from '@/components/AddItem/EbayFooter';
import ItemDisclosures from '@/components/AddItem/ItemDisclosures';
import ItemForm from '@/components/AddItem/ItemForm';
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
import React from 'react';
import * as Yup from 'yup';

const AddItem = () => {

    const formik = useFormik({
        initialValues: {
            title: '',
            price: 0,
            schedule: { date: '', time: '' },
            adRate: 9,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            price: Yup.number().min(1, 'Minimum price is 1'),
        }),
        onSubmit: (values) => {
            console.log('✅ Final listing data:', values);
            
        },
    });

    return (
        <div>
            <Header />
            <form onSubmit={formik.handleSubmit} className="max-w-5xl mx-auto space-y-10 py-5 px-4">
                <CompleteListing />
                <UploaderGrid />
                <TitleSection  formik={formik} />
                <CategorySection />
                <ItemForm />
                <AiDescription />
                <PricingSection />
                <ScheduleListing />
                <DeliveryDetails />
                <ItemDisclosures />
                <PromoteListing />
                <ListingFee />
                <ListingCTA />
                <LegalFAQNotice />
                <EbayFooter />
            </form>

        </div>
    );
};

export default AddItem;