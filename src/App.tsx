import React from 'react';
import { HelpdeskProvider, useHelpdesk } from './context/HelpdeskContext';
import { ManagementSidebar } from './components/layout/ManagementSidebar';
import { FloatingWindowManager } from './components/floating/FloatingWindowManager';

// Management Views
import { DashboardView } from './views/management/DashboardView';
import { ClientsView } from './views/management/ClientsView';
import { TechUsersView } from './views/management/TechUsersView';
import { TeamsView } from './views/management/TeamsView';
import { VerticalsView } from './views/management/VerticalsView';
import { WhatsAppView } from './views/management/WhatsAppView';
import { WorkflowsView } from './views/management/WorkflowsView';
import { MessagesAndCommandsView } from './views/management/MessagesAndCommandsView';
import { WorkspaceView } from './views/management/WorkspaceView';
import { AIAgentView } from './views/management/AIAgentView';
import { DevelopmentView } from './views/management/DevelopmentView';
import { KnowledgeBaseView } from './views/management/KnowledgeBaseView';
import { BackupView } from './views/management/BackupView';
import { ReportsView } from './views/management/ReportsView';
import { AuditView } from './views/management/AuditView';
import { SettingsView } from './views/management/SettingsView';

// Onboarding Views
import { OnboardingWizard } from './views/onboarding/OnboardingWizard';
import { OnboardingDashboard } from './views/onboarding/OnboardingDashboard';

// Helpdesk View
import { HelpdeskInboxView } from './views/helpdesk/HelpdeskInboxView';

// Auth View
import { LoginView } from './views/auth/LoginView';

const AppContent: React.FC = () => {
  const { currentPath, currentUser, isAuthenticated, navigate, activeToast, clearToast } = useHelpdesk();

  // If user is disconnected, display LoginView
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <LoginView />
        {activeToast && (
          <div className="fixed top-6 right-4 z-50 flex items-start gap-3 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-4">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                activeToast.type === 'success'
                  ? 'bg-emerald-500'
                  : activeToast.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-100">{activeToast.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{activeToast.message}</div>
            </div>
            <button onClick={clearToast} className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer">
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // Route protection: Técnico acessa estritamente a área de atendimento
  React.useEffect(() => {
    if (currentUser?.role === 'technical_user' && !currentPath.startsWith('/helpdesk')) {
      navigate('/helpdesk/inbox');
    }
  }, [currentUser, currentPath, navigate]);

  // If path is onboarding wizard, render standalone full-screen wizard
  if (currentPath === '/onboarding' || currentPath === '/onboarding/resume') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <OnboardingWizard />
        <FloatingWindowManager />
        {activeToast && (
          <div className="fixed top-4 right-4 z-50 flex items-start gap-3 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-4">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                activeToast.type === 'success'
                  ? 'bg-emerald-500'
                  : activeToast.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-100">{activeToast.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{activeToast.message}</div>
            </div>
            <button onClick={clearToast} className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer">
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // If path is Helpdesk / Atendimento inbox (barra superior removida, layout full-height)
  if (currentPath.startsWith('/helpdesk')) {
    return (
      <div className="h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans">
        <HelpdeskInboxView />
        <FloatingWindowManager />
        {activeToast && (
          <div className="fixed top-4 right-4 z-50 flex items-start gap-3 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-4">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                activeToast.type === 'success'
                  ? 'bg-emerald-500'
                  : activeToast.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-100">{activeToast.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{activeToast.message}</div>
            </div>
            <button onClick={clearToast} className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer">
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // Management Layout (/gestao/*) (barra superior removida)
  const renderManagementContent = () => {
    switch (currentPath) {
      case '/gestao/dashboard':
        return <DashboardView />;
      case '/gestao/clientes':
        return <ClientsView />;
      case '/gestao/usuarios-tecnicos':
        return <TechUsersView />;
      case '/gestao/equipes':
        return <TeamsView />;
      case '/gestao/verticais':
        return <VerticalsView />;
      case '/gestao/whatsapp':
        return <WhatsAppView />;
      case '/gestao/fluxos':
        return <WorkflowsView />;
      case '/gestao/mensagens':
        return <MessagesAndCommandsView />;
      case '/gestao/workspace':
        return <WorkspaceView />;
      case '/gestao/agente-ia':
        return <AIAgentView />;
      case '/gestao/desenvolvimento':
        return <DevelopmentView />;
      case '/gestao/base-conhecimento':
        return <KnowledgeBaseView />;
      case '/gestao/backup':
        return <BackupView />;
      case '/gestao/relatorios':
        return <ReportsView />;
      case '/gestao/auditoria':
        return <AuditView />;
      case '/gestao/configuracoes':
        return <SettingsView />;
      case '/gestao/onboarding':
        return <OnboardingDashboard />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <div className="flex-1 flex overflow-hidden">
        <ManagementSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">{renderManagementContent()}</div>
        </main>
      </div>
      <FloatingWindowManager />
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 flex items-start gap-3 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-4">
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
              activeToast.type === 'success'
                ? 'bg-emerald-500'
                : activeToast.type === 'warning'
                ? 'bg-amber-500'
                : 'bg-indigo-500'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-100">{activeToast.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{activeToast.message}</div>
          </div>
          <button onClick={clearToast} className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <HelpdeskProvider>
      <AppContent />
    </HelpdeskProvider>
  );
}
