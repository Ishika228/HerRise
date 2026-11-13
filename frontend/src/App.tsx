import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { FinanceProvider } from './context/FinanceContext';
import { MarketProvider } from './context/MarketContext';
import { HerCareerProvider } from './context/HerCareerContext';

import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Authentication/LoginPage';
import { RegisterPage } from './pages/Authentication/RegisterPage';
import { OnboardingPage } from './pages/Authentication/OnboardingPage';

import { DashboardOverview } from './pages/Dashboard/DashboardOverview';
import { HerFinancePage } from './pages/HerFinance/HerFinancePage';
import { HerCareerPage } from './pages/HerCareer/HerCareerPage';
import { HerBusinessPage } from './pages/HerBusiness/HerBusinessPage';
import { HerFundPage } from './pages/HerFund/HerFundPage';
import { HerMarketPage } from './pages/HerMarket/HerMarketPage';
import { HerLearnPage } from './pages/HerLearn/HerLearnPage';
import { HerNetworkPage } from './pages/HerNetwork/HerNetworkPage';
import { AIAssistantPage } from './pages/AIAssistant/AIAssistantPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <FinanceProvider>
            <MarketProvider>
              <HerCareerProvider>
                <Routes>
                  {/* Public & Landing Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />

                  {/* Main Dashboard & 7 Core Modules */}
                  <Route path="/dashboard" element={<DashboardOverview />} />
                  <Route path="/finance" element={<HerFinancePage />} />
                  <Route path="/career" element={<HerCareerPage />} />
                  <Route path="/business" element={<HerBusinessPage />} />
                  <Route path="/fund" element={<HerFundPage />} />
                  <Route path="/market" element={<HerMarketPage />} />
                  <Route path="/learn" element={<HerLearnPage />} />
                  <Route path="/network" element={<HerNetworkPage />} />

                  {/* Assistant & Preferences */}
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </HerCareerProvider>
            </MarketProvider>
          </FinanceProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
