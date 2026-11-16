import React from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { HerMarketPackage, formatINR } from '../data/herMarketData';

interface PricingComparisonProps {
  packages: HerMarketPackage[];
  onSelectPackage: (pkg: HerMarketPackage) => void;
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  packages,
  onSelectPackage
}) => {
  const comparisonRows = [
    {
      feature: 'Website Pages Included',
      starter: '1–5 Pages',
      growth: 'Up to 8 Pages',
      premium: 'Up to 12 Pages'
    },
    {
      feature: 'Mobile-Friendly Responsive UI',
      starter: true,
      growth: true,
      premium: true
    },
    {
      feature: 'WhatsApp Direct Integration',
      starter: true,
      growth: true,
      premium: true
    },
    {
      feature: 'Contact & Lead Enquiry Forms',
      starter: true,
      growth: true,
      premium: true
    },
    {
      feature: 'Product / Service Showcase',
      starter: 'Basic Showcase',
      growth: 'Interactive Showcase',
      premium: 'Catalogue / Enquiry System'
    },
    {
      feature: 'SEO Setup & Meta Optimization',
      starter: 'Basic On-page SEO',
      growth: 'Complete On-page SEO',
      premium: 'Advanced SEO & Schema'
    },
    {
      feature: 'Google Business Profile Setup',
      starter: false,
      growth: 'Assistance Included',
      premium: 'Complete Optimization'
    },
    {
      feature: 'Social Media Promotional Creatives',
      starter: false,
      growth: '5 Custom Creatives',
      premium: '10 Custom Creatives'
    },
    {
      feature: 'Promotional Video Edits',
      starter: false,
      growth: false,
      premium: '2 Video Edits Included'
    },
    {
      feature: 'Digital Marketing & Social Strategy',
      starter: false,
      growth: 'Profile Optimization',
      premium: 'Complete Growth Strategy'
    },
    {
      feature: 'Google Analytics & Traffic Tracking',
      starter: false,
      growth: 'Basic Integration',
      premium: 'Full Analytics Dashboard'
    },
    {
      feature: 'Dedicated Technical Support',
      starter: '1 Month',
      growth: '1 Month',
      premium: '3 Months'
    }
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-purple-100 bg-white shadow-xs">
      <table className="w-full text-left border-collapse min-w-[680px]">
        <thead>
          <tr className="border-b border-purple-100 bg-purple-50/50">
            <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 w-2/5">
              Features & Deliverables
            </th>
            {packages.map((pkg) => {
              const isGrowth = pkg.id === 'growth';
              return (
                <th
                  key={pkg.id}
                  className={`p-5 text-center w-1/5 ${
                    isGrowth ? 'bg-purple-100/40 relative' : ''
                  }`}
                >
                  {isGrowth && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-[#4A154B] text-white px-2 py-0.5 rounded-full mb-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      Recommended
                    </span>
                  )}
                  <div className="text-xs font-black text-gray-900">{pkg.name.split('–')[0].trim()}</div>
                  <div className="text-base font-black text-[#4A154B] mt-1">{formatINR(pkg.price)}</div>
                  <div className="text-[10px] text-gray-400 font-normal">one-time setup</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-50 text-xs">
          {comparisonRows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf9fd]/40'}>
              <td className="p-4 font-semibold text-gray-800">{row.feature}</td>
              {(['starter', 'growth', 'premium'] as const).map((key) => {
                const val = row[key];
                const isGrowth = key === 'growth';
                return (
                  <td
                    key={key}
                    className={`p-4 text-center font-medium ${
                      isGrowth ? 'bg-purple-50/30 text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {typeof val === 'boolean' ? (
                      val ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span>{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-purple-100 bg-purple-50/30">
            <td className="p-5 text-xs text-gray-500 font-medium">
              * Domain, cloud hosting, ad budget & taxes extra as applicable.
            </td>
            {packages.map((pkg) => (
              <td key={pkg.id} className="p-5 text-center">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pkg.id === 'growth'
                      ? 'bg-[#4A154B] text-white hover:bg-[#350c36] shadow-sm'
                      : 'bg-white border border-purple-200 text-[#4A154B] hover:bg-purple-50'
                  }`}
                >
                  <span>Select</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
