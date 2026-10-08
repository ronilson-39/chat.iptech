import React, { useState } from 'react';
import {
  X,
  Code2,
  Terminal,
  Send,
  AlertCircle,
  CheckCircle2,
  Bug,
  Cpu,
  Clock,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface DevChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevChatModal: React.FC<DevChatModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, devTickets, setDevTickets, addAuditLog } = useHelpdesk();

  const [activeTab, setActiveTab] = useState<'chat' | 'new_ticket'>('chat');
  const [messages, setMessages] = useState([
    {
      id: 'dev-msg-1',
      sender: 'Carlos Alberto (Dev Lead)',
      isDev: true,
      text: 'Olá time de atendimento! Acabamos de subir um hotfix no microserviço do eSocial (versão v2.4.1). Qualquer rejeição 401 nos avisem por aqui.',
      time: '08:30',
    },
    {
      id: 'dev-msg-2',
      sender: 'João Pedro Folha (Técnico)',
      isDev: false,
      text: 'Perfeito Carlos! Estamos acompanhando o cliente Câmara de Araras Verdes. O XML foi validado com sucesso.',
      time: '09:12',
    },
    {
      id: 'dev-msg-3',
      sender: 'Mariana Gerente (Admin)',
      isDev: true,
      text: 'Equipe, lembrando que teremos deploy agendado para as 22h referente ao módulo de rescisões.',
      time: '09:40',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');

  // New Dev Ticket form
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketModule, setTicketModule] = useState('Folha');
  const [ticketPriority, setTicketPriority] = useState<'Alta' | 'Urgente' | 'Normal'>('Normal');
  const [ticketDescription, setTicketDescription] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `dev-msg-${Date.now()}`,
      sender: currentUser.name,
      isDev: false,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    addAuditLog('Mensagem ao Desenvolvimento', 'Canal Dev', `Enviada por ${currentUser.name}`);

    // Simulate auto-reply from dev on-call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `dev-reply-${Date.now()}`,
          sender: 'Carlos Alberto (Dev Lead)',
          isDev: true,
          text: `Recebido, ${currentUser.name}! Estamos monitorando os logs do container correspondente.`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) return;

    const newId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDevTicket = {
      id: `dev-${Date.now()}`,
      ticketNumber: newId,
      title: ticketTitle.trim(),
      description: ticketDescription.trim(),
      module: ticketModule,
      status: 'Aberto' as const,
      priority: ticketPriority,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDevTickets((prev) => [newDevTicket as any, ...prev]);
    addAuditLog('Abertura de Chamado Dev', newId, ticketTitle);

    setMessages((prev) => [
      ...prev,
      {
        id: `dev-msg-${Date.now()}`,
        sender: 'Sistema IPTech Dev',
        isDev: true,
        text: `📌 Novo chamado de engenharia [${newId}] aberto por ${currentUser.name}: "${ticketTitle}". Módulo: ${ticketModule}.`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setTicketTitle('');
    setTicketDescription('');
    setActiveTab('chat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Canal com o Desenvolvimento (Engenharia)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  Online
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Comunicação direta entre técnicos de atendimento e desenvolvedores de software
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Chat em Tempo Real</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new_ticket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_ticket'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Reportar Incidente / Bug ao Dev</span>
          </button>
        </div>

        {/* Body */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/60">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isDev ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                    {m.sender}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                      m.isDev
                        ? 'bg-slate-850 text-slate-200 border border-slate-800'
                        : 'bg-rose-600/90 text-white shadow-sm'
                    }`}
                  >
                    {m.text}
                    <div className="text-[9px] opacity-70 text-right mt-1 font-mono">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input message */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Escreva uma mensagem para a equipe de desenvolvimento..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="flex-1 p-5 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">Título do Incidente / Ticket:</label>
              <input
                type="text"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                placeholder="Ex: Erro 401 no envio S-1200 ou Inconsistência na tabela progressiva"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Módulo / Sistema:</label>
                <select
                  value={ticketModule}
                  onChange={(e) => setTicketModule(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Folha">Folha de Pagamento</option>
                  <option value="eSocial">eSocial XML</option>
                  <option value="Contabilidade">Contabilidade Pública</option>
                  <option value="Tributos">Tributos & Arrecadação</option>
                  <option value="Educação">Educação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="API / Integrações">API / Integrações</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Prioridade:</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente (Bloqueante)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Descrição Técnica / Passos para Reproduzir:
              </label>
              <textarea
                rows={5}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Detalhes técnicos, log do erro ou XML correspondente..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Voltar ao Chat
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Registrar Chamado no Dev</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
