import React from 'react';
import { Sparkles, ArrowRight, Eye, CheckCircle2, Clock } from 'lucide-react';
import { HerMarketService, formatINR } from '../data/herMarketData';

interface ServiceCardProps {
  service: HerMarketService;
  onSelect: (service: HerMarketService) => void;
  onViewDetails: (service: HerMarketService) => void;
  isInCart?: boolean;
  onToggleCart?: (service: HerMarketService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onViewDetails,
  isInCart = false,
  onToggleCart
}) => {
  const isMonthly = service.period === 'monthly';

  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Image header */}
        <div className="relative h-44 overflow-hidden bg-purple-50">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#4A154B] shadow-xs backdrop-blur-sm">
              {service.category}
            </span>
          </div>
          {isMonthly && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100/95 text-amber-900 shadow-xs backdrop-blur-sm">
                Monthly Retainer
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-[#4A154B] transition-colors">
              {service.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Deliverables snippet */}
          <div className="mt-4 pt-3 border-t border-purple-50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Includes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {service.features.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-[#faf9fd] px-2 py-0.5 rounded-lg border border-purple-100/60"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0">
        <div className="flex items-baseline justify-between py-3 border-t border-purple-50">
          <span className="text-[11px] text-gray-400 font-medium">Starting from</span>
          <div className="text-right">
            <span className="text-lg font-black text-[#4A154B]">{formatINR(service.price)}</span>
            <span className="text-[10px] text-gray-400 ml-1">
              {isMonthly ? '/month' : ''}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => onViewDetails(service)}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-gray-700 bg-purple-50/70 hover:bg-purple-100/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onSelect(service)}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#4A154B] hover:bg-[#350c36] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Get Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
