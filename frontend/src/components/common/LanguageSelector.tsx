import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language, ALL_LANGUAGES, LanguageMeta } from '../../types';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'navbar' | 'dashboard' | 'mobile';
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'navbar',
  onLanguageChange
}) => {
  const { language, setLanguage } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  // Find active metadata if an "other" dropdown language is selected
  const activeDropdownLang = ALL_LANGUAGES.find(
    (l) => l.code === language && l.category !== 'primary'
  );

  const indianLanguages = ALL_LANGUAGES.filter((l) => l.category === 'indian');
  const globalLanguages = ALL_LANGUAGES.filter((l) => l.category === 'global');

  // Mobile layout
  if (variant === 'mobile') {
    return (
      <div className={`space-y-2.5 w-full ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#4A154B]" />
            <span>Language / भाषा:</span>
          </span>
          <div className="flex items-center gap-1 text-xs">
            {/* Directly visible English */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('en')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              EN
            </button>
            {/* Directly visible Hindi */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Dropdown for all other languages */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeDropdownLang
                ? 'bg-purple-100/70 border-[#4A154B] text-[#4A154B]'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>{activeDropdownLang ? `${activeDropdownLang.nativeName} (${activeDropdownLang.name})` : 'More Languages (मराठी, বাংলা, தமிழ்...)'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="mt-1.5 w-full bg-white border border-purple-100 rounded-2xl shadow-xl max-h-64 overflow-y-auto p-2 z-50 divide-y divide-gray-100">
              <div className="pb-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Indian Regional Languages
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {indianLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        language === lang.code
                          ? 'bg-[#4A154B] text-white font-bold'
                          : 'hover:bg-purple-50 text-gray-700'
                      }`}
                    >
                      <span className="truncate">{lang.nativeName}</span>
                      {language === lang.code && <Check className="w-3 h-3 ml-1 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  International Languages
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {globalLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        language === lang.code
                          ? 'bg-[#4A154B] text-white font-bold'
                          : 'hover:bg-purple-50 text-gray-700'
                      }`}
                    >
                      <span className="truncate">{lang.nativeName}</span>
                      {language === lang.code && <Check className="w-3 h-3 ml-1 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Navbar & Dashboard Header Layout
  return (
    <div
      ref={dropdownRef}
      className={`relative inline-flex items-center bg-purple-50/90 hover:bg-purple-50 border border-purple-100/90 rounded-xl p-1 text-xs font-semibold text-gray-700 shadow-xs transition-all ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-[#4A154B] ml-1.5 mr-1 shrink-0" />

      {/* 1. Directly visible English button */}
      <button
        type="button"
        onClick={() => handleSelectLanguage('en')}
        title="English"
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
          language === 'en'
            ? 'bg-[#4A154B] text-white shadow-xs'
            : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-100/60'
        }`}
      >
        EN
      </button>

      {/* 2. Directly visible Hindi button */}
      <button
        type="button"
        onClick={() => handleSelectLanguage('hi')}
        title="हिन्दी (Hindi)"
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
          language === 'hi'
            ? 'bg-[#4A154B] text-white shadow-xs'
            : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-100/60'
        }`}
      >
        हिन्दी
      </button>

      {/* 3. Other languages dropdown trigger */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title="Choose from other languages"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
          activeDropdownLang
            ? 'bg-[#4A154B] text-white shadow-xs'
            : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-100/60'
        }`}
      >
        <span className="truncate max-w-[80px]">
          {activeDropdownLang ? activeDropdownLang.nativeName : 'More'}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-purple-100 p-2.5 z-50 animate-in fade-in zoom-in-95 divide-y divide-purple-50">
          {/* Section 1: Indian Regional Languages */}
          <div className="pb-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900/60 px-2 py-1 flex items-center justify-between">
              <span>Indian Languages</span>
              <span className="text-[9px] text-purple-400 font-normal">10 Regional</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {indianLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#4A154B] text-white font-bold shadow-xs'
                      : 'hover:bg-purple-50 text-gray-700 hover:text-[#4A154B]'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold block truncate">{lang.nativeName}</span>
                    <span className={`text-[10px] block truncate ${language === lang.code ? 'text-pink-200' : 'text-gray-400'}`}>
                      {lang.name}
                    </span>
                  </div>
                  {language === lang.code && <Check className="w-3.5 h-3.5 ml-1 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Global Languages */}
          <div className="pt-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900/60 px-2 py-1 flex items-center justify-between">
              <span>International</span>
              <span className="text-[9px] text-purple-400 font-normal">Global</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {globalLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#4A154B] text-white font-bold shadow-xs'
                      : 'hover:bg-purple-50 text-gray-700 hover:text-[#4A154B]'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold block truncate">{lang.nativeName}</span>
                    <span className={`text-[10px] block truncate ${language === lang.code ? 'text-pink-200' : 'text-gray-400'}`}>
                      {lang.name}
                    </span>
                  </div>
                  {language === lang.code && <Check className="w-3.5 h-3.5 ml-1 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
