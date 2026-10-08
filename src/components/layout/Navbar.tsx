import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { UserStatus } from '../../types';
import { LoginModal } from '../auth/LoginModal';
import { IPTechLogo } from '../common/IPTechLogo';
import {
  Headphones,
  Sliders,
  Sparkles,
  PhoneCall,
  UserCheck,
  RotateCcw,
  Bell,
  CheckCircle,
  HelpCircle,
  Radio,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sun,
  Moon,
  MessageSquare,
  Columns,
  Check,
  Trash2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    users,
    switchUserById,
    simulateIncomingClientMessage,
    resetAllData,
    activeToast,
    clearToast,
    theme,
    toggleTheme,
    logout,
    pushNotifications,
    pushPermission,
    requestPushPermission,
    dispatchPushNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useHelpdesk();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(currentUser.status || 'online');

  const statusColors: Record<UserStatus, string> = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    away: 'bg-orange-500',
    offline: 'bg-slate-400',
  };

  const statusLabels: Record<UserStatus, string> = {
    online: 'Online',
    busy: 'Ocupado',
    away: 'Ausente',
    offline: 'Offline',
  };

  const isTechnicalUser = currentUser.role === 'technical_user';

  return (
    <>
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-3 sm:px-4 sticky top-0 z-40 select-none">
        {/* Brand & Area Switcher */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => {
              if (isTechnicalUser) {
                navigate('/helpdesk/inbox');
              } else {
                navigate('/gestao/dashboard');
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          >
            <IPTechLogo className="w-8 h-8 drop-shadow-md group-hover:scale-105 transition shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                IPTech
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium hidden xs:inline-block">
                  v1.0
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 leading-none truncate max-w-[130px] sm:max-w-none">
                {isTechnicalUser ? 'Módulo de Atendimento Técnico' : 'Omnichannel & Gestão'}
              </div>
            </div>
          </div>

          {/* Minimalist Navigation Track Bar (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-full border border-slate-800 shadow-inner">
            {/* Gestão tab: Hidden if technician */}
            {!isTechnicalUser && (
              <button
                onClick={() => navigate('/gestao/dashboard')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  currentPath.startsWith('/gestao')
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Gestão
              </button>
            )}

            {/* Atendimento / Inbox tab: Available for both */}
            <button
              onClick={() => navigate('/helpdesk/inbox')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                currentPath.startsWith('/helpdesk')
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              Atendimento (Inbox)
            </button>

            {/* Onboarding tab: Hidden if technician */}
            {!isTechnicalUser && (
              <button
                onClick={() => navigate('/onboarding')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  currentPath.startsWith('/onboarding')
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                Onboarding
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Botão de Notificações Push (WhatsApp & Kanban) - Request 1 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
              title="Notificações Push (WhatsApp & Kanban)"
            >
              <Bell className="w-4 h-4" />
              {pushNotifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse border-2 border-slate-900">
                  {pushNotifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Notificações Push</span>
                    {pushNotifications.filter((n) => !n.read).length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {pushNotifications.filter((n) => !n.read).length} novas
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-slate-400 hover:text-indigo-300 font-semibold transition"
                      title="Marcar todas como lidas"
                    >
                      Marcar lidas
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-[10px] text-slate-400 hover:text-red-400 font-semibold transition"
                      title="Limpar histórico"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                {/* Status do Web Push do Navegador */}
                <div className="px-3.5 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${pushPermission === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-[11px] text-slate-300">
                      {pushPermission === 'granted' ? 'Push no Navegador: Ativo' : 'Push no Navegador: Desativado'}
                    </span>
                  </div>
                  {pushPermission !== 'granted' ? (
                    <button
                      type="button"
                      onClick={requestPushPermission}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition shadow-sm"
                    >
                      Ativar Web Push
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold">Autorizado</span>
                  )}
                </div>

                {/* Ações Rápidas de Teste */}
                <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Simular Alerta:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        simulateIncomingClientMessage();
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer"
                      title="Disparar simulação de mensagem WhatsApp"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatchPushNotification({
                          title: '📋 Nova Tarefa no Kanban: Revisão Tributária',
                          body: `Atribuída ao técnico ${currentUser.name} | Cliente: Gamma Comércio Exterior`,
                          type: 'kanban_task_assigned',
                          data: {
                            technicianName: currentUser.name,
                            clientName: 'Gamma Comércio Exterior',
                            protocol: 'IP-2026-991204',
                          },
                        });
                      }}
                      className="px-2 py-0.5 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer"
                      title="Disparar simulação de tarefa atribuída no Kanban"
                    >
                      <Columns className="w-2.5 h-2.5" />
                      <span>Kanban</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Notificações */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {pushNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Nenhuma notificação registrada.
                    </div>
                  ) : (
                    pushNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setNotificationsOpen(false);
                          navigate('/helpdesk/inbox');
                        }}
                        className={`p-3 transition hover:bg-slate-800/70 cursor-pointer flex items-start gap-3 text-left ${
                          !notif.read ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'whatsapp_message'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}
                        >
                          {notif.type === 'whatsapp_message' ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Columns className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.body}
                          </p>
                        </div>

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botão de Modo Claro / Modo Escuro (Request 2) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold transition cursor-pointer text-slate-200 shadow-sm"
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            )}
          </button>

          {/* Botão de Desconectar do Sistema (Solicitação: clicar desconecta automaticamente) */}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/70 text-red-300 hover:text-red-100 text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95 group"
            title="Desconectar do sistema automaticamente"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Desconectar</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition hidden sm:inline-flex"
            title="Restaurar dados demonstrativos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Technician Status Selector */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700/80 transition cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${statusColors[currentStatus]}`} />
              <span className="font-medium text-[11px] hidden xs:inline">{statusLabels[currentStatus]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                {(['online', 'busy', 'away', 'offline'] as UserStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setCurrentStatus(st);
                      setStatusDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-xs text-slate-200 hover:bg-slate-700 text-left transition"
                  >
                    <span className={`w-2 h-2 rounded-full ${statusColors[st]}`} />
                    {statusLabels[st]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User/Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition cursor-pointer"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-600"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 max-w-[110px] truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isTechnicalUser ? 'Técnico' : 'Admin'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Alternar Usuário:</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUserById(u.id);
                        setUserDropdownOpen(false);
                        if (u.role === 'technical_user') {
                          navigate('/helpdesk/inbox');
                        }
                      }}
                      className={`w-full px-3 py-2 flex items-center gap-2.5 text-left hover:bg-slate-800 transition ${
                        u.id === currentUser.id ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {u.email} • {u.role === 'technical_user' ? 'Técnico' : 'Admin'}
                        </div>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full py-1.5 text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Acessar com outra senha...
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 font-semibold transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Desconectar do Sistema</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden flex flex-col">
          <div className="w-72 bg-slate-900 border-r border-slate-800 h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">IPTech</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation options for mobile */}
              <div className="space-y-1">
                {!isTechnicalUser && (
                  <button
                    onClick={() => {
                      navigate('/gestao/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                      currentPath.startsWith('/gestao')
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Painel de Gestão</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate('/helpdesk/inbox');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                    currentPath.startsWith('/helpdesk')
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Atendimento (Inbox)</span>
                </button>

                {!isTechnicalUser && (
                  <button
                    onClick={() => {
                      navigate('/onboarding');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                      currentPath.startsWith('/onboarding')
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Onboarding</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom info in mobile drawer */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400">
                Logado como: <strong className="text-white">{currentUser.name}</strong>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/70 text-red-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Desconectar do Sistema</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Login Modal */}
      {loginModalOpen && (
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}

      {/* Global Toast Banner */}
      {activeToast && (
        <div className="fixed top-16 right-4 z-50 flex items-start gap-3 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in fade-in slide-in-from-top-4">
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
          <button onClick={clearToast} className="text-slate-400 hover:text-slate-200 text-xs">
            ✕
          </button>
        </div>
      )}
    </>
  );
};
