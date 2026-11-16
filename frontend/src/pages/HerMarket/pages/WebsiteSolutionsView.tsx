import React, { useState } from 'react';
import { Laptop } from 'lucide-react';
import { WebsiteTemplate, initialWebsiteTemplates } from '../data/herMarketData';
import { WebsitePreview } from '../components/WebsitePreview';

interface WebsiteSolutionsViewProps {
  onRequestTemplate?: (template: WebsiteTemplate) => void;
  onBuyTemplate?: (template: WebsiteTemplate) => void;
}

export const WebsiteSolutionsView: React.FC<WebsiteSolutionsViewProps> = ({
  onRequestTemplate,
  onBuyTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Retail & Storefront',
    'Corporate & Service',
    'Lifestyle & Wellness',
    'Food & Hospitality',
    'Creative & Freelancers',
    'Fashion & Handcrafted'
  ];

  const filtered = initialWebsiteTemplates.filter((tpl) => {
    return selectedCategory === 'All' || tpl.category.includes(selectedCategory) || selectedCategory.includes(tpl.category);
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#4A154B]">
          <Laptop className="w-3.5 h-3.5 text-[#4A154B]" />
          Industry-Specific Website Layouts
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Website Solutions</h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Pre-architected, conversion-optimized layouts created specifically for small business categories. Choose your layout and launch your online presence directly.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'bg-white border border-purple-100 text-gray-700 hover:bg-purple-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Website Solutions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((tpl) => (
          <WebsitePreview
            key={tpl.id}
            template={tpl}
            onBuy={onBuyTemplate}
            onRequest={onRequestTemplate}
          />
        ))}
      </div>
    </div>
  );
};
