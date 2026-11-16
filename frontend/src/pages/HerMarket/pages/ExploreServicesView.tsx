import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { HerMarketService, formatINR } from '../data/herMarketData';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal';

interface ExploreServicesViewProps {
  services: HerMarketService[];
  onSelectService: (service: HerMarketService) => void;
  onOpenBundleForm: (selectedServices: HerMarketService[]) => void;
}

export const ExploreServicesView: React.FC<ExploreServicesViewProps> = ({
  services,
  onSelectService,
  onOpenBundleForm
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bundledServiceIds, setBundledServiceIds] = useState<string[]>([]);
  const [activeModalService, setActiveModalService] = useState<HerMarketService | null>(null);

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Content', 'SEO'];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBundleItem = (service: HerMarketService) => {
    setBundledServiceIds((prev) =>
      prev.includes(service.id) ? prev.filter((id) => id !== service.id) : [...prev, service.id]
    );
  };

  const bundledServices = services.filter((s) => bundledServiceIds.includes(s.id));

  const bundleOneTime = bundledServices
    .filter((s) => s.period === 'one-time')
    .reduce((sum, s) => sum + s.price, 0);

  const bundleMonthly = bundledServices
    .filter((s) => s.period === 'monthly')
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#4A154B]">
          <Sparkles className="w-3.5 h-3.5 text-[#4A154B]" />
          A La Carte Catalog
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Explore Individual Services</h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Order standalone digital deliverables with upfront pricing. Bundle multiple services together to request an integrated project quote.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logo, website, SEO, reels..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 p-8 space-y-2">
          <p className="text-gray-500 text-sm">No services match your search or filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-[#4A154B] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <ServiceCard
              key={srv.id}
              service={srv}
              onSelect={onSelectService}
              onViewDetails={(s) => setActiveModalService(s)}
              isInCart={bundledServiceIds.includes(srv.id)}
              onToggleCart={toggleBundleItem}
            />
          ))}
        </div>
      )}

      {/* Floating Custom Service Bundle Drawer */}
      {bundledServices.length > 0 && (
        <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#4A154B] p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-[#4A154B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-gray-900">
                Custom Bundle: {bundledServices.length} service(s) selected
              </div>
              <div className="text-[11px] text-gray-500 flex flex-wrap gap-1.5 mt-0.5">
                {bundledServices.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded text-[10px] text-[#4A154B]"
                  >
                    {s.name}
                    <button
                      onClick={() => toggleBundleItem(s)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-base font-black text-[#4A154B]">
                {formatINR(bundleOneTime)}
                <span className="text-[10px] text-gray-400 ml-1">one-time</span>
              </div>
              {bundleMonthly > 0 && (
                <div className="text-[11px] font-bold text-amber-800">
                  +{formatINR(bundleMonthly)}/mo recurring
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenBundleForm(bundledServices)}
              className="py-2.5 px-5 rounded-xl text-xs font-black bg-[#4A154B] hover:bg-[#350c36] text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      <ServiceDetailsModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onSelect={(srv) => {
          setActiveModalService(null);
          onSelectService(srv);
        }}
      />
    </div>
  );
};
