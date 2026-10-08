import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Star,
  TrendingUp,
  MessageSquare,
  BarChart2,
  Calendar,
  Filter,
  ArrowUpRight,
  Headphones,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { clients, users, conversations, whatsAppNumbers, navigate, verticals } = useHelpdesk();
  const [period, setPeriod] = useState<'hoje' | '7d' | '30d'>('hoje');

  // Computed metrics
  const activeClientsCount = clients.filter((c) => c.active).length;
  const techUsers = users.filter((u) => u.role === 'technical_user');
  const onlineTechs = techUsers.filter((u) => u.status === 'online');

  const pendingTickets = conversations.filter((c) => c.status === 'Pendente');
  const inProgressTickets = conversations.filter((c) => c.status === 'Em atendimento');
  const closedTickets = conversations.filter((c) => c.status === 'Encerrado');
  const allTickets = conversations.length;

  const connectedWhatsApp = whatsAppNumbers.filter((w) => w.status === 'Conectado').length;

  const totalMessagesSent = whatsAppNumbers.reduce((acc, curr) => acc + curr.messagesSent, 0) + 420;
  const totalMessagesRecv = whatsAppNumbers.reduce((acc, curr) => acc + curr.messagesReceived, 0) + 380;

  // Rating average
  const rated = conversations.filter((c) => c.satisfactionRating);
  const avgRating = rated.length
    ? (rated.reduce((acc, c) => acc + (c.satisfactionRating || 5), 0) / rated.length).toFixed(1)
    : '4.9';

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Painel Executivo & Métricas</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visão consolidada em tempo real de atendimentos, técnicos, SLA e WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => setPeriod('hoje')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                period === 'hoje' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                period === '7d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                period === '30d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Últimos 30 dias
            </button>
          </div>

          <button
            onClick={() => navigate('/helpdesk/inbox')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Ver Fila ao Vivo</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fila Pendente</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingTickets.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Aguardando atendimento</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Em Atendimento</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{inProgressTickets.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Com técnicos ativos</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Encerrados</span>
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{closedTickets.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Concluídos com sucesso</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Técnicos Online</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {onlineTechs.length} <span className="text-xs text-slate-500 font-normal">/ {techUsers.length}</span>
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-1">Disponíveis agora</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>WhatsApp Ativos</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {connectedWhatsApp} <span className="text-xs text-slate-500 font-normal">/ {whatsAppNumbers.length}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Canais conectados</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Avaliação CSAT</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{avgRating} <span className="text-xs text-slate-500">/ 5.0</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Satisfação geral</div>
        </div>
      </div>

      {/* Secondary Metrics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Atendimentos por Vertical */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Distribuição por Verticais</h2>
              <p className="text-[11px] text-slate-400">Volume de solicitações segmentado por área de negócio</p>
            </div>
            <button
              onClick={() => navigate('/gestao/verticais')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {verticals.slice(0, 6).map((v) => {
              const count = conversations.filter((c) => c.verticalId === v.id).length;
              const percentage = allTickets ? Math.round((count / allTickets) * 100) : 10;
              return (
                <div key={v.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                      <span className="font-medium text-slate-200">{v.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{count} chamados ({percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: v.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA & WhatsApp Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Cumprimento de SLA</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold">
                98.4% no prazo
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Tempo Médio de 1ª Resposta</div>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">3 min e 45s</div>
                <div className="text-[10px] text-slate-500">Meta: 15 min (Urgente) / 1h (Normal)</div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Tempo Médio de Resolução</div>
                <div className="text-xl font-bold text-indigo-400 mt-0.5">1h e 22 min</div>
                <div className="text-[10px] text-slate-500">Meta: 4h no padrão municipal</div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Tráfego de Mensagens Hoje</div>
                <div className="text-xs text-slate-300 mt-1 flex items-center justify-between">
                  <span>Recebidas: <strong className="text-emerald-400">{totalMessagesRecv}</strong></span>
                  <span>Enviadas: <strong className="text-indigo-400">{totalMessagesSent}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] text-slate-400 text-center">
            Próximo ciclo de auditoria de SLA: Hoje às 19:30
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Últimos Atendimentos Registrados</h2>
            <p className="text-[11px] text-slate-400">Chamados em processamento ou finalizados recentemente</p>
          </div>
          <button
            onClick={() => navigate('/helpdesk/inbox')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            Abrir Central Completa →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Protocolo</th>
                <th className="py-2.5 px-4">Cliente / Entidade</th>
                <th className="py-2.5 px-4">Vertical</th>
                <th className="py-2.5 px-4">Técnico</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">SLA</th>
                <th className="py-2.5 px-4">Última Interação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {conversations.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-emerald-400 font-medium">{c.protocol}</td>
                  <td className="py-3 px-4 font-medium text-slate-100">{c.clientName}</td>
                  <td className="py-3 px-4">{c.verticalName}</td>
                  <td className="py-3 px-4 text-slate-400">{c.assignedTechnicianName || '— Fila Geral —'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'Pendente'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : c.status === 'Em atendimento'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        c.slaStatus === 'Dentro do SLA'
                          ? 'text-emerald-400 bg-emerald-950/40'
                          : 'text-amber-400 bg-amber-950/40'
                      }`}
                    >
                      {c.slaStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{c.lastMessageAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
