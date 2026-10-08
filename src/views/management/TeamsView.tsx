import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Team } from '../../types';
import {
  Network,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Shield,
  Users,
  X,
  Check,
  Eye,
  Search,
  Mail,
  Phone,
  Layers,
} from 'lucide-react';

export const TeamsView: React.FC = () => {
  const { teams, setTeams, verticals, users, addAuditLog } = useHelpdesk();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [viewSearch, setViewSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    verticalId: 'vert-folha',
    coordinatorId: 'user-carlos',
    businessHours: '08:00 - 18:00',
    sla: 'Normal (4h)',
    memberIds: [] as string[],
  });

  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      description: '',
      verticalId: verticals[0]?.id || '',
      coordinatorId: users[0]?.id || '',
      businessHours: '08:00 - 18:00',
      sla: 'Normal (4h)',
      memberIds: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (t: Team) => {
    setEditingTeam(t);
    setFormData({
      name: t.name,
      description: t.description,
      verticalId: t.verticalId,
      coordinatorId: t.coordinatorId,
      businessHours: t.businessHours,
      sla: t.sla,
      memberIds: t.memberIds,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? { ...t, ...formData } : t))
      );
      addAuditLog('Edição de Equipe', `Equipe ${formData.name}`, 'Equipe atualizada.');
    } else {
      const newTeam: Team = {
        id: 'team-' + Date.now(),
        ...formData,
        active: true,
      };
      setTeams((prev) => [...prev, newTeam]);
      addAuditLog('Criação de Equipe', `Equipe ${newTeam.name}`, 'Nova equipe operacional criada.');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja remover a equipe "${name}"?`)) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
      addAuditLog('Exclusão de Equipe', `Equipe ${name}`, 'Equipe excluída.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            Gestão de Equipes Operacionais
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordenação e distribuição de técnicos por vertical e horário de atendimento.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Equipe</span>
        </button>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((t) => {
          const vert = verticals.find((v) => v.id === t.verticalId);
          const coordinator = users.find((u) => u.id === t.coordinatorId);

          // Usuários técnicos desta equipe ou adicionados a esta vertical de acordo com o cadastro (Request 2)
          const teamTechUsers = users.filter((u) => {
            const isTech = u.role === 'technical_user' || u.role === 'admin' || u.role === 'super_admin';
            const isInTeam = t.memberIds.includes(u.id) || u.teams?.includes(t.id);
            const hasVertical = u.verticals?.includes(t.verticalId);
            return isTech && (isInTeam || hasVertical);
          });

          return (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                    style={{
                      backgroundColor: `${vert?.color || '#6366F1'}20`,
                      borderColor: `${vert?.color || '#6366F1'}50`,
                      color: vert?.color || '#A5B4FC',
                    }}
                  >
                    Vertical: {vert?.name || 'Geral'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Opção Ver no cabeçalho do bloco (Request 2) */}
                    <button
                      type="button"
                      onClick={() => {
                        setViewingTeam(t);
                        setViewSearch('');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm group"
                      title="Ver equipe e usuários técnicos vinculados às verticais"
                    >
                      <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                      <span>Ver</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(t)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition cursor-pointer"
                      title="Editar equipe"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id, t.name)}
                      className="p-1 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"
                      title="Excluir equipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{t.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Coordenador:</span>
                    <span className="text-slate-200 font-medium">{coordinator?.name || 'Não definido'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Horário:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{t.businessHours}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>SLA Alvo:</span>
                    <span className="text-emerald-400 font-medium">{t.sla}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Integrantes da Equipe:</span>
                    <span className="text-slate-300 font-semibold">{t.memberIds.length} técnicos</span>
                  </div>
                </div>

                {/* Usuários Técnicos Adicionados às Verticais de Acordo com o Cadastro (Request 2) */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      Técnicos da Vertical ({teamTechUsers.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setViewingTeam(t);
                        setViewSearch('');
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      Ver detalhes
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    {teamTechUsers.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-1">Nenhum técnico cadastrado para esta vertical.</p>
                    ) : (
                      teamTechUsers.slice(0, 3).map((tech) => {
                        const isCoord = tech.id === t.coordinatorId;
                        return (
                          <div
                            key={tech.id}
                            className="p-2 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-slate-700/80 transition flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                  alt={tech.name}
                                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                                />
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-slate-900 ${
                                    tech.status === 'online'
                                      ? 'bg-emerald-500'
                                      : tech.status === 'busy'
                                      ? 'bg-amber-500'
                                      : 'bg-slate-500'
                                  }`}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                                  {tech.name}
                                  {isCoord && (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                                      Coord
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {tech.cargo || 'Técnico de Suporte'}
                                </div>
                              </div>
                            </div>

                            {/* Verticais cadastradas no perfil do técnico */}
                            <div className="flex items-center gap-1 shrink-0">
                              {tech.verticals.slice(0, 2).map((vId) => {
                                const techVert = verticals.find((v) => v.id === vId);
                                const isTeamVert = vId === t.verticalId;
                                return (
                                  <span
                                    key={vId}
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium truncate max-w-[75px] border ${
                                      isTeamVert
                                        ? 'bg-indigo-500/25 border-indigo-500/60 text-indigo-300 font-bold'
                                        : 'bg-slate-700/50 border-slate-600/40 text-slate-300'
                                    }`}
                                    title={`Vertical cadastrada: ${techVert?.name || vId}`}
                                  >
                                    {techVert?.name || vId}
                                  </span>
                                );
                              })}
                              {tech.verticals.length > 2 && (
                                <span className="text-[9px] text-slate-500 font-mono">
                                  +{tech.verticals.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {teamTechUsers.length > 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingTeam(t);
                          setViewSearch('');
                        }}
                        className="w-full text-center py-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        + Ver todos os {teamTechUsers.length} técnicos desta vertical
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Botão Ver em Destaque no Rodapé do Bloco (Request 2) */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {t.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setViewingTeam(t);
                    setViewSearch('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold transition cursor-pointer group shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                  <span>Ver Equipe & Técnicos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Team */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                {editingTeam ? 'Editar Equipe' : 'Criar Nova Equipe'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome da Equipe *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vertical Vinculada</label>
                <select
                  value={formData.verticalId}
                  onChange={(e) => setFormData({ ...formData, verticalId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Coordenador Responsável</label>
                <select
                  value={formData.coordinatorId}
                  onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.cargo || u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Horário de Expediente</label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">SLA Padrão</label>
                <input
                  type="text"
                  value={formData.sla}
                  onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Equipe & Usuários Técnicos Vinculados às Verticais (Request 2) */}
      {viewingTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0"
                  style={{
                    backgroundColor: `${verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#6366F1'}20`,
                    borderColor: `${verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#6366F1'}50`,
                    color: verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#A5B4FC',
                  }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-white">{viewingTeam.name}</h2>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold border"
                      style={{
                        backgroundColor: `${verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#6366F1'}20`,
                        borderColor: `${verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#6366F1'}50`,
                        color: verticals.find((v) => v.id === viewingTeam.verticalId)?.color || '#A5B4FC',
                      }}
                    >
                      Vertical: {verticals.find((v) => v.id === viewingTeam.verticalId)?.name || 'Geral'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{viewingTeam.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    openEditModal(viewingTeam);
                    setViewingTeam(null);
                  }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
                  title="Editar equipe"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewingTeam(null)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadados da Equipe */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs shrink-0">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coordenador</div>
                <div className="text-white font-semibold truncate mt-0.5">
                  {users.find((u) => u.id === viewingTeam.coordinatorId)?.name || 'Não definido'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Expediente</div>
                <div className="text-slate-200 font-mono font-medium mt-0.5">{viewingTeam.businessHours}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">SLA Alvo</div>
                <div className="text-emerald-400 font-semibold mt-0.5">{viewingTeam.sla}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Técnicos na Vertical</div>
                <div className="text-indigo-300 font-bold mt-0.5">
                  {
                    users.filter((u) => {
                      const isTech = u.role === 'technical_user' || u.role === 'admin' || u.role === 'super_admin';
                      const isInTeam = viewingTeam.memberIds.includes(u.id) || u.teams?.includes(viewingTeam.id);
                      const hasVertical = u.verticals?.includes(viewingTeam.verticalId);
                      return isTech && (isInTeam || hasVertical);
                    }).length
                  }{' '}
                  técnicos
                </div>
              </div>
            </div>

            {/* Barra de Busca de Técnicos */}
            <div className="p-3.5 border-b border-slate-800 flex items-center gap-2 shrink-0 bg-slate-900/60">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar técnico por nome, cargo ou vertical..."
                  value={viewSearch}
                  onChange={(e) => setViewSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Lista Detalhada de Usuários Técnicos Vinculados */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {(() => {
                const teamTechUsers = users
                  .filter((u) => {
                    const isTech = u.role === 'technical_user' || u.role === 'admin' || u.role === 'super_admin';
                    const isInTeam = viewingTeam.memberIds.includes(u.id) || u.teams?.includes(viewingTeam.id);
                    const hasVertical = u.verticals?.includes(viewingTeam.verticalId);
                    return isTech && (isInTeam || hasVertical);
                  })
                  .filter((u) => {
                    if (!viewSearch.trim()) return true;
                    const q = viewSearch.toLowerCase();
                    return (
                      u.name.toLowerCase().includes(q) ||
                      u.email.toLowerCase().includes(q) ||
                      (u.cargo && u.cargo.toLowerCase().includes(q)) ||
                      u.verticals.some((vId) => {
                        const vert = verticals.find((v) => v.id === vId);
                        return vert && vert.name.toLowerCase().includes(q);
                      })
                    );
                  });

                if (teamTechUsers.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      Nenhum técnico encontrado para esta equipe ou vertical.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-between px-1">
                      <span>Técnicos vinculados ({teamTechUsers.length})</span>
                      <span className="text-[11px] text-slate-400">
                        Verticais exibidas conforme o cadastro do usuário
                      </span>
                    </div>

                    {teamTechUsers.map((tech) => {
                      const isCoord = tech.id === viewingTeam.coordinatorId;
                      const isMember = viewingTeam.memberIds.includes(tech.id) || tech.teams?.includes(viewingTeam.id);

                      return (
                        <div
                          key={tech.id}
                          className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0 mt-0.5">
                              <img
                                src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={tech.name}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-600"
                              />
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                                  tech.status === 'online'
                                    ? 'bg-emerald-500'
                                    : tech.status === 'busy'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-500'
                                }`}
                                title={`Status: ${tech.status}`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-white">{tech.name}</span>
                                {isCoord && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                    Coordenador da Equipe
                                  </span>
                                )}
                                {isMember && !isCoord && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                                    Integrante da Equipe
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-300 mt-0.5">{tech.cargo || 'Técnico de Atendimento'}</div>
                              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  {tech.email}
                                </span>
                                {tech.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    {tech.phone}
                                  </span>
                                )}
                                <span className="text-slate-500 font-mono">
                                  Horário: {tech.businessHours || '08:00 - 18:00'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Verticais Adicionadas de Acordo com o Cadastro do Técnico */}
                          <div className="md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center md:justify-end gap-1">
                              <Layers className="w-3 h-3 text-indigo-400" />
                              Verticais no Cadastro ({tech.verticals.length}):
                            </div>
                            <div className="flex items-center md:justify-end gap-1.5 flex-wrap max-w-sm">
                              {tech.verticals.map((vId) => {
                                const vDef = verticals.find((v) => v.id === vId);
                                const isTeamMatch = vId === viewingTeam.verticalId;
                                return (
                                  <span
                                    key={vId}
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1.5 transition ${
                                      isTeamMatch
                                        ? 'bg-indigo-600/25 border-indigo-500/60 text-indigo-200 font-bold shadow-sm'
                                        : 'bg-slate-700/60 border-slate-600/40 text-slate-300'
                                    }`}
                                    title={`Vertical ${vDef?.name || vId}${isTeamMatch ? ' (Vertical desta equipe)' : ''}`}
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: vDef?.color || '#94a3b8' }}
                                    />
                                    <span>{vDef?.name || vId}</span>
                                    {isTeamMatch && (
                                      <span className="text-[9px] text-indigo-300 bg-indigo-500/30 px-1 rounded">
                                        desta equipe
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-400 text-[11px]">
                Exibindo técnicos com atribuição na equipe ou na vertical {verticals.find((v) => v.id === viewingTeam.verticalId)?.name}.
              </span>
              <button
                type="button"
                onClick={() => setViewingTeam(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
