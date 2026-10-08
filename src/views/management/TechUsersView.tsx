import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { User, UserRole, UserStatus } from '../../types';
import {
  UserCheck,
  Plus,
  Search,
  Shield,
  KeyRound,
  Edit2,
  Trash2,
  X,
  Check,
  Lock,
} from 'lucide-react';

export const TechUsersView: React.FC = () => {
  const { users, setUsers, verticals, teams, addAuditLog } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    cargo: '',
    role: 'technical_user' as UserRole,
    status: 'online' as UserStatus,
    teams: [] as string[],
    verticals: [] as string[],
    permissions: [
      'view_clients',
      'view_messages',
      'attend',
      'close_ticket',
      'transfer_ticket',
      'create_messages',
      'create_commands',
      'use_ai',
    ] as string[],
  });

  const allAvailablePermissions = [
    { code: 'view_clients', label: 'Visualizar Clientes' },
    { code: 'view_messages', label: 'Visualizar Mensagens' },
    { code: 'attend', label: 'Assumir Atendimento' },
    { code: 'close_ticket', label: 'Encerrar Chamados' },
    { code: 'reopen_ticket', label: 'Reabrir Chamados' },
    { code: 'transfer_ticket', label: 'Transferir Chamados' },
    { code: 'create_messages', label: 'Criar Mensagens Rápidas' },
    { code: 'create_commands', label: 'Criar Comandos (/)' },
    { code: 'use_ai', label: 'Usar Agente IA' },
    { code: 'access_development', label: 'Canal de Desenvolvimento' },
    { code: 'create_threads', label: 'Criar Threads no Workspace' },
    { code: 'view_reports', label: 'Visualizar Relatórios' },
    { code: 'manage_whatsapp', label: 'Gerenciar WhatsApp' },
  ];

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      cargo: 'Técnico de Suporte',
      role: 'technical_user',
      status: 'online',
      teams: ['team-folha'],
      verticals: ['vert-folha', 'vert-esocial'],
      permissions: [
        'view_clients',
        'view_messages',
        'attend',
        'close_ticket',
        'transfer_ticket',
        'create_messages',
        'create_commands',
        'use_ai',
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password || '',
      phone: user.phone || '',
      cargo: user.cargo || '',
      role: user.role,
      status: user.status,
      teams: user.teams,
      verticals: user.verticals,
      permissions: user.permissions,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      addAuditLog('Edição de Usuário', `Usuário ${formData.name}`, 'Permissões e dados alterados.');
    } else {
      const newUser: User = {
        id: 'user-' + Date.now(),
        ...formData,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        active: true,
        lastLogin: 'Nunca',
      };
      setUsers((prev) => [newUser, ...prev]);
      addAuditLog('Criação de Usuário', `Usuário ${newUser.name}`, `Novo ${newUser.role} criado.`);
    }

    setModalOpen(false);
  };

  const handleResetPassword = (name: string) => {
    alert(`Link temporário para redefinição de senha gerado para ${name}.`);
    addAuditLog('Reset de Senha', `Usuário ${name}`, 'Solicitação de nova senha emitida.');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja desativar o usuário ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addAuditLog('Desativação de Usuário', `Usuário ${name}`, 'Acesso revogado.');
    }
  };

  const togglePermission = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(code)
        ? prev.permissions.filter((p) => p !== code)
        : [...prev.permissions, code],
    }));
  };

  const toggleVertical = (vId: string) => {
    setFormData((prev) => ({
      ...prev,
      verticals: prev.verticals.includes(vId)
        ? prev.verticals.filter((id) => id !== vId)
        : [...prev.verticals, vId],
    }));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Usuários Técnicos e Administradores
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de operadores, técnicos de verticais e papéis RBAC.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Técnico</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar técnico por nome, e-mail ou login..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Técnico / Usuário</th>
                <th className="py-3 px-4">Papel (Role)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verticais Autorizadas</th>
                <th className="py-3 px-4">Último Acesso</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {u.username} • {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        u.role === 'super_admin'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                          : u.role === 'admin'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {u.cargo || u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.status === 'online'
                            ? 'bg-emerald-500'
                            : u.status === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize text-[11px]">{u.status}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {u.verticals.map((vId) => {
                        const vert = verticals.find((v) => v.id === vId);
                        if (!vert) return null;
                        return (
                          <span
                            key={vId}
                            className="text-[9px] px-1.5 py-0.5 rounded font-medium border"
                            style={{
                              backgroundColor: `${vert.color}20`,
                              borderColor: `${vert.color}50`,
                              color: vert.color,
                            }}
                          >
                            {vert.name}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{u.lastLogin || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleResetPassword(u.name)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Resetar senha"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Editar técnico"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingUser ? 'Editar Usuário Técnico' : 'Cadastrar Novo Técnico'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">E-mail Institucional *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Login (Username) *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Senha de Acesso *</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Ex: tecnico123"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Perfil de Acesso (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="technical_user">Técnico de Atendimento</option>
                    <option value="admin">Administrador Operacional</option>
                    <option value="super_admin">Super Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Verticais Autorizadas */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Verticais Autorizadas para Atendimento:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {verticals.map((v) => {
                    const selected = formData.verticals.includes(v.id);
                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => toggleVertical(v.id)}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                          selected
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{v.name}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissões RBAC */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Permissões de Atendimento (RBAC):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  {allAvailablePermissions.map((p) => {
                    const has = formData.permissions.includes(p.code);
                    return (
                      <label key={p.code} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={has}
                          onChange={() => togglePermission(p.code)}
                          className="rounded bg-slate-800 text-emerald-500"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white shadow-lg shadow-emerald-950/50"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
