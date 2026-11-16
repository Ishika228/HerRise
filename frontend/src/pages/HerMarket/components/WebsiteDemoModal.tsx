import React, { useState } from 'react';
import { X, Smartphone, Monitor, Tablet, CheckCircle, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { WebsiteTemplate, formatINR } from '../data/herMarketData';

interface WebsiteDemoModalProps {
  template: WebsiteTemplate | null;
  onClose: () => void;
  onRequest: (template: WebsiteTemplate) => void;
}

export const WebsiteDemoModal: React.FC<WebsiteDemoModalProps> = ({
  template,
  onClose,
  onRequest
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between gap-3 bg-purple-50/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#9b667e] bg-purple-100/70 px-2 py-0.5 rounded-md">
                {template.category}
              </span>
              <h3 className="text-base sm:text-lg font-black text-gray-900">{template.title}</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{template.shortDesc}</p>
          </div>

          {/* Device viewport toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-100 shadow-xs">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'desktop' ? 'bg-[#4A154B] text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'tablet' ? 'bg-[#4A154B] text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'mobile' ? 'bg-[#4A154B] text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mock Screen Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#1f1722]/95 flex flex-col items-center justify-center">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden border-4 border-gray-700 shadow-2xl bg-white ${
              device === 'mobile'
                ? 'w-[320px] h-[520px]'
                : device === 'tablet'
                ? 'w-[580px] h-[520px]'
                : 'w-full max-w-3xl h-[460px]'
            } flex flex-col`}
          >
            {/* Mock browser address bar */}
            <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-white rounded-md text-[10px] text-gray-500 px-3 py-1 text-center font-mono truncate border border-gray-200">
                https://{template.title.toLowerCase().replace(/[^a-z0-9]/g, '')}-demo.hermarket.app
              </div>
            </div>

            {/* Simulated website landing page */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              {/* Fake Hero Banner */}
              <div className="relative rounded-xl overflow-hidden h-40 bg-purple-900 text-white p-5 flex flex-col justify-end">
                <img
                  src={template.previewImage}
                  alt={template.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                    Live Demo Concept
                  </span>
                  <h4 className="text-lg font-black">{template.title}</h4>
                  <p className="text-xs text-purple-100/90 mt-1 line-clamp-1">{template.shortDesc}</p>
                </div>
              </div>

              {/* Template Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {template.highlights.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="font-bold text-[#4A154B] block text-[11px] mb-0.5">
                      ✓ Feature {idx + 1}
                    </span>
                    <p className="text-[10px] text-gray-600 leading-snug">{item}</p>
                  </div>
                ))}
              </div>

              {/* Standard Included Sections */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-800 mb-2">Included Components:</p>
                <div className="flex flex-wrap gap-1.5">
                  {template.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] bg-white text-gray-700 px-2 py-1 rounded-md border border-gray-200"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 sm:p-5 border-t border-purple-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-gray-400">Starting price for this layout:</span>
            <div className="text-xl font-black text-[#4A154B]">{formatINR(template.startingPrice)}</div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose();
                onRequest(template);
              }}
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-[#4A154B] hover:bg-[#350c36] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Request This Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
