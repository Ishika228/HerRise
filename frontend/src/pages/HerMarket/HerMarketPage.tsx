import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Globe,
  Package,
  Layers,
  HelpCircle,
  LayoutDashboard,
  ArrowLeft,
  User,
  ChevronDown,
  Shield,
  LogOut,
  Bell,
  CheckCircle,
  Clock,
  Laptop
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useMarket } from '../../context/MarketContext';
import {
  HerMarketPackage,
  HerMarketService,
  HerMarketAddOn,
  WebsiteTemplate,
  ServiceRequestItem,
  getStoredPackages,
  saveStoredPackages,
  getStoredServices,
  saveStoredServices,
  getStoredRequests,
  saveStoredRequests
} from './data/herMarketData';

// View Pages
import { HerMarketHome } from './pages/HerMarketHome';
import { PackagesView } from './pages/PackagesView';
import { ExploreServicesView } from './pages/ExploreServicesView';
import { WebsiteSolutionsView } from './pages/WebsiteSolutionsView';
import { MyServicesView } from './pages/MyServicesView';
import { AdminDashboardView } from './pages/AdminDashboardView';

// Modals & Components
import { ServiceRequestForm } from './components/ServiceRequestForm';
import { ConsultationForm } from './components/ConsultationForm';
import { PackagePaymentModal } from './components/PackagePaymentModal';

