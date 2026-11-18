import React, { useState } from 'react';
import { HerFinanceProvider, useHerFinance } from '../../context/HerFinanceContext';
import { HerFinanceLayout } from './HerFinanceLayout';
import { IncomeIntakeScreen } from './components/IncomeIntakeScreen';
import { HerFinanceDashboardView } from './views/HerFinanceDashboardView';

const HerFinanceContent: React.FC = () => {
  const { profile, totalIncome } = useHerFinance();
  const [hasCompletedIntake, setHasCompletedIntake] = useState(false);

  // Reset local intake completion state whenever the active user switches
  React.useEffect(() => {
    setHasCompletedIntake(false);
  }, [profile.userId]);

  // Check if the active user has entered their monthly income
  const hasIncome = (profile.monthlyIncome > 0 || totalIncome > 0) || hasCompletedIntake;

  return (
    <HerFinanceLayout>
      {!hasIncome ? (
        <IncomeIntakeScreen onComplete={() => setHasCompletedIntake(true)} />
      ) : (
        <HerFinanceDashboardView />
      )}
    </HerFinanceLayout>
  );
};

export const HerFinancePage: React.FC = () => {
  return <HerFinanceContent />;
};

export default HerFinancePage;
