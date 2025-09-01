import PriceFields from "./PriceFields";
import PricingOptionsPanel from "./PricingOptionsPanel";
import SoldListingsSummary from "./SoldListingsSummary";

export default function PricingSection({ formik }) {
  return (
    <div>
      <PricingOptionsPanel />
      <div className="grid md:grid-cols-2 md:gap-4">
        <div>
          <PriceFields formik={formik} />
        </div>
        <SoldListingsSummary />
      </div>
    </div>
  );
}
