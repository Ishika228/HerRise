import React, { useState } from 'react';
import { HerCareerLayout, HerCareerTab } from './HerCareerLayout';

// Core Views
import { HerCareerDashboardView } from './views/HerCareerDashboardView';
import { ResumeBuilderView } from './views/ResumeBuilderView';
import { ResumeAnalyzerView } from './views/ResumeAnalyzerView';
import { JobSearchView } from './views/JobSearchView';
import { ApplicationTrackerView } from './views/ApplicationTrackerView';
import { InterviewPrepView } from './views/InterviewPrepView';
import { CareerRestartView } from './views/CareerRestartView';
import { HerCareerAssistantView } from './views/HerCareerAssistantView';

const HerCareerContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HerCareerTab>('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'builder':
        return <ResumeBuilderView />;
      case 'analyzer':
        return <ResumeAnalyzerView />;
      case 'jobs':
        return <JobSearchView />;
      case 'tracker':
        return <ApplicationTrackerView />;
      case 'interview':
        return <InterviewPrepView />;
      case 'restart':
        return <CareerRestartView />;
      case 'assistant':
        return <HerCareerAssistantView />;
      case 'dashboard':
      default:
        return <HerCareerDashboardView onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <HerCareerLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveView()}
    </HerCareerLayout>
  );
};

// HerCareerProvider is already mounted at the App level (App.tsx).
// No need to re-wrap here — just render content directly.
export const HerCareerPage: React.FC = () => {
  return <HerCareerContent />;
};

export default HerCareerPage;
