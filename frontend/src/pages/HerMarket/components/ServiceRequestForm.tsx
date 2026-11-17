import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Send, Plus, Minus, ArrowRight, CreditCard, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HerMarketPackage,
  HerMarketService,
  HerMarketAddOn,
  ServiceRequestItem,
  initialAddOns,
  formatINR,
  getStoredRequests,
  saveStoredRequests
} from '../data/herMarketData';
import { AddOnCard } from './AddOnCard';

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: HerMarketPackage | null;
  selectedServices?: HerMarketService[];
  packages: HerMarketPackage[];
  allServices: HerMarketService[];
  onRequestSubmitted: (newRequest: ServiceRequestItem) => void;
  onBuyNow?: (
    pkg: HerMarketPackage,
    addOns: HerMarketAddOn[],
    customerData?: {
      customerName?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      location?: string;
    }
  ) => void;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  isOpen,
  onClose,
  selectedPackage = null,
  selectedServices = [],
  packages,
  allServices,
  onRequestSubmitted,
  onBuyNow
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [currentPackageId, setCurrentPackageId] = useState<string>(selectedPackage?.id || '');
  const [chosenServiceIds, setChosenServiceIds] = useState<string[]>(
    selectedServices.map((s) => s.id)
  );
  const [hasWebsite, setHasWebsite] = useState<'Yes' | 'No'>('No');
  const [hasLogo, setHasLogo] = useState<'Yes' | 'No'>('No');
  const [businessDescription, setBusinessDescription] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      if (selectedPackage) {
        setCurrentPackageId(selectedPackage.id);
      }
      if (selectedServices.length > 0) {
        setChosenServiceIds(selectedServices.map((s) => s.id));
      }
      setIsSubmitted(false);
    }
  }, [isOpen, selectedPackage, selectedServices]);

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === currentPackageId);

  // Dynamic calculations
  const packagePrice = currentPkg?.price || 0;
  const chosenServices = allServices.filter((s) => chosenServiceIds.includes(s.id));
  const chosenAddOns = initialAddOns.filter((a) => selectedAddOnIds.includes(a.id));

  // One-time total calculation
  const servicesOneTime = chosenServices
    .filter((s) => s.period === 'one-time')
    .reduce((acc, curr) => acc + curr.price, 0);

  const addOnsOneTime = chosenAddOns
    .filter((a) => a.period === 'one-time')
    .reduce((acc, curr) => acc + curr.price, 0);

  const oneTimeTotal = packagePrice + servicesOneTime + addOnsOneTime;

  // Monthly recurring total calculation
  const servicesMonthly = chosenServices
    .filter((s) => s.period === 'monthly')
    .reduce((acc, curr) => acc + curr.price, 0);

  const addOnsMonthly = chosenAddOns
    .filter((a) => a.period === 'monthly')
    .reduce((acc, curr) => acc + curr.price, 0);

  const monthlyTotal = servicesMonthly + addOnsMonthly;

  const toggleService = (id: string) => {
    setChosenServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !businessName || !phone || !email) {
      alert('Please fill out the required contact details.');
      return;
    }

    const newId = `REQ-${Date.now().toString().slice(-4)}`;
    const newRequest: ServiceRequestItem = {
      id: newId,
      customerName,
      businessName,
      email,
      phone,
      category: category || 'General Business',
      location: location || 'India',
      selectedPackageName: currentPkg?.name,
      selectedPackagePrice: currentPkg?.price,
      servicesRequired: chosenServices.map((s) => s.name),
      hasWebsite,
      hasLogo,
      businessDescription,
      additionalRequirements,
      selectedAddOns: chosenAddOns.map((a) => a.name),
      oneTimeTotal,
      monthlyTotal,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    const existing = getStoredRequests();
    const updated = [newRequest, ...existing];
    saveStoredRequests(updated);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch {}

    setSubmittedRequestId(newId);
    setIsSubmitted(true);
    onRequestSubmitted(newRequest);
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const serviceAddOns: HerMarketAddOn[] = chosenServices
      .filter((s) => s.period === 'monthly')
      .map((s) => ({
        id: `srv-${s.id}`,
        name: s.name,
        description: s.description || s.name,
        price: s.price,
        period: 'monthly' as const
      }));

    const combinedAddOns: HerMarketAddOn[] = [...chosenAddOns, ...serviceAddOns];

    const allFeatureNames = [
      ...(currentPkg?.features || []),
      ...chosenServices.map((s) => s.name)
    ];

    const customPkg: HerMarketPackage = {
      id: currentPkg?.id || 'custom-bundle',
      name: currentPkg
        ? `${currentPkg.name}${chosenServices.length > 0 ? ` + ${chosenServices.length} Services` : ''}`
        : chosenServices.length > 0
        ? `Custom Bundle (${chosenServices.length} Selected Services)`
        : 'Digital Services Package',
      tagline:
        chosenServices.map((s) => s.name).slice(0, 3).join(', ') ||
        currentPkg?.tagline ||
        'Complete Tailored Digital Services',
      price: packagePrice + servicesOneTime,
      period: 'one-time',
      targetCustomers: currentPkg?.targetCustomers || 'All Businesses',
      features: allFeatureNames.length > 0 ? allFeatureNames : ['Complete digital deployment and support'],
      buttonText: 'Buy Now'
    };

    if (onBuyNow) {
      onBuyNow(customPkg, combinedAddOns, {
        customerName,
        email,
        phone,
        businessName,
        location
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-purple-100 flex items-center justify-between gap-3 bg-purple-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#4A154B] text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg font-black text-gray-900">
                {isSubmitted ? 'Service Request Submitted' : 'Submit Business Requirements'}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isSubmitted
                ? 'We have recorded your details and will get in touch shortly.'
                : 'Custom digital growth scope for your venture — no advance payment taken.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7">
          {isSubmitted ? (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Your service request has been submitted successfully!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Our team will review your requirements and contact you via WhatsApp or Email within 24 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Request ID:</span>
                  <strong className="text-[#4A154B]">{submittedRequestId}</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Selected Package:</span>
                  <strong>{currentPkg?.name || 'Custom Selection'}</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated One-Time:</span>
                  <strong>{formatINR(oneTimeTotal)}</strong>
                </div>
                {monthlyTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Recurring Monthly:</span>
                    <strong className="text-amber-800">{formatINR(monthlyTotal)}/mo</strong>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#350c36] cursor-pointer"
                >
                  View in My Services
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dynamic Price Breakdown Summary Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-[#faf5fa] to-pink-50 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#9b667e]">
                    Selected Plan & Estimate
                  </span>
                  <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">
                    {currentPkg?.name || 'Custom Individual Services'}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {chosenServices.length} individual service(s), {chosenAddOns.length} add-on(s) selected
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-purple-200 sm:pl-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#4A154B]">{formatINR(oneTimeTotal)}</span>
                    <span className="text-[10px] text-gray-400">one-time</span>
                  </div>
                  {monthlyTotal > 0 && (
                    <div className="text-[11px] font-bold text-amber-800">
                      +{formatINR(monthlyTotal)}/mo recurring
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Basic Information */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                  1. Contact & Business Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Priya Couture & Boutique"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+61 412 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Business Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Boutique, Salon, Bakery, Consulting"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Business Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Package Selection */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                  2. Choose Base Package
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map((pkg) => {
                    const isSelected = currentPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setCurrentPackageId(pkg.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#4A154B] bg-purple-50/70 ring-1 ring-[#4A154B]'
                            : 'border-purple-100 bg-white hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">
                            {pkg.id.toUpperCase()}
                          </span>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#4A154B]" />}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{pkg.name}</h5>
                        <div className="text-sm font-black text-[#4A154B] mt-2">
                          {formatINR(pkg.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Individual Services Checklist */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                  3. Individual Services Needed (Optional)
                </h4>
                <p className="text-[11px] text-gray-500 mb-3">
                  Select any specific standalone services to bundle with your enquiry:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {allServices.map((srv) => {
                    const isChecked = chosenServiceIds.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#4A154B] bg-purple-50/50 text-[#4A154B]'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-[#4A154B] focus:ring-0"
                          />
                          <span className="truncate font-medium">{srv.name}</span>
                        </div>
                        <span className="text-[11px] font-bold shrink-0 ml-2">
                          {formatINR(srv.price)}
                          {srv.period === 'monthly' ? '/mo' : ''}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Digital Presence Readiness */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3 text-xs">
                <h4 className="font-bold text-gray-900">Digital Presence Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1.5 font-medium">
                      Do you already have an existing website?
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="hasWebsite"
                          value="Yes"
                          checked={hasWebsite === 'Yes'}
                          onChange={() => setHasWebsite('Yes')}
                          className="text-[#4A154B]"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="hasWebsite"
                          value="No"
                          checked={hasWebsite === 'No'}
                          onChange={() => setHasWebsite('No')}
                          className="text-[#4A154B]"
                        />
                        <span>No (Need new build)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1.5 font-medium">
                      Do you have a finalized brand logo?
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="hasLogo"
                          value="Yes"
                          checked={hasLogo === 'Yes'}
                          onChange={() => setHasLogo('Yes')}
                          className="text-[#4A154B]"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="hasLogo"
                          value="No"
                          checked={hasLogo === 'No'}
                          onChange={() => setHasLogo('No')}
                          className="text-[#4A154B]"
                        />
                        <span>No (Design needed)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Business Description & Additional Requirements */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Business Description & Target Audience
                  </label>
                  <textarea
                    rows={2}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Briefly describe what your business sells, who your customers are, and what makes your offering unique..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Additional Requirements / Reference Websites
                  </label>
                  <textarea
                    rows={2}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="Any specific features, color preferences, links to competitor websites you like, or launch deadline..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#4A154B] focus:bg-white bg-gray-50 outline-none"
                  />
                </div>
              </div>

              {/* 6. Optional Add-ons Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                    6. Optional Add-On Services
                  </h4>
                  <span className="text-[10px] text-gray-400">Can be added or removed anytime</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {initialAddOns.map((addon) => (
                    <AddOnCard
                      key={addon.id}
                      addon={addon}
                      selected={selectedAddOnIds.includes(addon.id)}
                      onToggle={toggleAddOn}
                    />
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed">
                <strong>Transparent Pricing Notice:</strong> Domain name registration, cloud hosting server fees, advertising spend budget on Google/Meta, third-party subscriptions, and government taxes are quoted additionally as applicable. No payment is processed at this stage.
              </div>

              {/* Submit & Buy CTA */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-100">
                <div className="text-left w-full sm:w-auto">
                  <div className="text-xs text-gray-500 font-medium">Combined Scope Total:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#4A154B]">{formatINR(oneTimeTotal)}</span>
                    {monthlyTotal > 0 && (
                      <span className="text-xs font-bold text-amber-800">
                        + {formatINR(monthlyTotal)}/month
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Send an inquiry without upfront payment"
                  >
                    <span>Submit Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onBuyNow && (
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="py-2.5 px-5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      title="Proceed directly to instant checkout with all selected services and packages"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-emerald-100" />
                      <span>
                        Buy Option ({formatINR(oneTimeTotal)}{monthlyTotal > 0 ? ` + ${formatINR(monthlyTotal)}/mo` : ''})
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
