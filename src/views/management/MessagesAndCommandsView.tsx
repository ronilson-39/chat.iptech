import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { QuickMessage, SlashCommand } from '../../types';
import {
  MessageSquare,
  Terminal,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const MessagesAndCommandsView: React.FC = () => {
  const {
    quickMessages,
    setQuickMessages,
    slashCommands,
    setSlashCommands,
    addAuditLog,
    currentUser,
  } = useHelpdesk();

  const [activeTab, setActiveTab] = useState<'messages' | 'commands'>('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State Quick Message
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [editingMsg, setEditingMsg] = useState<QuickMessage | null>(null);
  const [msgFormData, setMsgFormData] = useState({
    name: '',
    category: 'Saudação',
    content: '',
  });

  // Modal State Command
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const [editingCmd, setEditingCmd] = useState<SlashCommand | null>(null);
  const [cmdFormData, setCmdFormData] = useState({
    trigger: '/',
    description: '',
    content: '',
    category: 'Atendimento',
  });

  const categories = [
    'Saudação',
    'Atendimento inicial',
    'Solicitação de informações',
    'Aguardando cliente',
    'Transferência',
    'Finalização',
    'Pesquisa',
    'Fora do horário',
    'Desenvolvimento',
  ];

  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgFormData.name.trim() || !msgFormData.content.trim()) return;

    if (editingMsg) {
      setQuickMessages((prev) =>
        prev.map((m) => (m.id === editingMsg.id ? { ...m, ...msgFormData } : m))
      );
      addAuditLog('Edição de Mensagem Pronta', `Template ${msgFormData.name}`, 'Conteúdo atualizado.');
    } else {
      const newMsg: QuickMessage = {
        id: 'qm-' + Date.now(),
        ...msgFormData,
        active: true,
      };
      setQuickMessages((prev) => [...prev, newMsg]);
      addAuditLog('Criação de Mensagem Pronta', `Template ${newMsg.name}`, 'Novo template cadastrado.');
    }
    setMsgModalOpen(false);
  };

  const handleSaveCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdFormData.trigger.trim() || !cmdFormData.content.trim()) return;

    let trigger = cmdFormData.trigger.trim();
    if (!trigger.startsWith('/')) trigger = '/' + trigger;

    if (editingCmd) {
      setSlashCommands((prev) =>
        prev.map((c) => (c.id === editingCmd.id ? { ...c, ...cmdFormData, trigger } : c))
      );
      addAuditLog('Edição de Comando', `Comando ${trigger}`, 'Regra atualizada.');
    } else {
      const newCmd: SlashCommand = {
        id: 'cmd-' + Date.now(),
        ...cmdFormData,
        trigger,
      };
      setSlashCommands((prev) => [...prev, newCmd]);
      addAuditLog('Criação de Comando', `Comando ${trigger}`, 'Novo comando adicionado.');
    }
    setCmdModalOpen(false);
  };

  const handleDeleteMsg = (id: string, name: string) => {
    if (confirm(`Excluir template "${name}"?`)) {
      setQuickMessages((prev) => prev.filter((m) => m.id !== id));
      addAuditLog('Exclusão de Template', `Template ${name}`, 'Removido.');
    }
  };

  const handleDeleteCmd = (id: string, trigger: string) => {
    if (confirm(`Excluir comando "${trigger}"?`)) {
      setSlashCommands((prev) => prev.filter((c) => c.id !== id));
      addAuditLog('Exclusão de Comando', `Comando ${trigger}`, 'Removido.');
    }
  };

  const previewReplacedText = (text: string) => {
    return text
      .replace(/{{cliente}}/g, 'Prefeitura de São Pedro')
      .replace(/{{tecnico}}/g, currentUser.name)
      .replace(/{{empresa}}/g, 'Helpdesk Omnichannel Gov')
      .replace(/{{vertical}}/g, 'Folha de Pagamento')
      .replace(/{{protocolo}}/g, 'HD-2026-000101')
      .replace(/{{data}}/g, new Date().toLocaleDateString('pt-BR'))
      .replace(/{{hora}}/g, new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Mensagens Prontas & Comandos Slash (/)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Padronize a comunicação e acelere o atendimento aos clientes com substituição dinâmica de variáveis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'messages' ? (
            <button
              onClick={() => {
                setEditingMsg(null);
                setMsgFormData({ name: '', category: 'Saudação', content: '' });
                setMsgModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Mensagem</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCmd(null);
                setCmdFormData({ trigger: '/', description: '', content: '', category: 'Atendimento' });
                setCmdModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Comando (/)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Templates de Mensagens ({quickMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'commands'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          Comandos de Teclado (/) ({slashCommands.length})
        </button>
      </div>

      {/* Variable Chips Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold">Variáveis disponíveis:</span>
        {[
          '{{cliente}}',
          '{{tecnico}}',
          '{{empresa}}',
          '{{vertical}}',
          '{{protocolo}}',
          '{{data}}',
          '{{hora}}',
        ].map((v) => (
          <span
            key={v}
            className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-emerald-300"
          >
            {v}
          </span>
        ))}
      </div>

      {/* Tab: Quick Messages */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMessages.map((qm) => (
            <div
              key={qm.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-semibold">
                    {qm.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingMsg(qm);
                        setMsgFormData({
                          name: qm.name,
                          category: qm.category,
                          content: qm.content,
                        });
                        setMsgModalOpen(true);
                      }}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMsg(qm.id, qm.name)}
                      className="p-1 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{qm.name}</h3>
                <p className="text-xs text-slate-300 mt-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                  {qm.content}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-1">
                  Pré-visualização Dinâmica:
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  "{previewReplacedText(qm.content)}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Slash Commands */}
      {activeTab === 'commands' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Gatilho (Trigger)</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Texto Expandido</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {slashCommands.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {cmd.trigger}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-100">{cmd.description}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 max-w-xs truncate">
                      {cmd.content}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">{cmd.category}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCmd(cmd);
                            setCmdFormData({
                              trigger: cmd.trigger,
                              description: cmd.description,
                              content: cmd.content,
                              category: cmd.category,
                            });
                            setCmdModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="Editar comando"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCmd(cmd.id, cmd.trigger)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Quick Message */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                {editingMsg ? 'Editar Template' : 'Cadastrar Mensagem Pronta'}
              </h2>
              <button onClick={() => setMsgModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveMessage} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Template *</label>
                <input
                  type="text"
                  required
                  value={msgFormData.name}
                  onChange={(e) => setMsgFormData({ ...msgFormData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Categoria</label>
                <select
                  value={msgFormData.category}
                  onChange={(e) => setMsgFormData({ ...msgFormData, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Conteúdo da Mensagem *</label>
                <textarea
                  rows={4}
                  required
                  value={msgFormData.content}
                  onChange={(e) => setMsgFormData({ ...msgFormData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMsgModalOpen(false)}
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

      {/* Modal Command */}
      {cmdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                {editingCmd ? 'Editar Comando' : 'Novo Comando Slash (/)'}
              </h2>
              <button onClick={() => setCmdModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCommand} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Gatilho (ex: /protocolo, /ola) *</label>
                <input
                  type="text"
                  required
                  value={cmdFormData.trigger}
                  onChange={(e) => setCmdFormData({ ...cmdFormData, trigger: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <input
                  type="text"
                  value={cmdFormData.description}
                  onChange={(e) => setCmdFormData({ ...cmdFormData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Conteúdo Injetado *</label>
                <textarea
                  rows={3}
                  required
                  value={cmdFormData.content}
                  onChange={(e) => setCmdFormData({ ...cmdFormData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCmdModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white"
                >
                  Salvar Comando
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
