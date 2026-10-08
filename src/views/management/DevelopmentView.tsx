import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { DevelopmentTicket } from '../../types';
import {
  Code2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  FileCode,
  Image,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const DevelopmentView: React.FC = () => {
  const { devTickets, setDevTickets, clients, verticals, currentUser, addAuditLog } = useHelpdesk();
  const [selectedTicket, setSelectedTicket] = useState<DevelopmentTicket | null>(devTickets[0] || null);
  const [commentText, setCommentText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newVerticalId, setNewVerticalId] = useState(verticals[0]?.id || '');
  const [newPriority, setNewPriority] = useState<'Baixa' | 'Normal' | 'Alta' | 'Urgente'>('Alta');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !commentText.trim()) return;

    const newComment = {
      id: 'dc-' + Date.now(),
      authorName: currentUser.name,
      role: currentUser.cargo || currentUser.role,
      content: commentText.trim(),
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setDevTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, comments: [...t.comments, newComment] }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev ? { ...prev, comments: [...prev.comments, newComment] } : null
    );
    setCommentText('');
    addAuditLog('Comentário em Desenvolvimento', `Ticket ${selectedTicket.protocol}`, 'Evidência / parecer adicionado.');
  };

  const handleCreateDevTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const client = clients.find((c) => c.id === newClientId);
    const newTicket: DevelopmentTicket = {
      id: 'dev-' + Date.now(),
      title: newTitle.trim(),
      protocol: 'DEV-2026-00' + Math.floor(10 + Math.random() * 90),
      technicianId: currentUser.id,
      technicianName: currentUser.name,
      clientId: newClientId,
      clientName: client?.companyName || 'Entidade',
      verticalId: newVerticalId,
      description: newDesc.trim(),
      priority: newPriority,
      status: 'Em Análise',
      comments: [],
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setDevTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    addAuditLog('Abertura em Desenvolvimento', `Ticket ${newTicket.protocol}`, 'Encaminhamento para Engenharia de Software.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-red-400" />
            Canal Interno de Desenvolvimento (Engenharia de Software)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Canal confidencial entre técnicos e desenvolvedores para triagem de inconsistências de código e correções.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-red-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Solicitação Técnica</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[640px]">
        {/* Ticket List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
            Fila de Engenharia ({devTickets.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {devTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 cursor-pointer transition text-left ${
                    isSelected ? 'bg-red-950/30 border-l-2 border-red-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-red-400 font-bold">{t.protocol}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {t.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{t.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="truncate max-w-[140px]">{t.clientName}</span>
                    <span className="text-amber-400 font-medium">{t.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400">{selectedTicket.protocol}</span>
                    <span className="text-xs font-bold text-white">{selectedTicket.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Solicitante: <strong className="text-slate-300">{selectedTicket.technicianName}</strong> • Cliente: {selectedTicket.clientName}
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-300 font-semibold">
                  Status: {selectedTicket.status}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 text-xs">
                {/* Description */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <div className="font-semibold text-slate-300 text-xs">Descrição Técnica & Evidências:</div>
                  <p className="text-slate-300 leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Evidence links */}
                {selectedTicket.evidenceUrls?.length && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Anexos:</span>
                    {selectedTicket.evidenceUrls.map((url, i) => (
                      <span key={i} className="text-indigo-400 flex items-center gap-1">
                        <Image className="w-3.5 h-3.5" />
                        Log_Evidencia.png
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments */}
                <div className="space-y-2 pt-2">
                  <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                    Histórico de Resolução:
                  </div>
                  {selectedTicket.comments.map((c) => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-200">
                          {c.authorName} <span className="text-[10px] text-slate-400">({c.role})</span>
                        </span>
                        <span className="text-[10px]">{c.createdAt}</span>
                      </div>
                      <div className="text-slate-300 leading-relaxed">{c.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Comment */}
              <form onSubmit={handleSendComment} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Responder para a equipe de desenvolvimento..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Selecione uma solicitação técnica.
            </div>
          )}
        </div>
      </div>

      {/* Modal New Dev Ticket */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Encaminhar Ocorrência para Desenvolvimento</h2>
            <form onSubmit={handleCreateDevTicket} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Chamado Técnico *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Erro 500 no cálculo de rescisão"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Entidade Envolvida</label>
                <select
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Prioridade</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente (Bloqueador)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição Detalhada & Logs</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Passos para reproduzir, telas e mensagens de exceção..."
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
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg font-semibold text-white"
                >
                  Encaminhar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
