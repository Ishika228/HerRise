import React from 'react';
import { X, CheckCircle, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { HerMarketService, formatINR } from '../data/herMarketData';

interface ServiceDetailsModalProps {
  service: HerMarketService | null;
  onClose: () => void;
  onSelect: (service: HerMarketService) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  onClose,
  onSelect
}) => {
  if (!service) return null;

  const isMonthly = service.period === 'monthly';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-purple-100 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#4A154B] px-2 py-0.5 rounded-md">
              {service.category}
            </span>
            <h3 className="text-xl font-black mt-1">{service.name}</h3>
          </div>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Service Description</h4>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf9fd] border border-purple-100">
            <h5 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2">
              Deliverables & Specifications
            </h5>
            <ul className="space-y-2">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 text-[#4A154B]">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700">Published Price</span>
              <div className="text-lg font-black">
                {formatINR(service.price)}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  {isMonthly ? '/month' : 'one-time'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-500">
              {isMonthly ? 'Recurring billing' : 'No hidden setup fees'}
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-purple-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onSelect(service);
            }}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#4A154B] hover:bg-[#350c36] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Get This Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
