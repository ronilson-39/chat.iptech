import React from 'react';
import {
  X,
  Columns,
  MessageSquare,
  Clock,
  UserCheck,
  Tag as TagIcon,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Flame,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation, TicketStatus } from '../../types';

interface KanbanBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (convId: string) => void;
}

const KANBAN_COLUMNS: { status: TicketStatus; label: string; color: string; badgeBg: string }[] = [
  { status: 'Pendente', label: 'Pendentes (Fila)', color: '#F59E0B', badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { status: 'Em atendimento', label: 'Em Atendimento', color: '#10B981', badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { status: 'Aguardando cliente', label: 'Aguardando Cliente', color: '#6366F1', badgeBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { status: 'Encerrado', label: 'Encerrados', color: '#64748B', badgeBg: 'bg-slate-700 text-slate-300 border-slate-600' },
];

export const KanbanBoardModal: React.FC<KanbanBoardModalProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const { conversations, currentUser } = useHelpdesk();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Quadro Kanban de Chamados & Atendimentos</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {conversations.length} total
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Acompanhe o fluxo de tickets por etapa: clique em qualquer cartão para abrir o chat
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

        {/* Kanban Board Columns */}
        <div className="flex-1 overflow-x-auto p-4 flex gap-3.5 bg-slate-950/60">
          {KANBAN_COLUMNS.map((col) => {
            const columnTickets = conversations.filter((c) => {
              if (col.status === 'Em atendimento') {
                return c.status === 'Em atendimento' || c.status === 'Transferido';
              }
              if (col.status === 'Aguardando cliente') {
                return c.status === 'Aguardando cliente' || c.status === 'Aguardando equipe';
              }
              return c.status === col.status;
            });

            return (
              <div
                key={col.status}
                className="w-72 sm:w-80 flex flex-col bg-slate-850/90 border border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-lg"
              >
                {/* Column Header */}
                <div
                  className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90"
                  style={{ borderTop: `3px solid ${col.color}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-xs font-bold text-white">{col.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${col.badgeBg}`}>
                    {columnTickets.length}
                  </span>
                </div>

                {/* Cards Stream */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {columnTickets.map((c) => {
                    const isUrgent = c.priority === 'Urgente' || c.priority === 'Alta';

                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectConversation(c.id);
                          onClose();
                        }}
                        className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 rounded-xl transition cursor-pointer text-left shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700/80">
                            {c.protocol}
                          </span>
                          {isUrgent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-800 flex items-center gap-1 font-bold">
                              <Flame className="w-2.5 h-2.5 text-red-400" />
                              {c.priority}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                          {c.clientName}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {c.title || c.lastMessageSnippet}
                        </p>

                        {/* Etiquetas */}
                        {c.tags && c.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {c.tags.slice(0, 3).map((t) => (
                              <span
                                key={t.id}
                                className="text-[9px] px-1.5 py-0.2 rounded font-semibold border flex items-center gap-0.5"
                                style={{
                                  backgroundColor: `${t.color}20`,
                                  borderColor: `${t.color}60`,
                                  color: t.color,
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[140px]">
                            {c.verticalName} • {c.assignedTechnicianName || '—'}
                          </span>
                          <span className="font-mono text-slate-500">{c.lastMessageAt}</span>
                        </div>
                      </div>
                    );
                  })}

                  {columnTickets.length === 0 && (
                    <div className="text-center py-10 text-slate-600 text-xs">
                      Nenhum chamado nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Clique em qualquer cartão para abrir e responder a conversa.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
