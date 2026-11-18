import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Guard React DOM reconciliation when Google Translate modifies text nodes
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.apply(this, [child]) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
  };
}

// Ensure standard default language is English if not explicitly chosen
try {
  const currentLang = localStorage.getItem('herrise_user_lang');
  if (!currentLang || currentLang === 'en') {
    localStorage.setItem('herrise_user_lang', 'en');
    document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
} catch {
  // ignore
}

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

