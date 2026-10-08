import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Database,
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const BackupView: React.FC = () => {
  const { clients, users, conversations, verticals, addAuditLog, playNotificationSound } = useHelpdesk();
  const [importStep, setImportStep] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<'JSON' | 'CSV' | 'XLSX'>('JSON');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadBackup = (type: 'all' | 'clients' | 'tickets') => {
    setIsExporting(true);
    setTimeout(() => {
      let dataToExport: any = {};
      let filename = `helpdesk_backup_${new Date().toISOString().split('T')[0]}`;

      if (type === 'all') {
        dataToExport = { clients, users, conversations, verticals };
        filename += '_completo.json';
      } else if (type === 'clients') {
        dataToExport = clients;
        filename += '_clientes.json';
      } else {
        dataToExport = conversations;
        filename += '_chamados.json';
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      addAuditLog('Exportação de Backup', `Tipo: ${type}`, `Arquivo ${filename} baixado com sucesso.`);
    }, 600);
  };

  const handleSimulateImport = () => {
    setImportStep(1);
    setTimeout(() => setImportStep(2), 700);
    setTimeout(() => setImportStep(3), 1400);
    setTimeout(() => {
      setImportStep(4);
      playNotificationSound();
      addAuditLog('Importação de Dados', 'Mapeamento Helpdesk', 'Importação concluída com validação.');
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Backup, Exportação e Importação de Dados
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Exporte registros de auditoria ou importe backups legados de outros sistemas de Helpdesk (CSV/JSON/XLSX).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Download className="w-4 h-4 text-emerald-400" />
            Exportar Dados da Organização
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Gere cópias de segurança instantâneas em formato JSON, CSV ou planilhas prontas para auditoria e prestação de contas.
          </p>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Backup Geral Completo</div>
                <div className="text-[11px] text-slate-400">
                  {clients.length} clientes, {users.length} usuários, {conversations.length} chamados
                </div>
              </div>
              <button
                onClick={() => handleDownloadBackup('all')}
                disabled={isExporting}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar JSON
              </button>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Base de Clientes & Contratos</div>
                <div className="text-[11px] text-slate-400">Dados cadastrais, CNPJs e contatos vinculados</div>
              </div>
              <button
                onClick={() => handleDownloadBackup('clients')}
                disabled={isExporting}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Exportar Clientes
              </button>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Histórico de Atendimentos & SLA</div>
                <div className="text-[11px] text-slate-400">Mensagens, protocolos, avaliações e tempos de atendimento</div>
              </div>
              <button
                onClick={() => handleDownloadBackup('tickets')}
                disabled={isExporting}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-indigo-400" />
                Exportar Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Import Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Upload className="w-4 h-4 text-indigo-400" />
            Assistente de Importação & Migração
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Importe planilhas de clientes e chamados de outros sistemas de Helpdesk com validação antecipada de duplicidades.
          </p>

          {importStep === 0 && (
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center space-y-3 bg-slate-950/30">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300 font-medium">
                Arraste seu arquivo (.csv, .xlsx ou .json) ou clique para simular importação
              </div>
              <button
                onClick={handleSimulateImport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition shadow-lg shadow-indigo-950/40 cursor-pointer"
              >
                Simular Importação com Validação
              </button>
            </div>
          )}

          {importStep > 0 && importStep < 4 && (
            <div className="p-8 text-center space-y-3 bg-slate-950/40 rounded-xl">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-white">
                {importStep === 1 && 'Etapa 1/4: Identificando estrutura das colunas...'}
                {importStep === 2 && 'Etapa 2/4: Mapeando campos para o esquema Helpdesk...'}
                {importStep === 3 && 'Etapa 3/4: Validando CNPJs e registros duplicados...'}
              </div>
            </div>
          )}

          {importStep === 4 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Relatório de Pré-Validação da Importação Concluído
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400">Registros Válidos:</span>
                  <div className="text-sm font-bold text-emerald-400">42 registros</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400">Duplicidades Ignoradas:</span>
                  <div className="text-sm font-bold text-amber-400">2 CNPJs existentes</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400">Campos Inválidos:</span>
                  <div className="text-sm font-bold text-slate-300">0 erros</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400">Status Geral:</span>
                  <div className="text-sm font-bold text-emerald-400">100% Homologado</div>
                </div>
              </div>

              <button
                onClick={() => setImportStep(0)}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition cursor-pointer"
              >
                Concluir e Resetar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
