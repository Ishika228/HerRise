import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { FinanceProvider } from './context/FinanceContext';
import { HerFinanceProvider } from './context/HerFinanceContext';
import { MarketProvider } from './context/MarketContext';
import { HerCareerProvider } from './context/HerCareerContext';

const LandingPage = React.lazy(() =>
  import('./pages/Landing/LandingPage').then(({ LandingPage }) => ({ default: LandingPage }))
);
const LoginPage = React.lazy(() =>
  import('./pages/Authentication/LoginPage').then(({ LoginPage }) => ({ default: LoginPage }))
);
const RegisterPage = React.lazy(() =>
  import('./pages/Authentication/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage }))
);
const OnboardingPage = React.lazy(() =>
  import('./pages/Authentication/OnboardingPage').then(({ OnboardingPage }) => ({ default: OnboardingPage }))
);
const DashboardOverview = React.lazy(() =>
  import('./pages/Dashboard/DashboardOverview').then(({ DashboardOverview }) => ({ default: DashboardOverview }))
);
const HerFinancePage = React.lazy(() =>
  import('./pages/HerFinance/HerFinancePage').then(({ HerFinancePage }) => ({ default: HerFinancePage }))
);
const HerCareerPage = React.lazy(() =>
  import('./pages/HerCareer/HerCareerPage').then(({ HerCareerPage }) => ({ default: HerCareerPage }))
);
const HerBusinessPage = React.lazy(() =>
  import('./pages/HerBusiness/HerBusinessPage').then(({ HerBusinessPage }) => ({ default: HerBusinessPage }))
);
const HerFundPage = React.lazy(() =>
  import('./pages/HerFund/HerFundPage').then(({ HerFundPage }) => ({ default: HerFundPage }))
);
const HerMarketPage = React.lazy(() =>
  import('./pages/HerMarket/HerMarketPage').then(({ HerMarketPage }) => ({ default: HerMarketPage }))
);
const DigitalServicesAdminPage = React.lazy(() =>
  import('./pages/DigitalServices/DigitalServicesAdminPage').then(({ DigitalServicesAdminPage }) => ({ default: DigitalServicesAdminPage }))
);
const HerLearnPage = React.lazy(() =>
  import('./pages/HerLearn/HerLearnPage').then(({ HerLearnPage }) => ({ default: HerLearnPage }))
);
const HerNetworkPage = React.lazy(() =>
  import('./pages/HerNetwork/HerNetworkPage').then(({ HerNetworkPage }) => ({ default: HerNetworkPage }))
);
const AIAssistantPage = React.lazy(() =>
  import('./pages/AIAssistant/AIAssistantPage').then(({ AIAssistantPage }) => ({ default: AIAssistantPage }))
);
const ProfilePage = React.lazy(() =>
  import('./pages/Profile/ProfilePage').then(({ ProfilePage }) => ({ default: ProfilePage }))
);
const SettingsPage = React.lazy(() =>
  import('./pages/Settings/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage }))
);

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <HerFinanceProvider>
            <FinanceProvider>
              <MarketProvider>
                <HerCareerProvider>
                  <Suspense
                    fallback={
                      <div className="flex min-h-screen items-center justify-center bg-[#faf9fd] text-sm font-medium text-[#4A154B]">
                        Loading HerRise...
                      </div>
                    }
                  >
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
                      <Route path="/market/admin" element={<DigitalServicesAdminPage />} />
                      <Route path="/learn" element={<HerLearnPage />} />
                      <Route path="/network" element={<HerNetworkPage />} />

                      {/* Assistant & Preferences */}
                      <Route path="/ai-assistant" element={<AIAssistantPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />

                      {/* Catch-all redirect */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </HerCareerProvider>
              </MarketProvider>
            </FinanceProvider>
          </HerFinanceProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
