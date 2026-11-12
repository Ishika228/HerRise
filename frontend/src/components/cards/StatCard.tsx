import React, { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#4A154B]',
  bgColor = 'bg-purple-50',
  badge
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${bgColor} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      {/* Main value */}
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-[#4A154B]">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle / change */}
      {(change || subtitle) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={`flex items-center gap-0.5 font-bold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-gray-500 font-medium truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

