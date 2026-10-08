import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Search,
  Calendar,
  FileDown,
  Image as ImageIcon,
  History,
  MessageSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  Filter,
  CheckCheck,
  Star,
  Printer,
  ChevronDown,
  ChevronUp,
  Building2,
  Layers,
  Phone,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation } from '../../types';

interface GlobalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalHistoryModal: React.FC<GlobalHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { conversations, clients, verticals } = useHelpdesk();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  // Filter all closed or cataloged conversations
  const closedConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Must be Encerrado or have ticket cataloging
      const isHistorical = c.status === 'Encerrado' || Boolean(c.title);
      if (!isHistorical) return false;

      // Filter by Client
      if (selectedClientId !== 'all' && c.clientId !== selectedClientId) {
        return false;
      }

      // Filter by Vertical
      if (selectedVerticalId !== 'all' && c.verticalId !== selectedVerticalId) {
        return false;
      }

      // Filter by Date Period
      const convDate = c.ticketDate || c.startedAt || '';
      if (startDate && convDate < startDate) return false;
      if (endDate && convDate > endDate) return false;

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = (c.title || '').toLowerCase().includes(term);
        const matchProtocol = c.protocol.toLowerCase().includes(term);
        const matchClient = c.clientName.toLowerCase().includes(term);
        const matchSummary = (c.ticketSummary || '').toLowerCase().includes(term);
        const matchSnippet = c.lastMessageSnippet.toLowerCase().includes(term);
        const matchMessages = c.messages.some((m) => m.content.toLowerCase().includes(term));
        return matchTitle || matchProtocol || matchClient || matchSummary || matchSnippet || matchMessages;
      }

      return true;
    });
  }, [conversations, selectedClientId, selectedVerticalId, startDate, endDate, searchTerm]);

  const activeExpandedConv = conversations.find((c) => c.id === expandedConvId) || closedConversations[0];

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadImage = (conv: Conversation) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#0F172A');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Header banner
    ctx.fillStyle = '#10B981';
    ctx.fillRect(0, 0, 800, 8);

    // Title & Protocol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('IPTech — Histórico de Atendimento', 40, 50);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(`Protocolo: ${conv.protocol}  |  Data: ${conv.ticketDate || 'Hoje'}`, 40, 80);

    // Card Box
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(40, 110, 720, 340, 16);
    ctx.fill();

    // Client and Subject
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText(`Cliente: ${conv.clientName}`, 60, 150);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(`Assunto: ${conv.title || 'Atendimento Concluído'}`, 60, 185);

    // Summary
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px system-ui, sans-serif';
    const summary = conv.ticketSummary || conv.lastMessageSnippet || 'Sem resumo registrado.';
    ctx.fillText(`Resumo: ${summary.slice(0, 90)}...`, 60, 220);

    // Meta details
    ctx.fillStyle = '#64748B';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(`Técnico Responsável: ${conv.assignedTechnicianName || 'Suporte Técnico'}`, 60, 260);
    ctx.fillText(`Vertical / Sistema: ${conv.verticalName}  |  Status: Encerrado`, 60, 285);
    ctx.fillText(`Total de Mensagens: ${conv.messages.length}  |  Avaliação: ⭐⭐⭐⭐⭐`, 60, 310);

    ctx.fillStyle = '#10B981';
    ctx.font = 'italic 12px system-ui, sans-serif';
    ctx.fillText('Documento gerado e autenticado pela plataforma IPTech Atendimento.', 60, 420);

    const link = document.createElement('a');
    link.download = `historico_${conv.protocol}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col h-[650px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Histórico Geral de Conversas Salvas</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {closedConversations.length} chamado(s) encontrado(s)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Consulte qualquer atendimento por período, texto, frases ou entidade, e faça o download em PDF ou Imagem
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

        {/* Filter Toolbar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por texto, frase, protocolo..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Filter Entity */}
          <div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Todas as Entidades</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tradeName || c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Filter System / Vertical */}
          <div>
            <select
              value={selectedVerticalId}
              onChange={(e) => setSelectedVerticalId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Todos os Sistemas</option>
              {verticals.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
              title="Data inicial"
            />
            <span className="text-slate-500 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
              title="Data final"
            />
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* List of Conversations */}
          <div className="w-full md:w-1/2 overflow-y-auto p-3 space-y-2">
            {closedConversations.map((c) => {
              const isSelected = expandedConvId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setExpandedConvId(c.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.protocol}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {c.ticketDate || c.lastMessageAt || 'Finalizado'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                    {c.title || `Suporte ${c.verticalName} — ${c.clientName}`}
                  </h3>

                  <div className="text-[11px] text-cyan-400 font-semibold truncate mt-0.5">
                    {c.clientName}
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {c.ticketSummary || c.lastMessageSnippet}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{c.verticalName} • Técnico: {c.assignedTechnicianName || '—'}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{c.satisfactionRating || 5}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {closedConversations.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-xs">
                Nenhum histórico encontrado com os filtros aplicados.
              </div>
            )}
          </div>

          {/* Details & Actions for Selected Conversation */}
          <div className="w-full md:w-1/2 flex flex-col overflow-hidden bg-slate-950/60">
            {activeExpandedConv ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Detail Header & Action Buttons */}
                <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{activeExpandedConv.protocol}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        Encerrado
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {activeExpandedConv.clientName}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrintPDF}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                      title="Imprimir ou salvar em modelo PDF"
                    >
                      <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Modelo PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadImage(activeExpandedConv)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                      title="Baixar resumo formatado em imagem"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Modelo Imagem</span>
                    </button>
                  </div>
                </div>

                {/* Ticket Meta Details */}
                <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-200">
                    Título: <span className="font-normal text-white">{activeExpandedConv.title || 'Chamado de Suporte'}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    <strong>Resumo Registrado:</strong> {activeExpandedConv.ticketSummary || activeExpandedConv.lastMessageSnippet}
                  </div>
                </div>

                {/* Message Transcript Stream */}
                <div ref={printAreaRef} className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                    Transcrição Completa das Mensagens:
                  </div>
                  {activeExpandedConv.messages.map((m) => {
                    const isClient = m.senderType === 'client';
                    const isSys = m.senderType === 'system';
                    if (isSys) {
                      return (
                        <div key={m.id} className="text-center text-[10px] text-slate-500 py-1">
                          <span className="bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/40">
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
                          <div className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName}</div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                            isClient
                              ? 'bg-slate-850 text-slate-100 border border-slate-700/60'
                              : 'bg-emerald-500 text-black'
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
                          <div className={`text-[9px] text-right mt-1 font-mono ${isClient ? 'opacity-70 text-slate-300' : 'text-black/70 font-medium'}`}>
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
                Selecione uma conversa para visualizar os detalhes e baixar.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Total de {closedConversations.length} atendimentos catalogados no banco de dados.
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
