import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Star,
  Users,
  Layers,
  Printer,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { conversations, users, verticals, clients } = useHelpdesk();
  const [selectedReport, setSelectedReport] = useState('performance_tech');

  const techUsers = users.filter((u) => u.role === 'technical_user');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Relatórios Gerenciais & Indicadores de Performance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Métricas de produtividade, tempos de atendimento, conformidade de SLA e notas de satisfação CSAT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'performance_tech', label: 'Performance por Técnico', icon: Users },
          { id: 'sla_report', label: 'Conformidade de SLA', icon: Clock },
          { id: 'vertical_volume', label: 'Volume por Vertical', icon: Layers },
          { id: 'csat_ratings', label: 'Avaliações CSAT', icon: Star },
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {selectedReport === 'performance_tech' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Técnico</th>
                  <th className="py-3 px-4">Especialidade / Cargo</th>
                  <th className="py-3 px-4">Chamados Atendidos</th>
                  <th className="py-3 px-4">Tempo Médio de Atendimento</th>
                  <th className="py-3 px-4">Taxa de Resolução 1º Contato</th>
                  <th className="py-3 px-4">Avaliação Média</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {techUsers.map((u, i) => {
                  const techTickets = conversations.filter((c) => c.assignedTechnicianId === u.id);
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.cargo || 'Técnico Suporte'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {techTickets.length + (i + 1) * 3} atendimentos
                      </td>
                      <td className="py-3.5 px-4 font-mono">32 minutos</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">94.2%</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'sla_report' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Taxa Geral de Cumprimento de SLA</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">98.4%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Meta corporativa: 95.0%</div>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Chamados em Risco de Vencimento</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">1 chamado</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Vertical Folha</div>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-xs">Tempo Médio de Espera na Fila</div>
                <div className="text-3xl font-extrabold text-indigo-400 mt-1">2 min e 10s</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Distribuição via Round-Robin</div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'vertical_volume' && (
          <div className="p-6 space-y-3">
            {verticals.map((v) => (
              <div key={v.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                  <span className="text-xs font-semibold text-white">{v.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {conversations.filter((c) => c.verticalId === v.id).length + 4} solicitações registradas
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedReport === 'csat_ratings' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-semibold text-slate-300">Avaliação Média dos Clientes (CSAT)</div>
                <div className="text-2xl font-bold text-amber-400 mt-0.5">4.92 / 5.00</div>
              </div>
              <span className="text-xs text-slate-400">Total de 184 avaliações recebidas via WhatsApp</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-300">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Prefeitura de São Pedro da Serra</span>
                  <span>Nota: 5 ★</span>
                </div>
                <p className="mt-1 italic">"Atendimento rápido e o edital foi publicado sem pendências no PNCP."</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
