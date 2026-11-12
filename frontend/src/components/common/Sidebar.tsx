import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Briefcase,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { user, logout } = useAuth();
  const { cartCount } = useMarket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'HerFinance', path: '/finance', icon: Wallet, highlight: 'Budget' },
    { name: 'HerCareer', path: '/career', icon: Briefcase, highlight: 'Jobs' },
    { name: 'HerBusiness', path: '/business', icon: Rocket, highlight: 'Launch' },
    { name: 'HerFund', path: '/fund', icon: Landmark, highlight: 'Grants' },
    { name: 'HerMarket', path: '/market', icon: ShoppingBag, badge: cartCount > 0 ? `${cartCount}` : undefined },
    { name: 'HerLearn', path: '/learn', icon: GraduationCap, highlight: 'Skills' },
    { name: 'HerNetwork', path: '/network', icon: Users2, highlight: 'Mentors' },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'Copilot', special: true }
  ];

  const secondaryNavItems = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-purple-100 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-purple-100">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#e11d48] flex items-center justify-center text-white shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 text-pink-200" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                HerRise<span className="text-[#fb7185]">AI</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium truncate">Fintech & Career Hub</p>
            </div>
          )}
        </NavLink>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-purple-50 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {!collapsed ? 'Modules & Platform' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative group ${
                  isActive
                    ? 'bg-[#4A154B] text-white shadow-md shadow-purple-950/20'
                    : item.special
                    ? 'text-purple-900 bg-purple-50/70 hover:bg-purple-100/80'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-[#4A154B]'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.special
                        ? 'text-[#4A154B] animate-pulse-subtle'
                        : 'text-gray-500 group-hover:text-[#4A154B]'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-pink-400 text-white'
                          : 'bg-[#fb7185] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {!collapsed ? 'Account & Preferences' : '•••'}
        </div>

        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-[#4A154B] font-semibold'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-[#4A154B]'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-[#4A154B]" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* User Mini Profile Card */}
      <div className="p-3 border-t border-purple-100 bg-purple-50/40">
        <div className={`flex items-center gap-3 p-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover border-2 border-purple-200 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-gray-900 truncate">{user?.name || 'HerRise Member'}</h5>
              <p className="text-[11px] text-gray-500 truncate">{user?.email || 'member@herrise.org'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-xs h-full bg-white shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

