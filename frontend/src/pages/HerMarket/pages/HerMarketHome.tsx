import React from 'react';
import {
  Globe,
  ShoppingBag,
  TrendingUp,
  Share2,
  Palette,
  Image,
  Search,
  Users2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Headphones,
  Laptop
} from 'lucide-react';
import { HerMarketPackage } from '../data/herMarketData';
import { PackageCard } from '../components/PackageCard';

interface HerMarketHomeProps {
  onNavigate: (tab: 'overview' | 'services' | 'websites' | 'packages' | 'my-services' | 'consultation') => void;
  packages: HerMarketPackage[];
  onSelectPackage: (pkg: HerMarketPackage) => void;
  onBuyPackage?: (pkg: HerMarketPackage) => void;
  onOpenConsultation: () => void;
}

export const HerMarketHome: React.FC<HerMarketHomeProps> = ({
  onNavigate,
  packages,
  onSelectPackage,
  onBuyPackage,
  onOpenConsultation
}) => {
  const serviceCategories = [
    {
      id: 'web-dev',
      title: 'Website Development',
      desc: 'Mobile-first, lightning-fast modern responsive websites that turn local visitors into paying customers.',
      icon: Globe,
      targetTab: 'websites' as const
    },
    {
      id: 'ecom-dev',
      title: 'E-commerce Development',
      desc: 'Online storefronts with catalogues, cart, UPI checkout, and automated WhatsApp order notifications.',
      icon: ShoppingBag,
      targetTab: 'websites' as const
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      desc: 'High-conversion Google & Meta paid ads campaigns to target verified local buyers in your city.',
      icon: TrendingUp,
      targetTab: 'services' as const
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      desc: 'Consistent aesthetic feeds, engaging reels, carousel graphics, and community engagement.',
      icon: Share2,
      targetTab: 'services' as const
    },
    {
      id: 'branding-logo',
      title: 'Branding & Logo Design',
      desc: 'Memorable brand marks, signature typography, and luxury color palettes for ambitious women founders.',
      icon: Palette,
      targetTab: 'services' as const
    },
    {
      id: 'promotional-designs',
      title: 'Promotional Designs',
      desc: 'High-impact festival posters, product menus, flyers, and double-sided luxury business cards.',
      icon: Image,
      targetTab: 'services' as const
    },
    {
      id: 'seo-services',
      title: 'SEO Services',
      desc: 'Google Business Profile local optimization and on-page SEO so customers find your boutique first.',
      icon: Search,
      targetTab: 'services' as const
    },
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      desc: '1-on-1 strategy sessions on digital positioning, pricing models, and omnichannel customer retention.',
      icon: Users2,
      targetTab: 'consultation' as const
    }
  ];

  return (
    <div className="space-y-12 pb-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2f0e32] via-[#4A154B] to-[#1f0a21] text-white p-7 sm:p-12 lg:p-16 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>HerMarket · Digital Agency Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]">
              Grow Your Business.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200">
                Build Your Digital Presence.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 max-w-xl leading-relaxed">
              From your first website to complete digital marketing, HerMarket provides affordable digital solutions to help your business reach more customers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('packages')}
                className="py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold bg-[#fb7185] hover:bg-[#f43f5e] text-white transition-all shadow-lg shadow-pink-900/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Explore Packages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenConsultation}
                className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get a Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro value props */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero advance payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated support</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white/10 p-5 border border-white/20 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                  Ready-Made Digital Studio
                </span>
              </div>

              {/* Mockup card 1 */}
              <div className="p-3.5 rounded-2xl bg-white text-gray-900 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#4A154B] bg-purple-50 px-2 py-0.5 rounded">
                    Featured Storefront
                  </span>
                  <span className="text-xs font-black text-emerald-600">Live in 7 Days</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900">
                  Boutique & Handcrafted Lifestyle Website
                </h4>
                <div className="h-24 rounded-xl overflow-hidden bg-purple-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                    alt="Boutique"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-lg font-black text-pink-300">A$499</div>
                  <div className="text-[10px] text-purple-200">Starter Website (AUD)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-lg font-black text-amber-300">100%</div>
                  <div className="text-[10px] text-purple-200">Mobile Responsive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EVERYTHING YOUR BUSINESS NEEDS TO GROW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#9b667e]">
              Service Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Everything Your Business Needs to Grow
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Curated digital growth capabilities specifically engineered for boutique owners, home bakers, artisans, and women-led ventures.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Individual Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#4A154B] text-[#4A154B] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-[#4A154B] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-50">
                  <button
                    onClick={() => {
                      if (cat.targetTab === 'consultation') {
                        onOpenConsultation();
                      } else {
                        onNavigate(cat.targetTab);
                      }
                    }}
                    className="text-xs font-bold text-[#4A154B] hover:text-[#350c36] flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DIGITAL SERVICE PACKAGES PREVIEW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#9b667e]">
              Flagship Growth Plans
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Ready-Made Digital Service Packages
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Select a transparent package designed for your current business stage. Growth plan is recommended for fastest market traction.
            </p>
          </div>
          <button
            onClick={() => onNavigate('packages')}
            className="text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Package Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={onSelectPackage}
              onBuy={onBuyPackage}
              onViewComparison={() => onNavigate('packages')}
            />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="rounded-3xl bg-[#4A154B] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">
            Need Guidance?
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Not sure which package fits your business?
          </h3>
          <p className="text-xs text-purple-100/80 max-w-lg">
            Schedule a 15-minute free consultation with our team. We’ll analyze your brand and provide an honest recommendation with zero pressure.
          </p>
        </div>
        <button
          onClick={onOpenConsultation}
          className="py-3 px-6 rounded-xl text-xs font-black bg-white text-[#4A154B] hover:bg-purple-50 transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          Get Free Consultation
        </button>
      </section>
    </div>
  );
};
