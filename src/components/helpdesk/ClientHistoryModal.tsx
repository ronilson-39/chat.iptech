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
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Conversation, ChatMessage } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface ClientHistoryModalProps {
  clientName: string;
  clientId: string;
  clientPhone: string;
  onClose: () => void;
}

export const ClientHistoryModal: React.FC<ClientHistoryModalProps> = ({
  clientName,
  clientId,
  clientPhone,
  onClose,
}) => {
  const { conversations, verticals } = useHelpdesk();

  // Search by message, terms, or phrases
  const [searchTerm, setSearchTerm] = useState('');

  // Date range filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Vertical and Status filter
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Encerrado' | 'Em atendimento' | 'Pendente'>('all');

  // Find all client conversations
  const allClientConvs = useMemo(() => {
    return conversations.filter(
      (c) => c.clientId === clientId || c.clientPhone === clientPhone || c.clientName.toLowerCase() === clientName.toLowerCase()
    );
  }, [conversations, clientId, clientPhone, clientName]);

  // Filter conversations based on period and search query
  const filteredConvs = useMemo(() => {
    return allClientConvs.filter((conv) => {
      // Status filter
      if (selectedStatus !== 'all' && conv.status !== selectedStatus) {
        return false;
      }

      // Vertical filter
      if (selectedVertical !== 'all' && conv.verticalId !== selectedVertical) {
        return false;
      }

      // Date period filter
      const convDate = conv.ticketDate || (conv.closedAt ? '2026-10-07' : '2026-10-07');
      if (startDate && convDate < startDate) {
        return false;
      }
      if (endDate && convDate > endDate) {
        return false;
      }

      // Search term (by phrase, message content, title or summary)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const titleMatch = (conv.title || '').toLowerCase().includes(query);
        const summaryMatch = (conv.ticketSummary || '').toLowerCase().includes(query);
        const protocolMatch = conv.protocol.toLowerCase().includes(query);
        const verticalMatch = conv.verticalName.toLowerCase().includes(query);
        const msgMatch = conv.messages.some((m) => m.content.toLowerCase().includes(query));

        if (!titleMatch && !summaryMatch && !protocolMatch && !verticalMatch && !msgMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allClientConvs, selectedStatus, selectedVertical, startDate, endDate, searchTerm]);

  // Selected conversation for preview
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    filteredConvs[0]?.id || allClientConvs[0]?.id || null
  );

  const selectedConv = useMemo(() => {
    return allClientConvs.find((c) => c.id === selectedConvId) || filteredConvs[0] || null;
  }, [allClientConvs, selectedConvId, filteredConvs]);

  // Quick period preset buttons
  const applyPresetPeriod = (preset: 'all' | 'today' | '7days' | '30days' | 'year') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'year') {
      const d = new Date(today.getFullYear(), 0, 1);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    }
  };

  // Download PDF Model (Generates an official formatted printable PDF document)
  const handleDownloadPdf = () => {
    if (!selectedConv) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita popups no navegador para gerar o PDF.');
      return;
    }

    const messagesHtml = selectedConv.messages
      .map(
        (m) => `
        <div style="margin-bottom: 12px; padding: 10px 14px; border-radius: 8px; ${
          m.senderType === 'client'
            ? 'background: #f1f5f9; border-left: 4px solid #0284c7;'
            : 'background: #ecfdf5; border-left: 4px solid #059669; text-align: left;'
        }">
          <div style="font-size: 11px; font-weight: bold; color: #334155; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>${m.senderName} (${m.senderType === 'client' ? 'Cliente' : 'Técnico de Suporte'})</span>
            <span style="color: #64748b; font-family: monospace;">${m.createdAt}</span>
          </div>
          <div style="font-size: 13px; color: #0f172a; line-height: 1.5; white-space: pre-wrap;">${m.content}</div>
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório de Atendimento - ${selectedConv.protocol}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 20px; font-weight: bold; color: #065f46; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; }
          .meta-item strong { color: #475569; }
          .summary-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px; line-height: 1.5; color: #1e3a8a; }
          .title-ticket { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
          .transcript-title { font-size: 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 16px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">HELPDESK OMNICHANNEL & ITSM GOV</div>
            <div style="font-size: 12px; color: #64748b;">Relatório Oficial de Atendimento e Suporte Técnico</div>
          </div>
          <div style="text-align: right; font-size: 12px;">
            <div><strong>Protocolo:</strong> ${selectedConv.protocol}</div>
            <div style="color: #64748b;">Emitido em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
          </div>
        </div>

        <div class="title-ticket">${selectedConv.title || `Atendimento #${selectedConv.protocol}`}</div>

        <div class="meta-box">
          <div class="meta-grid">
            <div class="meta-item"><strong>Cliente / Órgão:</strong> ${selectedConv.clientName}</div>
            <div class="meta-item"><strong>WhatsApp / Contato:</strong> ${selectedConv.clientPhone}</div>
            <div class="meta-item"><strong>Vertical Técnica:</strong> ${selectedConv.verticalName}</div>
            <div class="meta-item"><strong>Técnico Responsável:</strong> ${selectedConv.assignedTechnicianName || 'Atendimento Geral'}</div>
            <div class="meta-item"><strong>Data do Atendimento:</strong> ${selectedConv.ticketDate || selectedConv.lastMessageAt}</div>
            <div class="meta-item"><strong>Status Final:</strong> ${selectedConv.status} ${selectedConv.satisfactionRating ? `(Nota: ${selectedConv.satisfactionRating}/5 estrelas ⭐)` : ''}</div>
          </div>
        </div>

        ${
          selectedConv.ticketSummary
            ? `
          <div class="summary-box">
            <strong>Resumo Técnico do Atendimento:</strong><br/>
            ${selectedConv.ticketSummary}
          </div>
        `
            : ''
        }

        <div class="transcript-title">Transcrição Integral das Mensagens:</div>
        <div>
          ${messagesHtml}
        </div>

        <div class="footer">
          Documento gerado eletronicamente pela Plataforma IPTech Omnichannel. Válido para prestação de contas e auditoria interna.
        </div>

        <div class="no-print" style="position: fixed; bottom: 20px; right: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Imprimir / Salvar como PDF
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Download Image Model (Generates a graphical image export PNG of the conversation)
  const handleDownloadImage = () => {
    if (!selectedConv) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 850;
    const msgCount = selectedConv.messages.length;
    const estimatedHeight = 360 + msgCount * 70;
    canvas.width = width;
    canvas.height = estimatedHeight;

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, estimatedHeight);

    // Header gradient box
    const gradient = ctx.createLinearGradient(0, 0, width, 100);
    gradient.addColorStop(0, '#064e3b');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 120);

    // Title & Protocol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('HELPDESK SAAS - HISTÓRICO DE ATENDIMENTO', 30, 42);

    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText(`Protocolo: ${selectedConv.protocol}  •  Data: ${selectedConv.ticketDate || '2026-10-07'}`, 30, 70);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.fillText(`Cliente: ${selectedConv.clientName} (${selectedConv.clientPhone})`, 30, 98);

    // Ticket Title Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, 135, width - 60, 42);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(`Título: ${selectedConv.title || selectedConv.verticalName}`, 45, 161);

    // Summary Box
    if (selectedConv.ticketSummary) {
      ctx.fillStyle = '#172554';
      ctx.fillRect(30, 185, width - 60, 50);
      ctx.fillStyle = '#93c5fd';
      ctx.font = '12px Arial, sans-serif';
      const truncatedSummary = selectedConv.ticketSummary.slice(0, 115) + (selectedConv.ticketSummary.length > 115 ? '...' : '');
      ctx.fillText(`Resumo: ${truncatedSummary}`, 45, 214);
    }

    // Messages Stream
    let currentY = selectedConv.ticketSummary ? 255 : 200;
    ctx.font = '12px Arial, sans-serif';

    selectedConv.messages.forEach((msg) => {
      const isClient = msg.senderType === 'client';
      const boxW = width - 180;
      const boxX = isClient ? 40 : 140;

      ctx.fillStyle = isClient ? '#1e293b' : '#047857';
      ctx.beginPath();
      ctx.roundRect(boxX, currentY, boxW, 50, 8);
      ctx.fill();

      ctx.fillStyle = isClient ? '#38bdf8' : '#a7f3d0';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillText(`${msg.senderName} (${msg.createdAt})`, boxX + 12, currentY + 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial, sans-serif';
      const contentSnippet = msg.content.slice(0, 85) + (msg.content.length > 85 ? '...' : '');
      ctx.fillText(contentSnippet, boxX + 12, currentY + 38);

      currentY += 62;
    });

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText(
      `Exportado em ${new Date().toLocaleDateString('pt-BR')} • Helpdesk Omnichannel ITSM`,
      30,
      estimatedHeight - 20
    );

    // Trigger download
    const link = document.createElement('a');
    link.download = `historico-${selectedConv.protocol}-${clientName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Histórico de Atendimentos — {clientName}
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  {filteredConvs.length} encontrado(s)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Busque conversas por período, palavras ou frases e exporte em modelo PDF ou Imagem.
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

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search by message / phrase / keywords */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por mensagem, palavras ou frases..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Range: Initial & Final */}
            <div className="md:col-span-4 flex items-center gap-2 text-xs">
              <div className="flex-1 flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white text-xs focus:outline-none w-full"
                />
              </div>
              <div className="flex-1 flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-white text-xs focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Vertical Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Todas as Verticais</option>
                {verticals.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-2 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Período:
              </span>
              <button
                onClick={() => applyPresetPeriod('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  !startDate && !endDate ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Todo o Histórico
              </button>
              <button
                onClick={() => applyPresetPeriod('today')}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Hoje
              </button>
              <button
                onClick={() => applyPresetPeriod('7days')}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Últimos 7 dias
              </button>
              <button
                onClick={() => applyPresetPeriod('30days')}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => applyPresetPeriod('year')}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                Este Ano
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Status:</span>
              {(['all', 'Encerrado', 'Em atendimento', 'Pendente'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                    selectedStatus === st ? 'bg-indigo-900/90 text-indigo-200 border border-indigo-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: List of Matched Tickets */}
          <div className="w-80 sm:w-96 border-r border-slate-800 flex flex-col bg-slate-900/50 shrink-0">
            <div className="p-3 bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Atendimentos Catalogados</span>
              <span className="font-mono text-slate-300">{filteredConvs.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/70">
              {filteredConvs.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                const vert = verticals.find((v) => v.id === conv.verticalId);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3.5 cursor-pointer transition text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-800 border-l-4 border-indigo-500 shadow-sm'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-indigo-400">
                        {conv.protocol}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {conv.ticketDate || conv.lastMessageAt}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {conv.title || `Suporte ${conv.verticalName}`}
                    </h4>

                    {conv.ticketSummary && (
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
                        {conv.ticketSummary}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded font-semibold border"
                        style={{
                          backgroundColor: `${vert?.color || '#6366F1'}15`,
                          borderColor: `${vert?.color || '#6366F1'}40`,
                          color: vert?.color || '#818CF8',
                        }}
                      >
                        {conv.verticalName}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                            conv.status === 'Encerrado'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          }`}
                        >
                          {conv.status}
                        </span>
                        <span>•</span>
                        <span>{conv.messages.length} msg</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredConvs.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Nenhum chamado encontrado com os critérios pesquisados.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      applyPresetPeriod('all');
                      setSelectedStatus('all');
                      setSelectedVertical('all');
                    }}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Selected Ticket Details & Full Transcript */}
          {selectedConv ? (
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              {/* Ticket Top Action Bar */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 flex-wrap gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                      {selectedConv.protocol}
                    </span>
                    <span className="text-xs text-slate-400">
                      Data: <strong className="text-slate-200">{selectedConv.ticketDate || '2026-10-07'}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">
                      Técnico: <strong className="text-slate-200">{selectedConv.assignedTechnicianName || '—'}</strong>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 truncate">
                    {selectedConv.title || `Suporte em ${selectedConv.verticalName} - ${selectedConv.clientName}`}
                  </h3>
                </div>

                {/* Export Buttons: Baixar em Modelo PDF & Baixar em Imagem */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                    title="Baixar a conversa formatada em PDF oficial"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Baixar em PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadImage}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-950/40 cursor-pointer"
                    title="Baixar a conversa em modelo de imagem PNG"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Baixar em Imagem</span>
                  </button>
                </div>
              </div>

              {/* Summary Highlight Card */}
              {selectedConv.ticketSummary && (
                <div className="mx-4 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 shrink-0">
                  <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Resumo Catalogado do Suporte:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedConv.ticketSummary}
                  </p>
                </div>
              )}

              {/* Chat Transcript Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 select-text">
                <div className="text-center text-[11px] text-slate-500 py-2 border-b border-slate-800/60 mb-2">
                  Início do registro de atendimento sob protocolo <strong className="text-slate-400">{selectedConv.protocol}</strong>
                </div>

                {selectedConv.messages.map((m) => {
                  const isClient = m.senderType === 'client';
                  const isSystem = m.senderType === 'system';

                  if (isSystem) {
                    return (
                      <div key={m.id} className="text-center text-[10px] text-slate-400 py-1">
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
                        <span className="text-[10px] text-slate-400 px-1 mb-0.5">
                          {m.senderName} (Cliente)
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
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
                        <div className={`flex items-center justify-end gap-1.5 text-[9px] mt-1 font-mono ${isClient ? 'opacity-75' : 'text-black/75 font-medium'}`}>
                          <span>{m.createdAt}</span>
                          {!isClient && <CheckCheck className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Rating if available */}
                {selectedConv.satisfactionRating && (
                  <div className="text-center py-4 bg-slate-900/50 rounded-xl border border-slate-800/80 my-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      Avaliação do Cliente: {selectedConv.satisfactionRating} de 5 Estrelas
                    </div>
                    {selectedConv.satisfactionComment && (
                      <p className="text-[11px] text-slate-300 mt-1 italic">
                        "{selectedConv.satisfactionComment}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Selecione um chamado na lista para visualizar o histórico completo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
