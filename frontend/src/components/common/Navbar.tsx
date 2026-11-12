import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, Globe, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#e11d48] flex items-center justify-center text-white shadow-md shadow-purple-950/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] bg-clip-text text-transparent">
                  HerRise<span className="text-[#fb7185] font-black">AI</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-500 tracking-wide hidden sm:block">
                Her Future. Her Finance. Her Freedom.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-[#4A154B] transition-colors">
              Home
            </Link>
            <a href="#about" className="hover:text-[#4A154B] transition-colors">
              About Us
            </a>
            <a href="#modules" className="hover:text-[#4A154B] transition-colors">
              Explore Modules
            </a>
            <a href="#how-it-works" className="hover:text-[#4A154B] transition-colors">
              How It Works
            </a>
            <a href="#success-stories" className="hover:text-[#4A154B] transition-colors">
              Success Stories
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-purple-50/80 border border-purple-100 rounded-lg p-1 text-xs font-semibold text-gray-600">
              <Globe className="w-3.5 h-3.5 text-[#4A154B] mr-1 ml-1" />
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-[#4A154B] text-white shadow-xs' : 'hover:text-[#4A154B]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-[#4A154B] text-white shadow-xs' : 'hover:text-[#4A154B]'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'mr' ? 'bg-[#4A154B] text-white shadow-xs' : 'hover:text-[#4A154B]'
                }`}
              >
                मराठी
              </button>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-purple-900/20 cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#4A154B] px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-purple-900/20 hover:shadow-lg cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-3 font-medium text-gray-800 text-base">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              About Us
            </a>
            <a
              href="#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Explore Modules
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              How It Works
            </a>
            <a
              href="#success-stories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Success Stories
            </a>
          </div>

          <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Language:</span>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded ${language === 'en' ? 'bg-[#4A154B] text-white' : 'bg-gray-100'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded ${language === 'hi' ? 'bg-[#4A154B] text-white' : 'bg-gray-100'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2.5 py-1 rounded ${language === 'mr' ? 'bg-[#4A154B] text-white' : 'bg-gray-100'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full text-center bg-[#4A154B] text-white py-3 rounded-xl font-semibold shadow-md"
              >
                Open Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-gray-700 font-semibold border border-gray-200 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#4A154B] text-white py-3 rounded-xl font-semibold shadow-md"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

