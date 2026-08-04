import React, { useState } from 'react';
import { Project, UserProfile, CustomerTab, EngineerProfile, EngineerBooking } from '../../types';
import { CustomerNav } from '../customer/CustomerNav';
import { OverviewTab } from '../customer/OverviewTab';
import { ProfileTab } from '../customer/ProfileTab';
import { CreatePlanTab } from '../customer/CreatePlanTab';
import { SavedPlansTab } from '../customer/SavedPlansTab';
import { AIGeneratorTab } from '../customer/AIGeneratorTab';
import { CostEstimatorTab } from '../customer/CostEstimatorTab';
import { MaterialPricesTab } from '../customer/MaterialPricesTab';
import { BrowseEngineersTab } from '../customer/BrowseEngineersTab';
import { BookEngineerTab } from '../customer/BookEngineerTab';
import { ReviewsTab } from '../customer/ReviewsTab';
import { NotificationsTab } from '../customer/NotificationsTab';
import { LandingPage } from '../landing/LandingPage';

import { AIChatDrawer } from '../planner/AIChatDrawer';
import { PlannerWizard } from '../planner/PlannerWizard';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

interface CustomerDashboardProps {
  user?: UserProfile | null;
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  onAddNewProject?: (p: Project) => void;
  onDeleteProject?: (id: string) => void;
  onSaveProfile?: (updated: Partial<UserProfile>) => void;
  onOpenNewWizard?: () => void;
  onOpenAIChat?: () => void;
  activeTab?: CustomerTab;
  onNavigateTab?: (tab: CustomerTab) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  projects,
  activeProject,
  onSelectProject,
  onUpdateProject,
  onAddNewProject,
  onDeleteProject,
  onSaveProfile,
  activeTab: controlledTab,
  onNavigateTab,
}) => {
  const [localActiveTab, setLocalActiveTab] = useState<CustomerTab>('landing');
  const activeTab = controlledTab || localActiveTab;

  const setActiveTab = (tab: CustomerTab) => {
    setLocalActiveTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };
  const [unreadCount, setUnreadCount] = useState<number>(
    MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length
  );

  const [selectedEngineerForBooking, setSelectedEngineerForBooking] = useState<EngineerProfile | null>(null);

  // Modals
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handlePlanCreated = (newProject: Project) => {
    if (typeof onAddNewProject === 'function') {
      onAddNewProject(newProject);
    }
    if (typeof onSelectProject === 'function') {
      onSelectProject(newProject);
    }
    setActiveTab('saved_plans');
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header Bar & Tab Navigation */}
      <CustomerNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'notifications') setUnreadCount(0);
        }}
        unreadCount={unreadCount}
      />

      {/* Main Tab View Switching */}
      {activeTab === 'landing' && (
        <LandingPage
          onOpenPlannerWizard={() => setIsWizardOpen(true)}
          onExploreEngineers={() => setActiveTab('browse_engineers')}
          onExploreEstimator={() => setActiveTab('cost_estimator')}
          onOpenAuth={() => setActiveTab('profile')}
        />
      )}

      {activeTab === 'overview' && (
        <OverviewTab
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onNavigateTab={setActiveTab}
          onUpdateProject={onUpdateProject}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenNewWizard={() => setIsWizardOpen(true)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileTab
          user={user}
          onSaveProfile={onSaveProfile}
        />
      )}

      {activeTab === 'create_plan' && (
        <CreatePlanTab
          onPlanCreated={handlePlanCreated}
          customerName={user?.name}
          customerEmail={user?.email}
        />
      )}

      {activeTab === 'saved_plans' && (
        <SavedPlansTab
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onNavigateTab={setActiveTab}
          onOpenNewWizard={() => setIsWizardOpen(true)}
          onDeleteProject={onDeleteProject}
        />
      )}

      {activeTab === 'ai_generator' && (
        <AIGeneratorTab
          onSaveGeneratedPlan={(p) => {
            if (typeof onAddNewProject === 'function') {
              onAddNewProject(p);
            }
            if (typeof onSelectProject === 'function') {
              onSelectProject(p);
            }
            setActiveTab('saved_plans');
          }}
          customerName={user?.name}
          customerEmail={user?.email}
        />
      )}

      {activeTab === 'cost_estimator' && (
        <CostEstimatorTab />
      )}

      {activeTab === 'material_prices' && (
        <MaterialPricesTab />
      )}

      {activeTab === 'browse_engineers' && (
        <BrowseEngineersTab
          onSelectEngineerForBooking={(eng) => setSelectedEngineerForBooking(eng)}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'book_engineer' && (
        <BookEngineerTab
          projects={projects}
          activeProject={activeProject}
          selectedEngineer={selectedEngineerForBooking}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsTab />
      )}

      {activeTab === 'notifications' && (
        <NotificationsTab
          onNavigateTab={setActiveTab}
          onClearUnreadCount={() => setUnreadCount(0)}
        />
      )}

      {/* Modals & Drawers */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      <PlannerWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={(newProject) => {
          if (typeof onAddNewProject === 'function') {
            onAddNewProject(newProject);
          }
          if (typeof onSelectProject === 'function') {
            onSelectProject(newProject);
          }
          setIsWizardOpen(false);
          setActiveTab('saved_plans');
        }}
      />

    </div>
  );
};
