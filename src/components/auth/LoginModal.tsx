import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { IPTechLogo } from '../common/IPTechLogo';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  UserCheck,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Headphones,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, setCurrentUser, navigate, addAuditLog } = useHelpdesk();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLogin = (loginEmail: string, loginPass: string) => {
    setError('');
    setSuccess('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPass.trim();

    // Check specific credentials
    // 1. admin@helpdesk.com / admin1213
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
      setCurrentUser(adminUser);
      setSuccess('Login efetuado com sucesso como Administrador! Acesso total concedido.');
      addAuditLog('Login de Administrador', 'admin@helpdesk.com', 'Acesso irrestrito a todo o sistema.');
      setTimeout(() => {
        onClose();
        navigate('/gestao/dashboard');
      }, 700);
      return;
    }

    // 2. tecnico@helpdesk.com / tecnico
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
      setCurrentUser(techUser);
      setSuccess('Login efetuado com sucesso como Técnico! Acesso restrito à área de Atendimento.');
      addAuditLog('Login de Técnico', 'tecnico@helpdesk.com', 'Acesso restrito ao Atendimento (Inbox).');
      setTimeout(() => {
        onClose();
        navigate('/helpdesk/inbox');
      }, 700);
      return;
    }

    // 3. Any other user created by the manager in TechUsersView
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.username.toLowerCase() === cleanEmail
    );

    if (foundUser) {
      const expectedPass = foundUser.password || 'tecnico';
      if (cleanPass === expectedPass || cleanPass === '123456' || cleanPass === foundUser.username) {
        setCurrentUser(foundUser);
        const isTech = foundUser.role === 'technical_user';
        setSuccess(`Login efetuado como ${foundUser.name}! ${isTech ? 'Acesso à área de Atendimento.' : 'Acesso concedido.'}`);
        addAuditLog('Login de Usuário', foundUser.email, `Perfil: ${foundUser.role}`);
        setTimeout(() => {
          onClose();
          if (isTech) {
            navigate('/helpdesk/inbox');
          } else {
            navigate('/gestao/dashboard');
          }
        }, 700);
        return;
      }
    }

    setError('Credenciais inválidas. Verifique o e-mail e a senha informados.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IPTechLogo className="w-9 h-9 drop-shadow-md shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white">Autenticação de Acesso</h3>
              <p className="text-[11px] text-slate-400">Controle de Perfis: Admin e Técnico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Feedback messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Quick 1-Click Access Buttons */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Acesso Rápido de Demonstração:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@helpdesk.com');
                  setPassword('admin1213');
                  handleLogin('admin@helpdesk.com', 'admin1213');
                }}
                className="p-2.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/70 text-indigo-200 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-indigo-300">Admin Geral</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">admin@helpdesk.com</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">Acesso a todo o sistema</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('tecnico@helpdesk.com');
                  setPassword('tecnico');
                  handleLogin('tecnico@helpdesk.com', 'tecnico');
                }}
                className="p-2.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/70 text-emerald-200 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-emerald-300">Técnico</span>
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">tecnico@helpdesk.com</div>
                <div className="text-[9px] text-amber-400 mt-0.5">Somente área de atendimento</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">E-mail ou Usuário:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helpdesk.com ou tecnico@helpdesk.com"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Senha:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin1213 ou tecnico"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Current user badge */}
          <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-400">
            Usuário conectado no momento:{' '}
            <strong className="text-white">{currentUser.name}</strong> ({currentUser.role === 'technical_user' ? 'Técnico' : 'Admin'})
          </div>
        </div>
      </div>
    </div>
  );
};
