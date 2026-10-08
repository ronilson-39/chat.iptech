import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Calendar,
  ArrowLeft,
  Building2,
  FileDown,
  Printer,
  CheckCircle2,
  Clock,
  UserCheck,
  Star,
  MessageSquare,
  Layers,
  Phone,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation } from '../../types';

interface NormalHistoryViewProps {
  onBackToInbox: () => void;
  onOpenConversation?: (convId: string) => void;
}

export const NormalHistoryView: React.FC<NormalHistoryViewProps> = ({
  onBackToInbox,
  onOpenConversation,
}) => {
  const { conversations, clients, verticals } = useHelpdesk();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedHistoricalId, setSelectedHistoricalId] = useState<string | null>(null);

  // Filter historical conversations
  const closedConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Must be Encerrado or cataloged or finished
      const isHistorical = c.status === 'Encerrado' || Boolean(c.title);
      if (!isHistorical) return false;

      if (selectedClientId !== 'all' && c.clientId !== selectedClientId) return false;
      if (selectedVerticalId !== 'all' && c.verticalId !== selectedVerticalId) return false;

      const convDate = c.ticketDate || c.startedAt || '';
      if (startDate && convDate < startDate) return false;
      if (endDate && convDate > endDate) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = (c.title || '').toLowerCase().includes(term);
        const matchProtocol = c.protocol.toLowerCase().includes(term);
        const matchClient = c.clientName.toLowerCase().includes(term);
        const matchSummary = (c.ticketSummary || '').toLowerCase().includes(term);
        const matchSnippet = c.lastMessageSnippet.toLowerCase().includes(term);
        return matchTitle || matchProtocol || matchClient || matchSummary || matchSnippet;
      }

      return true;
    });
  }, [conversations, selectedClientId, selectedVerticalId, startDate, endDate, searchTerm]);

  const activeConv = closedConversations.find((c) => c.id === selectedHistoricalId) || closedConversations[0] || null;

  const handlePrint = () => {
    window.print();
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
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Histórico Geral de Atendimentos
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {closedConversations.length} registrados
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                Consulta e prestação de contas de chamados encerrados e catalogados
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Imprimir ou exportar relatório em PDF"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por protocolo, resumo, mensagem..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">Todas as Entidades</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.tradeName || c.companyName}
            </option>
          ))}
        </select>

        <select
          value={selectedVerticalId}
          onChange={(e) => setSelectedVerticalId(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all">Todos os Sistemas</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Layout: Left List + Right Transcript */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List of Closed Conversations */}
        <div className="w-full sm:w-80 lg:w-96 bg-slate-900/70 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto divide-y divide-slate-800/60">
          {closedConversations.map((c) => {
            const isSelected = activeConv?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedHistoricalId(c.id)}
                className={`p-3.5 cursor-pointer transition text-left ${
                  isSelected ? 'bg-slate-800/90 border-l-4 border-cyan-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.protocol}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{c.ticketDate || c.lastMessageAt}</span>
                </div>

                <h4 className="text-xs font-bold text-white truncate">{c.clientName}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {c.title || c.ticketSummary || c.lastMessageSnippet}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-400 font-medium">{c.verticalName}</span>
                  {c.satisfactionRating && (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {c.satisfactionRating}/5
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {closedConversations.length === 0 && (
            <div className="text-center py-16 px-4 text-slate-500 text-xs">
              Nenhum histórico encontrado com os filtros aplicados.
            </div>
          )}
        </div>

        {/* Right Details & Transcript Panel */}
        {activeConv ? (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 bg-slate-950">
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-5 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {activeConv.protocol}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {activeConv.verticalName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Encerrado em: <strong>{activeConv.closedAt ? new Date(activeConv.closedAt).toLocaleDateString('pt-BR') : activeConv.ticketDate || 'Registrado'}</strong></span>
                </div>
              </div>

              <h2 className="text-base font-bold text-white mb-1">
                {activeConv.title || activeConv.clientName}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span>Cliente: <strong className="text-slate-200">{activeConv.clientName}</strong></span>
                <span>•</span>
                <span>Técnico: <strong className="text-slate-200">{activeConv.assignedTechnicianName || 'Equipe Suporte'}</strong></span>
              </div>

              {activeConv.ticketSummary && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400 block mb-1">Resumo da Catalogação:</strong>
                  {activeConv.ticketSummary}
                </div>
              )}
            </div>

            {/* Messages Transcript */}
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Transcrição Integral do Atendimento ({activeConv.messages.length} mensagens):
            </h3>

            <div className="space-y-3 flex-1 select-text">
              {activeConv.messages.map((m) => {
                const isClient = m.senderType === 'client';
                const isSystem = m.senderType === 'system';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center text-[10px] text-slate-500 py-1">
                      <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                        {m.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                  >
                    {isClient && (
                      <span className="text-[10px] text-slate-400 px-1 mb-1">{m.senderName}</span>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                        isClient
                          ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                          : 'bg-emerald-500 text-black rounded-tr-none'
                      }`}
                    >
                      {!isClient ? (
                        <>
                          <div className="font-bold text-black text-xs leading-tight">
                            {(m.senderName || 'Técnico').replace(/:$/, '')}:
                          </div>
                          <div className="font-normal text-black text-xs leading-relaxed mt-0.5 whitespace-pre-wrap">
                            {m.content}
                          </div>
                        </>
                      ) : (
                        m.content
                      )}
                      <div className={`text-[9px] mt-1 text-right font-mono ${isClient ? 'opacity-75' : 'text-black/75 font-medium'}`}>
                        {m.createdAt}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Selecione um chamado histórico para visualizar os detalhes.
          </div>
        )}
      </div>
    </div>
  );
};
