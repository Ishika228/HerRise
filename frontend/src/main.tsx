import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// One-time cache sanitization: Purge legacy dummy session data from localStorage
const CACHE_VERSION_KEY = 'herrise_data_v4_clean';
if (!localStorage.getItem(CACHE_VERSION_KEY)) {
  const staleKeys = [
    'herrise_user_session',
    'herrise_finance_transactions',
    'herrise_finance_goals',
    'herrise_finance_budget_categories',
    'herrise_finance_budget_total',
    'herfinance_profile',
    'herfinance_transactions',
    'herfinance_budgets',
    'herfinance_goals',
    'herfinance_setup_completed',
    'herfinance_notifications',
    'herfinance_aichat'
  ];
  staleKeys.forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  });
  try {
    localStorage.setItem(CACHE_VERSION_KEY, 'true');
  } catch {
    // ignore
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

