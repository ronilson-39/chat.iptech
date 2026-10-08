import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Send,
  UserCheck,
  CheckCircle2,
  Bug,
  Cpu,
  Clock,
  Sparkles,
  Paperclip,
  ArrowLeft,
  ChevronDown,
  X,
  Plus,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface Developer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  tags: string[];
}

const DEVELOPERS_LIST: Developer[] = [
  {
    id: 'dev-1',
    name: 'Carlos Alberto',
    role: 'Dev Lead & Arquiteto de Software',
    specialty: 'Microserviços, Cloud & Infraestrutura',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    status: 'online',
    tags: ['Backend', 'Docker', 'Go', 'Node.js'],
  },
  {
    id: 'dev-2',
    name: 'Ana Clara Souza',
    role: 'Engenheira de Software Sênior',
    specialty: 'eSocial, Mensageria S-1200 / S-2299 & XML',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120',
    status: 'online',
    tags: ['eSocial', 'XML', 'PostgreSQL', 'APIs'],
  },
  {
    id: 'dev-3',
    name: 'Bruno Mendes',
    role: 'Desenvolvedor Fullstack',
    specialty: 'Módulo de Folha de Pagamento & Rescisões',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    status: 'busy',
    tags: ['Folha', 'Cálculos', 'React', 'TypeScript'],
  },
  {
    id: 'dev-4',
    name: 'Rodrigo Lima',
    role: 'Especialista DevOps & SRE',
    specialty: 'Containers, Kubernetes & Banco de Dados',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    status: 'online',
    tags: ['Kubernetes', 'CI/CD', 'Linux', 'AWS'],
  },
  {
    id: 'dev-5',
    name: 'Camila Duarte',
    role: 'Engenheira de QA & Suporte N3',
    specialty: 'Validação de Regras de Negócio e Testes',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
    status: 'away',
    tags: ['QA', 'Homologação', 'Auditoria'],
  },
];

interface NormalDevViewProps {
  onBackToInbox: () => void;
}

