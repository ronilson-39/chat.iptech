import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  User,
} from 'lucide-react';

export const AuditView: React.FC = () => {
  const { auditLogs } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Trilhas de Auditoria & Conformidade LGPD
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro cronológico imutável de todas as ações sensíveis realizadas na plataforma.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar evento, usuário ou IP..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Ação Registrada</th>
                <th className="py-3 px-4">Entidade / Objeto</th>
                <th className="py-3 px-4">Endereço IP</th>
                <th className="py-3 px-4">Detalhes do Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.date} {log.time}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-500">{log.userRole}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-medium text-indigo-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{log.targetEntity}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{log.ip}</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-md truncate leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
