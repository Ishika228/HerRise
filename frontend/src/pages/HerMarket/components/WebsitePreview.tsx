import React from 'react';
import { ArrowRight, CheckCircle2, CreditCard } from 'lucide-react';
import { WebsiteTemplate, formatINR } from '../data/herMarketData';

interface WebsitePreviewProps {
  template: WebsiteTemplate;
  onViewDemo?: (template: WebsiteTemplate) => void;
  onRequest?: (template: WebsiteTemplate) => void;
  onBuy?: (template: WebsiteTemplate) => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  template,
  onRequest,
  onBuy
}) => {
  const handleBuyClick = () => {
    if (onBuy) {
      onBuy(template);
    } else if (onRequest) {
      onRequest(template);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Mock browser card header */}
        <div className="relative h-48 overflow-hidden bg-purple-50">
          <img
            src={template.previewImage}
            alt={template.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Browser simulation top bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#4A154B] shadow-xs backdrop-blur-sm">
              {template.category}
            </span>
            <div className="flex gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-base font-black tracking-tight">{template.title}</h3>
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[36px]">
            {template.shortDesc}
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {template.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-[#4A154B] bg-purple-50 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Features snippet */}
          <div className="mt-4 pt-3 border-t border-purple-50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Key Features
            </p>
            <ul className="space-y-1">
              {template.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0">
        <div className="flex items-baseline justify-between py-3 border-t border-purple-50">
          <span className="text-[11px] text-gray-400">Starting from</span>
          <span className="text-lg font-black text-[#4A154B]">{formatINR(template.startingPrice)}</span>
        </div>

        <button
          onClick={handleBuyClick}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#4A154B] hover:bg-[#350c36] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99]"
        >
          <CreditCard className="w-3.5 h-3.5 text-pink-300" />
          <span>Buy Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