export const NormalDevView: React.FC<NormalDevViewProps> = ({ onBackToInbox }) => {
  const { currentUser, devTickets, setDevTickets, addAuditLog } = useHelpdesk();

  const [selectedDev, setSelectedDev] = useState<Developer>(DEVELOPERS_LIST[0]);
  const [devPickerOpen, setDevPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const [inputMsg, setInputMsg] = useState('');

  // New Dev Ticket Modal
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketModule, setTicketModule] = useState('Folha');
  const [ticketPriority, setTicketPriority] = useState<'Alta' | 'Urgente' | 'Normal'>('Normal');
  const [ticketDescription, setTicketDescription] = useState('');

  // Messages per developer
  const [devConversations, setDevConversations] = useState<Record<string, Array<{ id: string; sender: string; isDev: boolean; text: string; time: string }>>>({
    'dev-1': [
      {
        id: 'msg-1',
        sender: 'Carlos Alberto',
        isDev: true,
        text: 'Olá! Sou o Carlos, líder técnico. Acabamos de subir um hotfix no microserviço do eSocial v2.4.1. Qualquer dúvida ou erro 500 nos avise!',
        time: '08:30',
      },
      {
        id: 'msg-2',
        sender: 'Atendimento',
        isDev: false,
        text: 'Perfeito Carlos! Acompanhamos a liberação e os lotes foram validados.',
        time: '09:12',
      },
    ],
    'dev-2': [
      {
        id: 'msg-3',
        sender: 'Ana Clara Souza',
        isDev: true,
        text: 'Oi! Estou cuidando dos eventos periódicos do eSocial (S-1200 e S-1210). Se algum cliente tiver rejeição de rubrica, pode mandar o XML aqui!',
        time: '08:45',
      },
    ],
    'dev-3': [
      {
        id: 'msg-4',
        sender: 'Bruno Mendes',
        isDev: true,
        text: 'Bom dia! Finalizando a rotina do 13º salário e rescisões complementares.',
        time: '09:00',
      },
    ],
  });

  const currentMessages = devConversations[selectedDev.id] || [
    {
      id: 'default-hello',
      sender: selectedDev.name,
      isDev: true,
      text: `Olá, ${currentUser.name}! Sou o ${selectedDev.name} (${selectedDev.role}). Em que posso ajudar no desenvolvimento hoje?`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ];

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

    setDevConversations((prev) => ({
      ...prev,
      [selectedDev.id]: [...(prev[selectedDev.id] || []), newMsg],
    }));

    setInputMsg('');
    addAuditLog('Mensagem ao Desenvolvimento', `Dev: ${selectedDev.name}`, `Enviada por ${currentUser.name}`);

    // Auto-reply
    setTimeout(() => {
      setDevConversations((prev) => ({
        ...prev,
        [selectedDev.id]: [
          ...(prev[selectedDev.id] || []),
          {
            id: `dev-reply-${Date.now()}`,
            sender: selectedDev.name,
            isDev: true,
            text: `Entendido, ${currentUser.name}! Estou analisando o log do sistema e verificando no banco. Já retorno com a tratativa.`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }, 1400);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) return;

    const newId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDevTicket = {
      id: `dev-${Date.now()}`,
      protocol: newId,
      ticketNumber: newId,
      technicianId: currentUser.id,
      technicianName: currentUser.name,
      clientId: 'internal-dev',
      clientName: selectedDev.name,
      verticalId: 'suporte-dev',
      title: ticketTitle.trim(),
      description: ticketDescription.trim(),
      module: ticketModule,
      priority: ticketPriority,
      status: 'Em Análise' as const,
      createdAt: new Date().toISOString(),
      assignedDev: selectedDev.name,
      comments: [
        {
          id: `cmt-${Date.now()}`,
          authorName: currentUser.name,
          role: currentUser.role,
          content: `Chamado atribuído para o desenvolvedor ${selectedDev.name}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setDevTickets((prev) => [newDevTicket, ...prev]);
    addAuditLog('Abertura de Chamado Dev', `Ticket ${newId}`, `Atribuído para ${selectedDev.name}`);

    setTicketTitle('');
    setTicketDescription('');
    setNewTicketModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 overflow-hidden select-none animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToInbox}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Voltar ao Atendimento"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Canal de Desenvolvimento (Engenharia)
              </h1>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                Comunicação direta com os desenvolvedores da IPTech
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions: Escolher Desenvolvedor (Request 2) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão: Escolher Desenvolvedor (Request 2) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDevPickerOpen(!devPickerOpen)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-md shadow-rose-950/40 cursor-pointer active:scale-95"
              title="Escolher o técnico de desenvolvimento para conversar"
            >
              <Users className="w-4 h-4" />
              <span className="hidden xs:inline">Desenvolvedor:</span>
              <span className="font-semibold">{selectedDev.name}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu: Escolher Desenvolvedor */}
            {devPickerOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-11 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in"
              >
                <div className="px-2.5 py-2 border-b border-slate-800 mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-400" />
                    Escolher Técnico de Desenvolvimento:
                  </span>
                  <button
                    onClick={() => setDevPickerOpen(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {DEVELOPERS_LIST.map((dev) => {
                    const isSelected = selectedDev.id === dev.id;
                    return (
                      <div
                        key={dev.id}
                        onClick={() => {
                          setSelectedDev(dev);
                          setDevPickerOpen(false);
                        }}
                        className={`p-2.5 rounded-xl transition cursor-pointer flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-rose-950/60 border-rose-500/50 text-white'
                            : 'hover:bg-slate-800 border-transparent text-slate-300'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={dev.avatar}
                            alt={dev.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                              dev.status === 'online'
                                ? 'bg-emerald-500'
                                : dev.status === 'busy'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{dev.name}</span>
                            <span className="text-[10px] capitalize text-slate-400 font-mono">
                              {dev.status === 'online' ? '● Online' : dev.status === 'busy' ? '● Ocupado' : '● Ausente'}
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-300 font-medium truncate mt-0.5">{dev.role}</p>
                          <p className="text-[10px] text-slate-400 truncate">{dev.specialty}</p>

                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {dev.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botão: Abrir Chamado Dev */}
          <button
            type="button"
            onClick={() => setNewTicketModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Abrir chamado de incidente para o desenvolvimento"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Criar Chamado Dev</span>
          </button>
        </div>
      </div>

      {/* Main Dev Layout: Selected Developer Profile Bar + Chat Stream */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Selected Developer Active Banner */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={selectedDev.avatar}
                alt={selectedDev.name}
                className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedDev.name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
                  {selectedDev.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Especialidade: <strong className="text-slate-300">{selectedDev.specialty}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Privada com {selectedDev.name.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3.5 select-text">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isDev ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 px-1">
                {msg.isDev && <Code2 className="w-3 h-3 text-rose-400" />}
                <span className="font-semibold">{msg.sender}</span>
                <span>• {msg.time}</span>
              </div>

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  msg.isDev
                    ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-mono text-[11px]'
                    : 'bg-rose-700 text-white rounded-tr-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="mt-auto p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={`Conversar diretamente com ${selectedDev.name} (ex: erro no XML S-1200, log do docker, deploy)...`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />

          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-rose-950/40 cursor-pointer"
            title="Enviar mensagem para o desenvolvedor"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modal: Novo Chamado para o Desenvolvimento */}
      {newTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Chamado Técnico para Engenharia</h3>
                  <p className="text-[11px] text-slate-400">Atribuído diretamente para {selectedDev.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Bug ou Demanda:</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="Ex: Rejeição no lote S-1200 código 401 - XML com estrutura inválida"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Módulo / Serviço:</label>
                  <select
                    value={ticketModule}
                    onChange={(e) => setTicketModule(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="eSocial">eSocial</option>
                    <option value="Folha">Folha de Pagamento</option>
                    <option value="Contabilidade">Contabilidade</option>
                    <option value="Portal">Portal da Transparência</option>
                    <option value="Banco">Banco de Dados / API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioridade:</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente (Bloqueante)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição e Log do Erro:</label>
                <textarea
                  rows={4}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Cole aqui o stacktrace, dados do cliente e passo a passo para reproduzir o problema..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-[11px] placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-md"
                >
                  Abrir Chamado Dev
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
