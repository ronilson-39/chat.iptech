import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { WorkspaceThread } from '../../types';
import {
  FolderGit2,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  User,
  Paperclip,
  Tag,
  Search,
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const { threads, setThreads, verticals, clients, currentUser, addAuditLog } = useHelpdesk();
  const [selectedThread, setSelectedThread] = useState<WorkspaceThread | null>(threads[0] || null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal new thread
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Thread' | 'Nota interna' | 'Tarefa' | 'Discussão'>('Thread');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newVerticalId, setNewVerticalId] = useState(verticals[0]?.id || '');
  const [initialMsg, setInitialMsg] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    const newReply = {
      id: 'tm-' + Date.now(),
      authorName: currentUser.name,
      content: replyText.trim(),
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? {
              ...t,
              updatedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              messages: [...t.messages, newReply],
            }
          : t
      )
    );

    setSelectedThread((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newReply] } : null
    );
    setReplyText('');
    addAuditLog('Mensagem no Workspace', `Thread ${selectedThread.title}`, 'Comentário interno adicionado.');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newThread: WorkspaceThread = {
      id: 'thread-' + Date.now(),
      title: newTitle.trim(),
      type: newType,
      clientId: newClientId,
      verticalId: newVerticalId,
      technicianId: currentUser.id,
      technicianName: currentUser.name,
      status: 'Aberta',
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Agora',
      messages: initialMsg.trim()
        ? [
            {
              id: 'tm-' + Date.now(),
              authorName: currentUser.name,
              content: initialMsg.trim(),
              createdAt: 'Hoje',
            },
          ]
        : [],
    };

    setThreads((prev) => [newThread, ...prev]);
    setSelectedThread(newThread);
    setCreateModalOpen(false);
    setNewTitle('');
    setInitialMsg('');
    addAuditLog('Criação de Thread', `Workspace ${newThread.title}`, 'Nova discussão iniciada.');
  };

  const filteredThreads = threads.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || t.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            Workspace & Discussões em Threads
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organização interna de assuntos complexos, tarefas e alinhamentos entre analistas e coordenação.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Thread / Tarefa</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[640px]">
        {/* Left Thread List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar threads e notas..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredThreads.map((t) => {
              const isSelected = selectedThread?.id === t.id;
              const vert = verticals.find((v) => v.id === t.verticalId);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThread(t)}
                  className={`p-3.5 cursor-pointer transition text-left ${
                    isSelected ? 'bg-indigo-950/40 border-l-2 border-indigo-400' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {t.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{t.updatedAt}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{t.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="text-indigo-300">{vert?.name || 'Geral'}</span>
                    <span>{t.messages.length} msg(s)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Thread Details */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-semibold">
                      {selectedThread.type}
                    </span>
                    <h2 className="text-sm font-bold text-white">{selectedThread.title}</h2>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Criada por <strong className="text-slate-300">{selectedThread.technicianName}</strong> • {selectedThread.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-semibold">
                    {selectedThread.status}
                  </span>
                </div>
              </div>

              {/* Messages Thread Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
                {selectedThread.messages.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">{m.authorName}</span>
                      <span className="text-[10px]">{m.createdAt}</span>
                    </div>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escrever resposta interna para a equipe..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Selecione uma thread para visualizar.
            </div>
          )}
        </div>
      </div>

      {/* Modal New Thread */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Iniciar Nova Thread / Tarefa</h2>
            <form onSubmit={handleCreateThread} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título da Discussão *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Alinhamento de Fechamento Contábil"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Objeto</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Thread">Thread</option>
                  <option value="Nota interna">Nota interna</option>
                  <option value="Tarefa">Tarefa</option>
                  <option value="Discussão">Discussão</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vertical</label>
                <select
                  value={newVerticalId}
                  onChange={(e) => setNewVerticalId(e.target.value)}
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
                <label className="block text-slate-300 font-medium mb-1">Mensagem Inicial</label>
                <textarea
                  rows={3}
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  placeholder="Descreva a pauta ou instrução..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white"
                >
                  Criar Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
