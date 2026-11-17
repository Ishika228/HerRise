import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  Plus,
  Info,
  CreditCard
} from 'lucide-react';
import {
  HerMarketPackage,
  HerMarketAddOn,
  initialAddOns,
  formatAUD
} from '../data/herMarketData';
import { PackageCard } from '../components/PackageCard';
import { PricingComparison } from '../components/PricingComparison';
import { AddOnCard } from '../components/AddOnCard';

interface PackagesViewProps {
  packages: HerMarketPackage[];
  onSelectPackage: (pkg: HerMarketPackage, addOns?: HerMarketAddOn[]) => void;
  onBuyPackage?: (pkg: HerMarketPackage, addOns?: HerMarketAddOn[]) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  onSelectPackage,
  onBuyPackage
}) => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  const isStripeConfigured = Boolean(stripeKey && stripeKey.trim().startsWith('pk_'));

  const [selectedPkgId, setSelectedPkgId] = useState<string>('growth');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[1];
  const chosenAddOns = initialAddOns.filter((a) => selectedAddOnIds.includes(a.id));

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Dynamic pricing calculation in AUD
  const pkgPrice = selectedPkg?.price || 0;
  const oneTimeAddOns = chosenAddOns
    .filter((a) => a.period === 'one-time')
    .reduce((acc, curr) => acc + curr.price, 0);

  const monthlyAddOns = chosenAddOns
    .filter((a) => a.period === 'monthly')
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalOneTime = pkgPrice + oneTimeAddOns;
  const totalMonthly = monthlyAddOns;

  const handleChoose = (pkg: HerMarketPackage) => {
    setSelectedPkgId(pkg.id);
    onSelectPackage(pkg, chosenAddOns);
  };

  const handleBuy = (pkg: HerMarketPackage) => {
    setSelectedPkgId(pkg.id);
    if (onBuyPackage) {
      onBuyPackage(pkg, chosenAddOns);
    } else {
      onSelectPackage(pkg, chosenAddOns);
    }
  };

  return (
    <div className="space-y-12 pb-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Fixed-Price Digital Packages
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Priced in Australian Dollars for Australian small businesses, sole traders, and entrepreneurs. Compare packages below, customize with add-ons.
        </p>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedPkgId === pkg.id}
            onSelect={handleChoose}
            onBuy={handleBuy}
            onViewComparison={() => setShowComparisonTable(true)}
          />
        ))}
      </div>

      {/* Dynamic Package Customizer & Add-on Calculator */}
      <section className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9b667e]">
              Step 2 · Optional Add-Ons
            </span>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mt-0.5">
              Customize Your Selected Package
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Currently customizing:{' '}
              <strong className="text-[#4A154B]">{selectedPkg.name}</strong> ({formatAUD(pkgPrice)} AUD)
            </p>
          </div>

          {/* Real-time Dynamic Quote Ticker in AUD */}
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs text-right sm:min-w-[240px]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Estimated Investment (AUD)
            </div>
            <div className="text-2xl font-black text-[#4A154B] mt-0.5">
              {formatAUD(totalOneTime)}
              <span className="text-xs font-semibold text-gray-400 ml-1">one-time</span>
            </div>
            {totalMonthly > 0 ? (
              <div className="text-xs font-bold text-amber-800 mt-0.5">
                + {formatAUD(totalMonthly)}/month recurring
              </div>
            ) : (
              <div className="text-[10px] text-gray-400 mt-0.5">No recurring monthly add-ons</div>
            )}
          </div>
        </div>

        {/* Add-ons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {initialAddOns.map((addon) => (
            <AddOnCard
              key={addon.id}
              addon={addon}
              selected={selectedAddOnIds.includes(addon.id)}
              onToggle={toggleAddOn}
            />
          ))}
        </div>

        {/* Action bar with Dual Checkout options */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {chosenAddOns.length === 0
                ? 'Standard package scope selected'
                : `${chosenAddOns.length} add-on(s) included in estimate`}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onSelectPackage(selectedPkg, chosenAddOns)}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <span>Submit Scope Requirements</span>
            </button>

            <button
              onClick={() => (onBuyPackage ? onBuyPackage(selectedPkg, chosenAddOns) : onSelectPackage(selectedPkg, chosenAddOns))}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl text-xs font-black bg-[#4A154B] hover:bg-[#350c36] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-pink-300" />
              <span>Checkout {formatAUD(totalOneTime)} AUD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Side-by-Side Package Feature Comparison
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Detailed technical breakdown across Starter, Growth, and Premium tiers.
            </p>
          </div>
        </div>

        <PricingComparison packages={packages} onSelectPackage={handleChoose} />
      </section>

      {/* Disclaimers & Inclusions / Exclusions */}
      <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 space-y-4 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Transparent Exclusions & Deliverable Boundaries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
          <div>
            <h5 className="font-bold text-amber-900 mb-1">Items Excluded / Extra Cost:</h5>
            <ul className="list-disc pl-4 space-y-1 text-amber-900/90">
              <li>Domain registration and annual renewal fees (.com.au, .com, .store, etc.).</li>
              <li>Cloud hosting server subscriptions (AWS, Vercel, Netlify, etc.).</li>
              <li>Paid ad budgets for Google Ads, Facebook Ads, or Instagram campaigns.</li>
              <li>Third-party paid plugin licenses or specialized API subscriptions.</li>
              <li>Australian GST is inclusive where stated.</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-amber-900 mb-1">Scope & Growth Commitment:</h5>
            <p className="text-amber-900/90">
              HerMarket delivers world-class, tested, responsive websites and branding assets. We do not provide false promises or guarantee specific sales figures, viral traction, or search engine rankings, as real business growth depends on product quality, pricing, and broader market factors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
