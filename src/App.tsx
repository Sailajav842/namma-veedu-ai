import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Project } from './types';
import { getStoredProjects, saveStoredProjects } from './services/api';
import { Header } from './components/common/Header';
import { DevDocsModal } from './components/common/DevDocsModal';
import { AuthModal } from './components/auth/AuthModal';
import { PlannerWizard } from './components/planner/PlannerWizard';
import { AIChatDrawer } from './components/planner/AIChatDrawer';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { EngineerDashboard } from './components/dashboards/EngineerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

function MainApp() {
  const { role, user } = useAuth();

  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [activeProject, setActiveProject] = useState<Project>(() => projects[0]);

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPlannerWizardOpen, setIsPlannerWizardOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    setActiveTab('saved_plans');
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activeProject.id === updated.id) {
      setActiveProject(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased transition-colors duration-300">
      
      {/* Header */}
      <Header
        onOpenNewProject={() => setIsPlannerWizardOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateTab={(tabId) => setActiveTab(tabId)}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Protected Dashboard Route Render based on Active Role */}
        {role === 'customer' && (
          <CustomerDashboard
            projects={projects}
            activeProject={activeProject}
            onSelectProject={setActiveProject}
            onOpenNewWizard={() => setIsPlannerWizardOpen(true)}
            onUpdateProject={handleUpdateProject}
            onAddNewProject={handleProjectCreated}
            onDeleteProject={(id) => {
              setProjects((prev) => prev.filter((p) => p.id !== id));
            }}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            activeTab={activeTab as any}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {role === 'engineer' && (
          <EngineerDashboard
            projects={projects}
            activeProject={activeProject}
            onSelectProject={setActiveProject}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {role === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Namma Veedu AI Platform (Tamil Nadu). All structural designs subject to local civil engineering verification.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDocsOpen(true)} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium">
              Source Code & Docs
            </button>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Gemini 3.6 Flash Server Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DevDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PlannerWizard
        isOpen={isPlannerWizardOpen}
        onClose={() => setIsPlannerWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