export const HerMarketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  // Navigation State according to Section 12
  const [activeNav, setActiveNav] = useState<
    'overview' | 'services' | 'websites' | 'packages' | 'my-services' | 'consultation' | 'admin'
  >('overview');

  // Central Mock Data state backed by localStorage
  const [packages, setPackages] = useState<HerMarketPackage[]>(() => getStoredPackages());
  const [services, setServices] = useState<HerMarketService[]>(() => getStoredServices());
  const [requests, setRequests] = useState<ServiceRequestItem[]>(() => getStoredRequests());

  // Database orders fetch with Role-Based Access Control (RBAC)
  // - Admin: gets all orders across system
  // - Logged-in client: strictly gets ONLY orders purchased by their account
  // - Guest: gets empty list (never sees other users' purchases)
  useEffect(() => {
    const fetchOrdersFromDatabase = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const params = new URLSearchParams();
        if (user?.id) params.append('userId', user.id);
        if (user?.email) params.append('email', user.email);
        if (user?.role) params.append('role', user.role);

        const res = await fetch(`${backendUrl}/api/digital-services/orders?${params.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const dbOrders: ServiceRequestItem[] = data.orders.map((o: any) => ({
            id: o.orderId || o._id || `ORD-${Date.now()}`,
            customerName: o.customerName || 'Valued Client',
            businessName: o.businessName || '',
            email: o.userEmail || o.email || '',
            phone: o.phone || '',
            category: o.category || 'Digital Package Client',
            location: o.location || 'Australia',
            selectedPackageName: o.selectedPackageName || 'Digital Package',
            selectedPackagePrice: o.selectedPackagePrice || 0,
            servicesRequired: o.servicesRequired || ['Core Website Build'],
            hasWebsite: 'No',
            hasLogo: 'Yes',
            businessDescription: o.businessDescription || `Purchased ${o.selectedPackageName}`,
            additionalRequirements: o.additionalRequirements || '',
            selectedAddOns: o.selectedAddOns || [],
            oneTimeTotal: o.oneTimeTotal || 0,
            monthlyTotal: o.monthlyTotal || 0,
            status: o.status || 'In Progress',
            requestDate: o.requestDate || (o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
            paymentDetails: o.paymentDetails || {
              method: 'Card',
              transactionId: o.orderId,
              amountPaid: o.oneTimeTotal,
              status: 'Paid',
              paidAt: o.createdAt
            }
          }));

          setRequests(dbOrders);
          saveStoredRequests(dbOrders);
        }
      } catch (err) {
        console.warn('Could not fetch user orders from backend:', err);
      }
    };

    fetchOrdersFromDatabase();
  }, [user?.id, user?.email, user?.role]);

  // Modal states
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);
  const [selectedPackageForForm, setSelectedPackageForForm] = useState<HerMarketPackage | null>(null);
  const [selectedServicesForForm, setSelectedServicesForForm] = useState<HerMarketService[]>([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Payment Modal state (Stripe / Dummy AUD)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [packageForPayment, setPackageForPayment] = useState<HerMarketPackage | null>(null);
  const [addOnsForPayment, setAddOnsForPayment] = useState<HerMarketAddOn[]>([]);
  const [customerDataForPayment, setCustomerDataForPayment] = useState<{
    customerName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    location?: string;
  } | null>(null);

  // Sync to localStorage
  const handleUpdatePackages = (updated: HerMarketPackage[]) => {
    setPackages(updated);
    saveStoredPackages(updated);
  };

  const handleUpdateServices = (updated: HerMarketService[]) => {
    setServices(updated);
    saveStoredServices(updated);
  };

  const handleUpdateRequests = (updated: ServiceRequestItem[]) => {
    setRequests(updated);
    saveStoredRequests(updated);
  };

  // Handlers for customer interactions
  const handleSelectPackage = (pkg: HerMarketPackage, addOns?: HerMarketAddOn[]) => {
    setSelectedPackageForForm(pkg);
    setSelectedServicesForForm([]);
    setRequirementModalOpen(true);
  };

  const handleBuyPackage = (
    pkg: HerMarketPackage,
    addOns: HerMarketAddOn[] = [],
    customerData?: {
      customerName?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      location?: string;
    } | null
  ) => {
    setPackageForPayment(pkg);
    setAddOnsForPayment(addOns);
    setCustomerDataForPayment(customerData || null);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paidRequest: ServiceRequestItem) => {
    const updated = [paidRequest, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);
    showToast(
      'Payment Received (AUD)',
      `Confirmed order for ${paidRequest.selectedPackageName}. Receipt #${paidRequest.paymentDetails?.transactionId}`,
      'success'
    );
  };

  const handleSelectService = (service: HerMarketService) => {
    setSelectedPackageForForm(null);
    setSelectedServicesForForm([service]);
    setRequirementModalOpen(true);
  };

  const handleOpenBundleForm = (bundled: HerMarketService[]) => {
    setSelectedPackageForForm(null);
    setSelectedServicesForForm(bundled);
    setRequirementModalOpen(true);
  };

  const handleRequestTemplate = (template: WebsiteTemplate) => {
    // Find closest package or match Starter/Growth
    const matchingPkg =
      template.startingPrice >= 19000
        ? packages.find((p) => p.id === 'growth') || packages[1]
        : packages.find((p) => p.id === 'starter') || packages[0];

    setSelectedPackageForForm(matchingPkg);
    setSelectedServicesForForm([]);
    setRequirementModalOpen(true);
    showToast('Template Selected', `Customizing requirements for ${template.title}`, 'info');
  };

  const handleBuyTemplate = (template: WebsiteTemplate) => {
    const templatePackage: HerMarketPackage = {
      id: `website-${template.id}`,
      name: `${template.title} Website Package`,
      tagline: template.shortDesc,
      price: template.startingPrice,
      period: 'one-time',
      targetCustomers: template.category,
      features: template.features,
      buttonText: 'Buy Now'
    };
    handleBuyPackage(templatePackage);
  };

  const handleRequestSubmitted = (newRequest: ServiceRequestItem) => {
    const updated = [newRequest, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);
    showToast(
      'Service Request Logged',
      `Request #${newRequest.id} recorded. Our team will review your business requirements.`,
      'success'
    );
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* TOP HERMARKET HEADER BAR & NAVIGATION (Section 12) */}
        <header className="bg-white rounded-3xl border border-purple-100/90 p-5 shadow-xs flex flex-col gap-4">
          {/* Upper Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4A154B] to-[#701a75] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-pink-300" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  HerMarket
                </h1>
                <p className="text-xs text-gray-500">
                  Affordable digital services, websites, and marketing for growing businesses.
                </p>
              </div>
            </div>

            {/* Header Right Actions & Profile Menu */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                title="Return to Main App Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Main Dashboard</span>
              </Link>

              {/* Profile Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-purple-100 bg-white hover:bg-purple-50 transition-colors cursor-pointer text-xs font-bold text-gray-800"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4A154B] text-white flex items-center justify-center text-[11px] font-black">
                    {user?.name ? user.name[0].toUpperCase() : 'H'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || 'My Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 text-xs animate-in fade-in"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-purple-50">
                      <div className="font-bold text-gray-900">{user?.name || 'Entrepreneur'}</div>
                      <div className="text-[11px] text-gray-400 truncate">{user?.email || 'user@herrise.ai'}</div>
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2 text-gray-700 font-medium cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => setActiveNav('my-services')}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2 text-gray-700 font-medium cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>My Services</span>
                    </button>
                    <div className="my-1 border-t border-purple-50" />
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs Row (Section 12) */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveNav('overview')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNav === 'overview'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveNav('packages')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeNav === 'packages'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Packages</span>
            </button>

            <button
              onClick={() => setActiveNav('services')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNav === 'services'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Explore Services
            </button>

            <button
              onClick={() => setActiveNav('websites')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeNav === 'websites'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Website Solutions</span>
            </button>

            <button
              onClick={() => setActiveNav('my-services')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeNav === 'my-services'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              <span>My Services</span>
              {pendingCount > 0 && (
                <span className="text-[10px] font-black bg-pink-500 text-white px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('consultation')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNav === 'consultation'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50/70 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Free Consultation
            </button>
          </nav>
        </header>

        {/* ACTIVE VIEW RENDERING */}
        <main>
          {activeNav === 'overview' && (
            <HerMarketHome
              packages={packages}
              onNavigate={(tab) => setActiveNav(tab)}
              onSelectPackage={handleSelectPackage}
              onBuyPackage={handleBuyPackage}
              onOpenConsultation={() => setActiveNav('consultation')}
            />
          )}

          {activeNav === 'packages' && (
            <PackagesView
              packages={packages}
              onSelectPackage={handleSelectPackage}
              onBuyPackage={handleBuyPackage}
            />
          )}

          {activeNav === 'services' && (
            <ExploreServicesView
              services={services}
              onSelectService={handleSelectService}
              onOpenBundleForm={handleOpenBundleForm}
            />
          )}

          {activeNav === 'websites' && (
            <WebsiteSolutionsView
              onRequestTemplate={handleRequestTemplate}
              onBuyTemplate={handleBuyTemplate}
            />
          )}

          {activeNav === 'my-services' && (
            <MyServicesView
              requests={requests}
              onOpenNewRequest={() => setActiveNav('packages')}
            />
          )}

          {activeNav === 'consultation' && (
            <div className="max-w-3xl mx-auto py-4">
              <ConsultationForm onSuccess={() => setActiveNav('my-services')} />
            </div>
          )}

          {activeNav === 'admin' && (
            <AdminDashboardView
              packages={packages}
              services={services}
              requests={requests}
              onUpdatePackages={handleUpdatePackages}
              onUpdateServices={handleUpdateServices}
              onUpdateRequests={handleUpdateRequests}
              onExitAdmin={() => setActiveNav('overview')}
            />
          )}
        </main>

        {/* REUSABLE CUSTOMER REQUIREMENT FORM MODAL (Section 6) */}
        <ServiceRequestForm
          isOpen={requirementModalOpen}
          onClose={() => setRequirementModalOpen(false)}
          selectedPackage={selectedPackageForForm}
          selectedServices={selectedServicesForForm}
          packages={packages}
          allServices={services}
          onRequestSubmitted={handleRequestSubmitted}
          onBuyNow={(pkg, addOns, customerData) => {
            setRequirementModalOpen(false);
            handleBuyPackage(pkg, addOns, customerData);
          }}
        />

        {/* STRIPE & DUMMY AUD PAYMENT CHECKOUT MODAL */}
        <PackagePaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          pkg={packageForPayment}
          addOns={addOnsForPayment}
          initialCustomerData={customerDataForPayment}
          onPaymentSuccess={(paidReq) => {
            handlePaymentSuccess(paidReq);
            setActiveNav('my-services');
          }}
        />
      </div>
    </DashboardLayout>
  );
};
