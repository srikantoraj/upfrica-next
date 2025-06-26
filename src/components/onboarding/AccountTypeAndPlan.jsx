//src/components/onboarding/AccountTypeAndPlan.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import PlanComparisonModal from '@/components/ui/PlanComparisonModal';
import PlanToggleFilter from '@/components/ui/PlanToggleFilter';
import PlanCheckoutModal from '@/components/ui/PlanCheckoutModal';
import { CheckIcon } from 'lucide-react';

const ROLE_OPTIONS = [
  { label: 'Buy items', value: 'buyer', group: 'primary' },
  { label: 'Become Upfrica sourcing agent', value: 'agent', group: 'primary' },
  { label: 'Sell as an individual', value: 'seller_private', group: 'seller' },
  { label: 'Sell as a business', value: 'seller_business', group: 'seller' },
];

export default function AccountTypeAndPlan() {
  const router = useRouter();
  const { token, user, refreshUser } = useAuth();
  const searchParams = useSearchParams();

  const [selectedRoles, setSelectedRoles] = useState(['buyer']);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleError, setRoleError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const sellerSelected =
    selectedRoles.includes('seller_private') || selectedRoles.includes('seller_business');

  // Step indicator
  const getCurrentStep = () => {
    if (!sellerSelected) return 1;
    if (sellerSelected && !selectedPlan) return 2;
    return 3;
  };
  const currentStep = getCurrentStep();
  const totalSteps = 3;

  useEffect(() => {
    if (token) {
      axiosInstance
        .get('/api/seller-plans/', {
          headers: {
            Authorization: `Token ${token?.replace(/^"|"$/g, '')}`,
          },
        })
        .then((res) => {
          setPlans(res.data);
          setFilteredPlans(res.data);
        });
    }
  }, [token]);

  // 🔁 Redirect after payment
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('🎉 Payment successful! Redirecting...');
      router.push('/new-dashboard');
    }
    if (paymentStatus === 'cancel') {
      toast.error('⚠️ Payment cancelled. You can try again.');
    }
  }, [searchParams]);

  const toggleRole = (value) => {
    if (value === 'buyer') return;

    const nextRoles = selectedRoles.includes(value)
      ? selectedRoles.filter((r) => r !== value)
      : [...selectedRoles, value];

    const isIndividual = nextRoles.includes('seller_private');
    const isBusiness = nextRoles.includes('seller_business');
    const isAgent = nextRoles.includes('agent');
    const isSeller = isIndividual || isBusiness;

    // 🛑 Conflict: both sellers
    if (isIndividual && isBusiness) {
      const msg = 'You can’t select both individual and business seller.';
      toast.error(`❌ ${msg}`);
      setRoleError(msg);
      return;
    }

    // 🛑 Conflict: seller + agent
    if (isSeller && isAgent) {
      const msg = 'You can’t combine seller and sourcing agent.';
      toast.error(`❌ ${msg}`);
      setRoleError(msg);
      return;
    }

    setRoleError(null); // ✅ valid combo

    if (!nextRoles.includes('buyer')) nextRoles.unshift('buyer');
    setSelectedRoles([...new Set(nextRoles)]);
  };

  const handleSubmit = async () => {
    setError(null);

    if (sellerSelected && !selectedPlan) {
      return setError('Please select a seller plan.');
    }

    const payload = {
      account_type: selectedRoles,
      ...(sellerSelected && selectedPlan && { seller_plan_id: selectedPlan }),
    };

    try {
      setLoading(true);

      // Step 1: Update user account_type
      await axiosInstance.patch('/api/users/me/', payload, {
        headers: {
          Authorization: `Token ${token?.replace(/^"|"$/g, '')}`,
        },
      });

      await refreshUser();

      // Step 2: Handle subscription
      if (sellerSelected && selectedPlan) {
        const plan = plans.find((p) => p.id === selectedPlan);
        const price =
          billingCycle === 'weekly' ? plan.price_per_week : plan.price_per_month;

        if (price === 0) {
          // Free plan
          await axiosInstance.post(
            '/api/subscribe/',
            {
              plan_id: selectedPlan,
              billing_cycle: billingCycle,
            },
            {
              headers: {
                Authorization: `Token ${token?.replace(/^"|"$/g, '')}`,
              },
            }
          );
          toast.success('✅ Free plan activated!');
          router.push('/new-dashboard');
        } else {
          // Paid plan
          const res = await axiosInstance.post(
            '/api/create-checkout-session/',
            {
              plan_id: selectedPlan,
              billing_cycle: billingCycle,
            },
            {
              headers: {
                Authorization: `Token ${token?.replace(/^"|"$/g, '')}`,
              },
            }
          );
          window.location.href = res.data.checkout_url;
        }
      } else {
        toast.success('✅ Roles updated!');
        router.push('/new-dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update account or create subscription.');
    } finally {
      setLoading(false);
    }
  };


return (
  <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-white transition-colors duration-300">
    {/* 🟣 Step Progress */}
    <div className="mb-6">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-2 bg-purple-600 transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>

    <h1 className="text-2xl font-bold mb-1">Select Your Account Type</h1>
    <p className="text-gray-500 dark:text-gray-300 mb-6">
      Choose what you want to do on Upfrica.
    </p>

    {/* Account type cards */}
    <div className="space-y-4 mb-2">
      {ROLE_OPTIONS.map(({ label, value }) => {
        const isSelected = selectedRoles.includes(value);
        return (
          <button
            key={value}
            onClick={() => toggleRole(value)}
            className={`w-full px-4 py-3 rounded border flex justify-between items-center transition-all ${
              isSelected
                ? 'bg-purple-600 text-white font-semibold border-purple-600 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-purple-500'
            }`}
          >
            <span>{label}</span>
            {isSelected && <CheckIcon className="w-5 h-5" />}
          </button>
        );
      })}
    </div>

    {roleError && (
      <div className="text-red-600 dark:text-red-400 text-sm font-medium mt-2 mb-4">
        {roleError}
      </div>
    )}

    {sellerSelected && (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(prev => (prev === 'monthly' ? 'weekly' : 'monthly'))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                billingCycle === 'weekly' ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  billingCycle === 'weekly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'weekly' ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Weekly
            </span>
          </div>
          <PlanComparisonModal />
        </div>

        <PlanToggleFilter plans={plans} setFilteredPlans={setFilteredPlans} />

        <h2 className="font-medium mb-2">Choose a Seller Plan</h2>
        <div className="grid gap-3">
          {filteredPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-4 rounded border transition-all ${
                selectedPlan === plan.id
                  ? 'bg-green-50 dark:bg-green-900 border-green-500 ring ring-green-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{plan.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    GHS {billingCycle === 'weekly' ? plan.price_per_week : plan.price_per_month}
                  </div>
                </div>
                {selectedPlan === plan.id && (
                  <span className="text-green-600 dark:text-green-400">✔ Selected</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )}

    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

    <button
      onClick={handleSubmit}
      disabled={(sellerSelected && !selectedPlan) || loading}
      className="w-full text-white bg-purple-600 hover:bg-purple-700 py-3 rounded transition disabled:opacity-50"
    >
      {loading
        ? 'Saving...'
        : sellerSelected && !selectedPlan
        ? 'Select a Plan to Continue'
        : 'Continue'}
    </button>

    <PlanCheckoutModal
      open={showCheckoutModal}
      onClose={() => setShowCheckoutModal(false)}
      planId={selectedPlan}
      billing={billingCycle}
    />
  </div>
);
}