import React, { useState } from 'react';
import {
  Columns,
  Plus,
  Search,
  Flame,
  ArrowLeft,
  X,
  Clock,
  UserCheck,
  CheckCircle2,
  Building2,
  Filter,
  Layers,
  ChevronRight,
  MoreVertical,
  Trash2,
  MoveRight,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation, TicketPriority, TicketStatus } from '../../types';

interface KanbanColumnDef {
  id: string;
  label: string;
  color: string;
  isCustom?: boolean;
}

const INITIAL_BOARDS: KanbanColumnDef[] = [
  { id: 'Pendente', label: 'Pendentes (Fila)', color: '#F59E0B' },
  { id: 'Em atendimento', label: 'Em Atendimento', color: '#10B981' },
  { id: 'Aguardando cliente', label: 'Aguardando Cliente', color: '#6366F1' },
  { id: 'Desenvolvimento', label: 'Em Análise com Dev', color: '#F43F5E', isCustom: true },
  { id: 'Encerrado', label: 'Encerrados / Concluídos', color: '#64748B' },
];

const BOARD_COLORS = [
  '#F59E0B', '#10B981', '#6366F1', '#F43F5E', '#8B5CF6',
  '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#64748B'
];

interface NormalKanbanViewProps {
  onBackToInbox: () => void;
  onOpenConversation: (convId: string) => void;
}

