'use client';

import { useAuth } from '@/contexts/AuthContext';
import { RoleViewProvider, useRoleView } from '@/contexts/RoleViewContext';
import TopBar from './TopBar';
import SellerSidebar from './SellerSidebar';
import BuyerSidebar from './BuyerSidebar';
import AgentSidebar from './AgentSidebar';
import Footer from './Footer';
import { normalizeRole } from '@/app/utils/roles';
import { useSearchParams } from 'next/navigation';

function InnerDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { roleView } = useRoleView();
  const { user } = useAuth();
  const normalizedRole = normalizeRole(roleView);

  const isBuyerOnly = Array.isArray(user?.account_type)
    ? user.account_type.length === 1 && user.account_type.includes('buyer')
    : user?.account_type === 'buyer';

  const renderSidebar = () => {
    if (normalizedRole === 'seller') {
      return (
        <SellerSidebar
          key="seller"
          roleView={normalizedRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    if (normalizedRole === 'agent') {
      return (
        <AgentSidebar
          key="agent"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    return (
      <BuyerSidebar
        key="buyer"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    );
  };

useEffect(() => {
  if (paymentSuccess) {
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
  }
}, [paymentSuccess]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar toogleMobileSidebarHide={() => setSidebarOpen(!sidebarOpen)} />

      {isBuyerOnly && (
        <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 text-sm px-4 py-2 text-center shadow-sm">
          🚀 Want to earn on Upfrica?{' '}
          <a
            href="/onboarding/account-type"
            className="underline font-semibold hover:text-indigo-700 dark:hover:text-white"
          >
            Become a Seller or Agent
          </a>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}

        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 bg-green-50 dark:bg-[#0e1e1e] px-4 sm:px-6 lg:px-12 xl:px-40 py-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto text-gray-800 dark:text-white">
              <h1 className="text-xl font-bold mb-2">Main Content (children)</h1>
              <p className="mb-6">This is where your dynamic page content goes.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-gray-800 shadow rounded-md text-sm"
                  >
                    Card {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { hydrated, user } = useAuth();
  const searchParams = useSearchParams();

  if (!hydrated) return null;

  const roles = Array.isArray(user?.account_type)
    ? user.account_type
    : [user?.account_type];

  const paymentSuccess = searchParams.get('payment') === 'success';

  // ✅ Default to 'seller' if payment was successful and user has seller access
  const defaultRole = useMemo(() => {
    if (paymentSuccess && roles.includes('seller_private')) return 'seller';
    if (paymentSuccess && roles.includes('seller_business')) return 'seller';
    if (roles.includes('agent')) return 'agent';
    return roles[0]; // fallback to first available role
  }, [paymentSuccess, roles]);

  return (
    <RoleViewProvider roles={roles} defaultRole={defaultRole}>
      <InnerDashboardLayout>{children}</InnerDashboardLayout>
    </RoleViewProvider>
  );
}