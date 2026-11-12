import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  route: string;
  badge?: string;
  gradient: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  number,
  name,
  tagline,
  description,
  icon: Icon,
  features,
  route,
  badge,
  gradient
}) => {
  return (
    <div className="bg-white rounded-3xl border border-purple-100 p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${gradient}`} />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-13 h-13 rounded-2xl bg-purple-50 flex items-center justify-center text-[#4A154B] group-hover:bg-[#4A154B] group-hover:text-white transition-all shadow-xs">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-100 text-[#be185d]">
                {badge}
              </span>
            )}
            <span className="text-xs font-mono font-bold text-gray-300">
              #{number}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4A154B] transition-colors">
          {name}
        </h3>
        <p className="text-xs font-semibold text-[#fb7185] mt-0.5 mb-3">{tagline}</p>
        <p className="text-xs text-gray-600 leading-relaxed mb-5">{description}</p>

        {/* Feature bullets */}
        <div className="space-y-2 mb-6 pt-2 border-t border-purple-50">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action link */}
      <Link
        to={route}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50 text-[#4A154B] font-semibold text-xs hover:bg-[#4A154B] hover:text-white transition-all group/btn"
      >
        <span>Explore {name}</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

