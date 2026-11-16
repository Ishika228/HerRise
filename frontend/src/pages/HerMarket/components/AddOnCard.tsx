import React from 'react';
import { Plus, Check, Clock, ShieldCheck } from 'lucide-react';
import { HerMarketAddOn, formatINR } from '../data/herMarketData';

interface AddOnCardProps {
  addon: HerMarketAddOn;
  selected: boolean;
  onToggle: (id: string) => void;
}

export const AddOnCard: React.FC<AddOnCardProps> = ({
  addon,
  selected,
  onToggle
}) => {
  const isMonthly = addon.period === 'monthly';

  return (
    <div
      onClick={() => onToggle(addon.id)}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        selected
          ? 'border-[#4A154B] bg-purple-50/40 ring-1 ring-[#4A154B]/30 shadow-xs'
          : 'border-purple-100 bg-white hover:border-purple-200 hover:bg-[#faf9fd]'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span
              className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 ${
                isMonthly ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-[#4A154B]'
              }`}
            >
              {isMonthly ? 'Monthly Retainer' : 'One-Time Add-on'}
            </span>
            <h4 className="text-xs font-bold text-gray-900">{addon.name}</h4>
          </div>
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              selected ? 'bg-[#4A154B] text-white' : 'border border-gray-200 text-gray-400 bg-white'
            }`}
          >
            {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{addon.description}</p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-xs">
        <span className="font-extrabold text-[#4A154B]">
          +{formatINR(addon.price)}
          <span className="text-[10px] text-gray-400 font-normal ml-0.5">
            {isMonthly ? '/mo' : ''}
          </span>
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          {selected ? 'Added' : 'Click to add'}
        </span>
      </div>
    </div>
  );
};
