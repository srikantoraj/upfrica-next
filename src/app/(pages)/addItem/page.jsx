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
import { TitleSection } from '@/components/AddItem/TitleSection';
import { UploaderGrid } from '@/components/AddItem/UploaderGrid';
import Header from '@/components/common/header/Header';
import React from 'react';

const AddItem = () => {
    
    return (
        <div>
            <Header />
            <div className="max-w-5xl mx-auto space-y-10 py-5 px-4">
                <CompleteListing />
                <UploaderGrid />
                <TitleSection />
                <CategorySection />
                <ItemForm />
                <AiDescription />
                <PricingSection />
                <DeliveryDetails />
                <ItemDisclosures />
                <PromoteListing />
                <ListingFee />
                <ListingCTA />
                <LegalFAQNotice />
                <EbayFooter />
            </div>

        </div>
    );
};

export default AddItem;