import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldAlert, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1f1728] text-gray-300 pt-16 pb-10 border-t border-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/40">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#fb7185] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-pink-200" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                HerRise<span className="text-[#fb7185]">AI</span>
              </span>
            </Link>
            <p className="text-sm text-purple-200/80 font-medium">
              Her Future. Her Finance. Her Freedom.
            </p>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              HerRise AI is a unified, intelligent platform empowering women to master personal finances, relaunch rewarding careers, build thriving micro-enterprises, discover growth capital, and connect with mentors.
            </p>

            {/* Social SVGs */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#social" className="w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-[#4A154B] flex items-center justify-center text-gray-300 hover:text-white transition-colors" title="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a href="#social" className="w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-[#4A154B] flex items-center justify-center text-gray-300 hover:text-white transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#social" className="w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-[#4A154B] flex items-center justify-center text-gray-300 hover:text-white transition-colors" title="X / Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#social" className="w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-[#4A154B] flex items-center justify-center text-gray-300 hover:text-white transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-300">
              The 7 Modules
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/finance" className="hover:text-white transition-colors">
                  HerFinance (Money & Wealth)
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-white transition-colors">
                  HerCareer (Jobs & Returnships)
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:text-white transition-colors">
                  HerBusiness (Startup Studio)
                </Link>
              </li>
              <li>
                <Link to="/fund" className="hover:text-white transition-colors">
                  HerFund (Loans & Grants)
                </Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-white transition-colors">
                  HerMarket (Sell & Shop)
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  HerLearn (Courses & Quizzes)
                </Link>
              </li>
              <li>
                <Link to="/network" className="hover:text-white transition-colors">
                  HerNetwork (Mentors & Events)
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
                <span>support@herrise.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                <span>+91 (080) 4122-HERR</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Bengaluru & Mumbai, India</span>
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
          <p>© 2026 HerRise AI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 text-purple-300">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Women’s Economic Independence
          </p>
        </div>
      </div>
    </footer>
  );
};
