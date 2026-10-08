import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation } from '../../types';
import {
  MessageSquare,
  Search,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface MinimizedConversationsGridProps {
  onOpenInPanel?: (conversationId: string) => void;
}

export const MinimizedConversationsGrid: React.FC<MinimizedConversationsGridProps> = ({
  onOpenInPanel,
}) => {
  const {
    conversations,
    currentUser,
    floatingWindows,
    openFloatingWindow,
    bringToFront,
    restoreAllFloatingWindows,
  } = useHelpdesk();

  const [searchTerm, setSearchTerm] = useState('');

  // Pega as conversas atribuídas ao técnico ou ativas
  const userConvs = conversations.filter(
    (c) => c.assignedTechnicianId === currentUser.id
  );
  const targetConvs = userConvs.length > 0
    ? userConvs
    : conversations.filter((c) => c.status !== 'Encerrado').slice(0, 12);

  const filteredConvs = targetConvs.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(term) ||
      c.clientPhone.toLowerCase().includes(term) ||
      c.protocol.toLowerCase().includes(term) ||
      c.lastMessageSnippet.toLowerCase().includes(term)
    );
  });

  const getFloatingStatus = (convId: string) => {
    const win = floatingWindows.find((w) => w.dataId === convId && w.type === 'conversation');
    if (!win) return { exists: false, isMinimized: false, winId: null };
    return { exists: true, isMinimized: win.isMinimized, winId: win.id };
  };

  const openWindowsCount = floatingWindows.filter((w) => w.type === 'conversation' && !w.isMinimized).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none animate-in fade-in duration-150">
      {/* Sub-barra minimalista com Contador e Busca */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Conversas:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-white font-mono font-bold text-[11px] border border-slate-700">
            {targetConvs.length}
          </span>
          {openWindowsCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-800/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {openWindowsCount} aberta{openWindowsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Busca Rápida na Grade */}
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar conversas..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={restoreAllFloatingWindows}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="Restaurar todas as janelas na tela (F2)"
          >
            <Maximize2 className="w-3 h-3 text-slate-400" />
            <span>Restaurar (F2)</span>
          </button>
        </div>
      </div>

      {/* Grade Organizada em Linhas e Colunas (Blocos Minimalistas) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredConvs.map((conv) => {
            const status = getFloatingStatus(conv.id);
            const isWindowOpen = status.exists && !status.isMinimized;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isWindowOpen) {
                    openFloatingWindow(conv.clientName, 'conversation', conv.id);
                  } else if (status.winId) {
                    bringToFront(status.winId);
                  }
                }}
                className={`group flex flex-col justify-between rounded-xl p-3.5 transition-all duration-200 border cursor-pointer select-none ${
                  isWindowOpen
                    ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div>
                  {/* Top: Avatar, Nome, Telefone e Horário */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={conv.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={conv.clientName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-xs"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-emerald-300 transition-colors">
                          {conv.clientName}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                          {conv.clientPhone}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono shrink-0 pt-0.5">
                      {conv.lastMessageAt}
                    </span>
                  </div>

                  {/* Mensagem Recente (Minimalista, 2 linhas limpas) */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mt-2.5">
                    {conv.lastMessageSnippet}
                  </p>
                </div>

                {/* Rodapé Minimalista: Status */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {isWindowOpen ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Aberta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <Minimize2 className="w-2.5 h-2.5 text-slate-500" />
                      Minimizada
                    </span>
                  )}

                  {onOpenInPanel && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInPanel(conv.id);
                      }}
                      className="p-1 rounded-lg bg-slate-800/60 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Abrir no painel principal"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredConvs.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-xs">
            Nenhuma conversa encontrada com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};
