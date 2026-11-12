import React, { useState } from 'react';
import { HerCareerProvider } from '../../context/HerCareerContext';
import { HerCareerLayout, HerCareerTab } from './HerCareerLayout';

// All 8 Core Views
import { HerCareerDashboardView } from './views/HerCareerDashboardView';
import { ResumeBuilderView } from './views/ResumeBuilderView';
import { ResumeAnalyzerView } from './views/ResumeAnalyzerView';
import { JobSearchView } from './views/JobSearchView';
import { ApplicationTrackerView } from './views/ApplicationTrackerView';
import { InterviewPrepView } from './views/InterviewPrepView';
import { CareerRoadmapView } from './views/CareerRoadmapView';
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
      case 'roadmap':
        return <CareerRoadmapView />;
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

export const HerCareerPage: React.FC = () => {
  return (
    <HerCareerProvider>
      <HerCareerContent />
    </HerCareerProvider>
  );
};

export default HerCareerPage;