export const NormalKanbanView: React.FC<NormalKanbanViewProps> = ({
  onBackToInbox,
  onOpenConversation,
}) => {
  const { conversations, setConversations, clients, verticals, users, currentUser, addAuditLog, dispatchPushNotification } = useHelpdesk();

  const [boards, setBoards] = useState<KanbanColumnDef[]>(INITIAL_BOARDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('all');

  // Modal: Nova Tarefa
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskClientId, setTaskClientId] = useState(clients[0]?.id || '');
  const [taskVerticalId, setTaskVerticalId] = useState(verticals[0]?.id || '');
  const [taskBoardId, setTaskBoardId] = useState(boards[0]?.id || 'Pendente');
  const [taskPriority, setTaskPriority] = useState<TicketPriority>('Normal');
  const [taskAssignedTechId, setTaskAssignedTechId] = useState(currentUser.id);

  // Modal: Novo Quadro
  const [newBoardModalOpen, setNewBoardModalOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardColor, setBoardColor] = useState(BOARD_COLORS[4]);

  // Filter conversations
  const filteredTasks = conversations.filter((c) => {
    if (selectedVertical !== 'all' && c.verticalId !== selectedVertical) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(term);
      const matchClient = c.clientName.toLowerCase().includes(term);
      const matchSnippet = c.lastMessageSnippet.toLowerCase().includes(term);
      const matchProtocol = c.protocol.toLowerCase().includes(term);
      return matchTitle || matchClient || matchSnippet || matchProtocol;
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const selectedClient = clients.find((c) => c.id === taskClientId) || clients[0];
    const selectedVert = verticals.find((v) => v.id === taskVerticalId) || verticals[0];
    const assignedUser = users.find((u) => u.id === taskAssignedTechId) || currentUser;
    const proto = `IP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: Conversation = {
      id: `task-${Date.now()}`,
      protocol: proto,
      title: taskTitle.trim(),
      ticketSummary: taskDescription.trim(),
      clientId: selectedClient.id,
      clientName: selectedClient.tradeName || selectedClient.companyName,
      clientPhone: selectedClient.phone || '(11) 99999-0000',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      verticalId: selectedVert.id,
      verticalName: selectedVert.name,
      assignedTechnicianId: assignedUser.id,
      assignedTechnicianName: assignedUser.name,
      status: (taskBoardId as TicketStatus) || 'Pendente',
      priority: taskPriority,
      slaStatus: 'Dentro do SLA',
      slaTargetMinutes: 120,
      slaMinutesElapsed: 1,
      slaExpiresAt: new Date(Date.now() + 120 * 60000).toISOString(),
      unreadCount: 0,
      lastMessageSnippet: taskDescription.trim() || `Tarefa criada: ${taskTitle}`,
      lastMessageAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      startedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-init-${Date.now()}`,
          conversationId: `task-${Date.now()}`,
          senderType: 'system',
          senderName: 'Sistema Kanban',
          content: `Tarefa iniciada e atribuída a ${assignedUser.name}: ${taskTitle}.`,
          type: 'text',
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setConversations((prev) => [newTicket, ...prev]);
    addAuditLog('Criação de Tarefa Kanban', `Protocolo ${proto}`, `Criado por ${currentUser.name} | Atribuído a ${assignedUser.name}`);

    // Dispara Notificação Push para o técnico
    dispatchPushNotification({
      title: `📋 Tarefa Atribuída no Kanban: ${taskTitle.trim()}`,
      body: `Atribuída ao técnico ${assignedUser.name} | ${selectedClient.tradeName || selectedClient.companyName} (${selectedVert.name})`,
      type: 'kanban_task_assigned',
      data: {
        taskId: newTicket.id,
        technicianId: assignedUser.id,
        technicianName: assignedUser.name,
        clientName: selectedClient.companyName,
        protocol: proto,
      },
    });

    setTaskTitle('');
    setTaskDescription('');
    setNewTaskModalOpen(false);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    const newBoardId = `board-${Date.now()}`;
    const newBoard: KanbanColumnDef = {
      id: newBoardId,
      label: boardName.trim(),
      color: boardColor,
      isCustom: true,
    };

    setBoards((prev) => [...prev, newBoard]);
    addAuditLog('Criação de Quadro Kanban', `Quadro: ${boardName.trim()}`, `Criado por ${currentUser.name}`);

    setBoardName('');
    setNewBoardModalOpen(false);
  };

  const handleMoveTask = (taskId: string, targetBoardId: string) => {
    const targetBoard = boards.find((b) => b.id === targetBoardId);
    const targetTask = conversations.find((c) => c.id === taskId);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === taskId
          ? {
              ...c,
              status: (targetBoardId as TicketStatus) || c.status,
            }
          : c
      )
    );

    if (targetBoard && targetTask) {
      dispatchPushNotification({
        title: `📋 Tarefa Movida no Kanban`,
        body: `"${targetTask.title || targetTask.clientName}" movida para a etapa "${targetBoard.label}"`,
        type: 'kanban_task_assigned',
        data: {
          taskId: targetTask.id,
          protocol: targetTask.protocol,
        },
      });
    }
  };

  const handleDeleteCustomBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Quadro Kanban
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {conversations.length} tarefas
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                Fluxo ágil de chamados e tarefas técnicas
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Vertical Filter */}
          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 hidden sm:block"
          >
            <option value="all">Todos os Sistemas</option>
            {verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Botão: Criar Novo Quadro (Request 1) */}
          <button
            type="button"
            onClick={() => setNewBoardModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Criar novo quadro/coluna no Kanban"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Novo Quadro</span>
          </button>

          {/* Botão: Criar Nova Tarefa (Request 1) */}
          <button
            type="button"
            onClick={() => setNewTaskModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-950/40"
            title="Criar nova tarefa no Kanban"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Area (Horizontal Scroll) */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 flex gap-4 bg-slate-950/80 items-start">
        {boards.map((col) => {
          const colTasks = filteredTasks.filter((t) => {
            if (col.id === 'Pendente') return t.status === 'Pendente';
            if (col.id === 'Em atendimento') return t.status === 'Em atendimento' || t.status === 'Transferido';
            if (col.id === 'Aguardando cliente') return t.status === 'Aguardando cliente' || t.status === 'Aguardando equipe';
            if (col.id === 'Encerrado') return t.status === 'Encerrado';
            // Custom board matches custom string or matching status
            return t.status === col.id;
          });

          return (
            <div
              key={col.id}
              className="w-80 sm:w-88 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shrink-0 shadow-xl max-h-[calc(100vh-8.5rem)]"
            >
              {/* Column Header */}
              <div
                className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-850/90"
                style={{ borderTop: `4px solid ${col.color}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-bold text-white truncate max-w-[170px]">{col.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: `${col.color}20`,
                      borderColor: `${col.color}50`,
                      color: col.color,
                    }}
                  >
                    {colTasks.length}
                  </span>
                  {col.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomBoard(col.id)}
                      className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition"
                      title="Excluir quadro personalizado"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colTasks.map((task) => {
                  const isUrgent = task.priority === 'Alta' || task.priority === 'Urgente';
                  const vert = verticals.find((v) => v.id === task.verticalId);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenConversation(task.id)}
                      className="p-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 rounded-xl transition cursor-pointer text-left shadow-sm hover:shadow-lg group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700/80">
                          {task.protocol}
                        </span>
                        {isUrgent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-800 flex items-center gap-1 font-bold">
                            <Flame className="w-2.5 h-2.5 text-red-400" />
                            {task.priority}
                          </span>
                        )}
                      </div>

                      {/* Title & Client */}
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                        {task.title || task.clientName}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 truncate">
                        <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{task.clientName}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {task.ticketSummary || task.lastMessageSnippet}
                      </p>

                      {/* Footer & Move Quick Action */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60 text-[10px]">
                        <span
                          className="px-2 py-0.5 rounded font-semibold border"
                          style={{
                            backgroundColor: `${vert?.color || '#3B82F6'}20`,
                            borderColor: `${vert?.color || '#3B82F6'}40`,
                            color: vert?.color || '#93C5FD',
                          }}
                        >
                          {task.verticalName}
                        </span>

                        {/* Move selector */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1"
                        >
                          <select
                            value={task.status}
                            onChange={(e) => handleMoveTask(task.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                            title="Mover para outro quadro"
                          >
                            {boards.map((b) => (
                              <option key={b.id} value={b.id}>
                                Mover: {b.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    Nenhuma tarefa nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nova Tarefa no Kanban */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Nova Tarefa no Kanban</h3>
                  <p className="text-[11px] text-slate-400">Atribuição rápida para técnicos e equipes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título da Tarefa:</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex: Verificar divergência no fechamento da Folha de Pagamento"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Entidade / Cliente:</label>
                  <select
                    value={taskClientId}
                    onChange={(e) => setTaskClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName || c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sistema / Vertical:</label>
                  <select
                    value={taskVerticalId}
                    onChange={(e) => setTaskVerticalId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {verticals.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quadro Inicial:</label>
                  <select
                    value={taskBoardId}
                    onChange={(e) => setTaskBoardId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioridade:</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Atribuir ao Técnico de Suporte:</label>
                <select
                  value={taskAssignedTechId}
                  onChange={(e) => setTaskAssignedTechId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {users
                    .filter((u) => u.role === 'technical_user' || u.role === 'admin' || u.role === 'super_admin')
                    .map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} ({tech.cargo || tech.role}) {tech.id === currentUser.id ? '— (Você)' : ''}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  O técnico receberá um alerta imediato de Web Push no navegador e no sistema.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição / Detalhes:</label>
                <textarea
                  rows={3}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Instruções para o atendimento e contexto do incidente..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Quadro / Coluna */}
      {newBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Novo Quadro (Coluna)</h3>
                  <p className="text-[11px] text-slate-400">Personalize o fluxo de atendimento da sua equipe</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewBoardModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Quadro / Etapa:</label>
                <input
                  type="text"
                  required
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Ex: Validação Contábil, Homologação, Triagem"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Cor do Quadro:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {BOARD_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBoardColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                        boardColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewBoardModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-md"
                >
                  Criar Quadro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
