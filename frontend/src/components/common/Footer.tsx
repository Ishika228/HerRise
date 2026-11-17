import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1f1728] text-gray-300 pt-16 pb-10 border-t border-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/40">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="HerRise"
                className="w-10 h-10 object-contain shrink-0"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                HerRise
              </span>
            </Link>
            <p className="text-sm text-purple-200/80 font-medium">
              Her Future. Her Finance. Her Freedom.
            </p>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              HerRise is a unified, intelligent platform empowering women to master personal finances, relaunch rewarding careers, build thriving micro-enterprises, discover growth capital, and connect with mentors.
            </p>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-300">
              The 7 Modules
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/finance" className="hover:text-white transition-colors">
                  HerFinance
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-white transition-colors">
                  HerCareer
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:text-white transition-colors">
                  HerBusiness
                </Link>
              </li>
              <li>
                <Link to="/fund" className="hover:text-white transition-colors">
                  HerFund
                </Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-white transition-colors">
                  HerMarket
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  HerLearn
                </Link>
              </li>
              <li>
                <Link to="/network" className="hover:text-white transition-colors">
                  HerNetwork
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-300">
              Platform & AI
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/ai-assistant" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  Unified AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Profile & Skills
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-white transition-colors">
                  Goals Onboarding Wizard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-300">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>support@herrise.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                <span>+61 (02) 9122-HERR</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Sydney & Melbourne, Australia</span>
              </li>
              <li className="pt-2">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 HerRise Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
