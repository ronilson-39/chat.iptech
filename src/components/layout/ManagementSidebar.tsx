import React, { useState, useEffect } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { IPTechLogo } from '../common/IPTechLogo';
import { SidebarProfileMenu } from './SidebarProfileMenu';
import { SidebarNotificationsMenu } from './SidebarNotificationsMenu';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Network,
  Layers,
  Smartphone,
  GitBranch,
  MessageSquare,
  Sparkles,
  Terminal,
  Code2,
  BookOpen,
  Database,
  BarChart3,
  ShieldCheck,
  Settings,
  CheckCircle2,
  FolderGit2,
  Menu,
  X,
  ChevronRight,
  Headphones,
} from 'lucide-react';

export const ManagementSidebar: React.FC = () => {
  const { currentPath, navigate, currentUser, hasPermission } = useHelpdesk();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Resizable sidebar width for Management (mouse adjustable)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('management_sidebar_width');
      return saved ? parseInt(saved, 10) : 240;
    } catch {
      return 240;
    }
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const clamped = Math.min(Math.max(e.clientX, 68), 320);
      setSidebarWidth(clamped);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        try {
          localStorage.setItem('management_sidebar_width', sidebarWidth.toString());
        } catch {}
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, sidebarWidth]);

  const menuItems = [
    { label: 'Dashboard', path: '/gestao/dashboard', icon: LayoutDashboard },
    { label: 'Clientes', path: '/gestao/clientes', icon: Users, perm: 'manage_clients' },
    { label: 'Usuários Técnicos', path: '/gestao/usuarios-tecnicos', icon: UserCheck, perm: 'manage_users' },
    { label: 'Equipes', path: '/gestao/equipes', icon: Network, perm: 'manage_teams' },
    { label: 'Verticais', path: '/gestao/verticais', icon: Layers, perm: 'manage_verticals' },
    { label: 'WhatsApp', path: '/gestao/whatsapp', icon: Smartphone, perm: 'manage_whatsapp' },
    { label: 'Fluxos (Workflows)', path: '/gestao/fluxos', icon: GitBranch, perm: 'manage_workflows' },
    { label: 'Mensagens & Comandos', path: '/gestao/mensagens', icon: MessageSquare, perm: 'manage_messages' },
    { label: 'Workspace (Threads)', path: '/gestao/workspace', icon: FolderGit2 },
    { label: 'Agente IA (Gemini)', path: '/gestao/agente-ia', icon: Sparkles, perm: 'manage_ai' },
    { label: 'Desenvolvimento', path: '/gestao/desenvolvimento', icon: Code2, restricted: true },
    { label: 'Base de Conhecimento', path: '/gestao/base-conhecimento', icon: BookOpen },
    { label: 'Backup / Importação', path: '/gestao/backup', icon: Database, perm: 'manage_organization' },
    { label: 'Relatórios & SLA', path: '/gestao/relatorios', icon: BarChart3, perm: 'view_reports' },
    { label: 'Auditoria de Segurança', path: '/gestao/auditoria', icon: ShieldCheck, perm: 'manage_organization' },
    { label: 'Configurações', path: '/gestao/configuracoes', icon: Settings, perm: 'manage_settings' },
    { label: 'Status do Onboarding', path: '/gestao/onboarding', icon: CheckCircle2 },
  ];

  const isRestrictedTechnician = currentUser.role === 'technical_user';
  const isExpanded = sidebarWidth > 90;

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header with IPTech Logo and Name */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <IPTechLogo className="w-8 h-8 drop-shadow-md shrink-0" />
          {isExpanded && (
            <div className="min-w-0 flex-1 truncate">
              <div className="text-sm font-bold text-white tracking-wide leading-tight">IPTech</div>
              <div className="text-[10px] text-slate-400 truncate">Painel de Gestão</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Button to go to Central de Atendimento (Inbox) */}
      <div className="p-2 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            navigate('/helpdesk/inbox');
            setMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentPath.startsWith('/helpdesk')
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300'
          }`}
          title="Abrir Central de Atendimento (Inbox)"
        >
          <Headphones className="w-4 h-4 shrink-0 text-emerald-400" />
          {isExpanded && <span className="truncate">Central Atendimento</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          const isPermitted = !item.perm || hasPermission(item.perm);

          if (!isPermitted && isRestrictedTechnician) {
            return null;
          }

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileDrawerOpen(false);
              }}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${isExpanded ? 'gap-2.5 px-3 py-2' : 'justify-center p-2'}`}
              title={item.label}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />
              {isExpanded && <span className="truncate">{item.label}</span>}
              {isExpanded && item.restricted && (
                <span className="ml-auto text-[9px] px-1 rounded bg-red-900/40 text-red-300 border border-red-800/50">
                  Dev
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Notification icon directly above profile icon */}
      <div className="p-2 border-t border-slate-800 flex flex-col items-center gap-1.5 shrink-0">
        <SidebarNotificationsMenu isExpanded={isExpanded} />
        <SidebarProfileMenu isExpanded={isExpanded} />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl text-xs font-bold transition active:scale-95"
        >
          <Menu className="w-4 h-4" />
          <span>Menu Gestão</span>
        </button>
      </div>

      {/* Desktop Sidebar with Mouse Resizing */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="hidden md:flex relative bg-slate-900/95 border-r border-slate-800 flex-col shrink-0 select-none transition-[width] duration-75 z-40"
      >
        <NavContent />

        {/* Mouse Resize Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/60 transition z-30 group ${
            isResizing ? 'bg-indigo-500' : ''
          }`}
          title="Arraste para ajustar a largura da barra lateral"
        >
          <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-indigo-400 group-active:bg-indigo-400 rounded-full mx-auto my-auto absolute top-1/2 -translate-y-1/2 right-0.5" />
        </div>
      </aside>

      {/* Mobile Overlay Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden flex">
          <div className="w-64 bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <NavContent />
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}
    </>
  );
};
