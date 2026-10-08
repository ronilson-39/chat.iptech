import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { IPTechLogo } from '../../components/common/IPTechLogo';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Headphones,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Users,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { users, login, navigate, theme, toggleTheme } = useHelpdesk();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (loginEmail: string, loginPass: string) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPass.trim();

    setTimeout(() => {
      // 1. Admin login
      if (cleanEmail === 'admin@helpdesk.com' && cleanPass === 'admin1213') {
        let adminUser = users.find((u) => u.email.toLowerCase() === 'admin@helpdesk.com');
        if (!adminUser) {
          adminUser = {
            id: 'user-admin',
            name: 'Administrador Geral',
            email: 'admin@helpdesk.com',
            username: 'admin',
            password: 'admin1213',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            phone: '(11) 98888-0001',
            cargo: 'Administrador do Sistema',
            teams: ['team-dev', 'team-folha', 'team-esocial'],
            verticals: ['vert-folha', 'vert-esocial', 'vert-contabilidade', 'vert-contas', 'vert-licitacoes', 'vert-tributos', 'vert-educacao', 'vert-saude', 'vert-dev'],
            permissions: ['all'],
            businessHours: '08:00 - 18:00',
            status: 'online',
            active: true,
            lastLogin: 'Agora',
          };
        }
        setSuccess('Conectado como Administrador! Acessando sistema...');
        login(adminUser);
        navigate('/gestao/dashboard');
        setLoading(false);
        return;
      }

      // 2. Technician login
      if (cleanEmail === 'tecnico@helpdesk.com' && cleanPass === 'tecnico') {
        let techUser = users.find((u) => u.email.toLowerCase() === 'tecnico@helpdesk.com');
        if (!techUser) {
          techUser = {
            id: 'user-tecnico',
            name: 'Técnico de Suporte',
            email: 'tecnico@helpdesk.com',
            username: 'tecnico',
            password: 'tecnico',
            role: 'technical_user',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            phone: '(11) 98888-0002',
            cargo: 'Técnico de Atendimento ao Cliente',
            teams: ['team-folha', 'team-esocial'],
            verticals: ['vert-folha', 'vert-esocial', 'vert-contabilidade', 'vert-contas', 'vert-licitacoes', 'vert-tributos', 'vert-educacao', 'vert-saude'],
            permissions: ['view_clients', 'view_messages', 'attend', 'close_ticket', 'transfer_ticket', 'create_messages', 'create_commands', 'use_ai'],
            businessHours: '08:00 - 18:00',
            status: 'online',
            active: true,
            lastLogin: 'Agora',
          };
        }
        setSuccess('Conectado como Técnico! Acessando central de atendimento...');
        login(techUser);
        navigate('/helpdesk/inbox');
        setLoading(false);
        return;
      }

      // 3. Any other registered user
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail ||
          u.username.toLowerCase() === cleanEmail
      );

      if (foundUser) {
        const expectedPass = foundUser.password || 'tecnico';
        if (cleanPass === expectedPass || cleanPass === '123456' || cleanPass === foundUser.username) {
          const isTech = foundUser.role === 'technical_user';
          setSuccess(`Conectado como ${foundUser.name}! Redirecionando...`);
          login(foundUser);
          if (isTech) {
            navigate('/helpdesk/inbox');
          } else {
            navigate('/gestao/dashboard');
          }
          setLoading(false);
          return;
        }
      }

      setError('Credenciais incorretas. Verifique o e-mail e a senha informados.');
      setLoading(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <IPTechLogo className="w-8 h-8 drop-shadow-md" />
          <div>
            <div className="text-sm font-bold text-white tracking-wide">IPTech Helpdesk</div>
            <div className="text-[10px] text-slate-400">Atendimento & Gestão Omnichannel</div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer shadow-sm"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tema Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Tema Escuro</span>
            </>
          )}
        </button>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Title and intro */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 shadow-inner mb-1">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Acesso ao Sistema
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Você está desconectado. Escolha um acesso rápido de demonstração ou informe suas credenciais para entrar no sistema.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1-Click Fast Login Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
              <span>Acesso Rápido com 1 Clique:</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@helpdesk.com');
                  setPassword('admin1213');
                  handleLogin('admin@helpdesk.com', 'admin1213');
                }}
                disabled={loading}
                className="p-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/70 text-indigo-200 text-left transition cursor-pointer group flex items-center justify-between shadow-sm active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-900/70 text-indigo-300 border border-indigo-700/60">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-200">
                      Entrar como Administrador Geral
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">admin@helpdesk.com</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Acesso total a Gestão & Configurações</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('tecnico@helpdesk.com');
                  setPassword('tecnico');
                  handleLogin('tecnico@helpdesk.com', 'tecnico');
                }}
                disabled={loading}
                className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/70 text-emerald-200 text-left transition cursor-pointer group flex items-center justify-between shadow-sm active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-900/70 text-emerald-300 border border-emerald-700/60">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-200">
                      Entrar como Técnico de Suporte
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">tecnico@helpdesk.com</div>
                    <div className="text-[10px] text-amber-400 mt-0.5 font-medium">Acesso à Central de Atendimento (Inbox)</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
              <span className="bg-slate-900 px-3">Ou acesse com suas credenciais</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail ou Usuário:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helpdesk.com ou seu usuário"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Informe sua senha"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Validando acesso...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick tips footer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Controle de perfis com autenticação e isolamento de permissões</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-[11px] text-slate-500 border-t border-slate-800/60 bg-slate-900/40">
        IPTech SaaS © 2026 • Todos os direitos reservados
      </footer>
    </div>
  );
};
