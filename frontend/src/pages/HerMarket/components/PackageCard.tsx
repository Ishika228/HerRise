import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle, CreditCard } from 'lucide-react';
import { HerMarketPackage, formatAUD } from '../data/herMarketData';

interface PackageCardProps {
  pkg: HerMarketPackage;
  onSelect: (pkg: HerMarketPackage) => void;
  onBuy?: (pkg: HerMarketPackage) => void;
  onViewComparison?: () => void;
  selected?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onSelect,
  onBuy,
  onViewComparison,
  selected = false
}) => {
  const isGrowth = pkg.id === 'growth';
  const isPremium = pkg.id === 'premium';

  return (
    <div
      className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
        isGrowth
          ? 'bg-gradient-to-b from-white to-[#faf4fa] border-2 border-[#4A154B] shadow-xl shadow-purple-900/10 scale-[1.02] z-10'
          : 'bg-white border border-purple-100/90 shadow-sm hover:shadow-md hover:border-purple-200'
      } ${selected ? 'ring-2 ring-[#4A154B]' : ''} p-7`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs ${
              isGrowth
                ? 'bg-[#4A154B] text-white'
                : isPremium
                ? 'bg-gradient-to-r from-[#fb7185] to-[#f43f5e] text-white'
                : 'bg-purple-100 text-[#4A154B]'
            }`}
          >
            {isGrowth && <Sparkles className="w-3 h-3 text-amber-300" />}
            {pkg.badge}
          </span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="pt-2">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">{pkg.name}</h3>
          <p className="text-xs text-gray-500 mt-1 min-h-[32px] leading-relaxed">{pkg.tagline}</p>
        </div>

        {/* Pricing in Australian Dollars (AUD) */}
        <div className="mt-5 pb-5 border-b border-purple-100/70">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-[#4A154B] tracking-tight">
              {formatAUD(pkg.price)}
            </span>
            <span className="text-xs font-bold text-gray-500">AUD</span>
            <span className="text-xs font-semibold text-gray-400">
              /{pkg.period === 'one-time' ? 'one-time' : 'mo'}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">
            <strong className="text-gray-700">Best for:</strong> {pkg.targetCustomers}
          </p>
        </div>

        {/* Inclusions list */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9b667e] mb-3">
            Package Inclusions
          </p>
          <ul className="space-y-2.5">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-snug">
                <div
                  className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                    isGrowth ? 'bg-purple-100 text-[#4A154B]' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-8 pt-5 border-t border-purple-100/70 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelect(pkg)}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-gray-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Submit custom scope and business requirements"
          >
            <span>Custom Scope</span>
          </button>

          <button
            onClick={() => (onBuy ? onBuy(pkg) : onSelect(pkg))}
            className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 text-white shadow-xs transition-all cursor-pointer ${
              isGrowth
                ? 'bg-[#4A154B] hover:bg-[#350c36] shadow-purple-900/20 hover:scale-[1.02]'
                : isPremium
                ? 'bg-gradient-to-r from-[#4A154B] to-[#701a75] hover:opacity-95'
                : 'bg-[#4A154B] hover:bg-[#350c36]'
            }`}
            title="Instant checkout via Stripe / Card in AUD"
          >
            <CreditCard className="w-3.5 h-3.5 text-pink-300" />
            <span>Pay {formatAUD(pkg.price)}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Stripe / PayID Supported
          </span>
          {onViewComparison && (
            <button
              onClick={onViewComparison}
              className="text-[#4A154B] font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <HelpCircle className="w-3 h-3" />
              Compare
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
