import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { WhatsAppNumber, WhatsAppStatus } from '../../types';
import {
  Smartphone,
  Plus,
  RefreshCw,
  QrCode,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const WhatsAppView: React.FC = () => {
  const { whatsAppNumbers, setWhatsAppNumbers, verticals, addAuditLog, playNotificationSound } = useHelpdesk();
  const [selectedNumber, setSelectedNumber] = useState<WhatsAppNumber | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testMessage, setTestMessage] = useState('Mensagem de teste do canal WhatsApp');
  const [testSuccess, setTestSuccess] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newNumberData, setNewNumberData] = useState({
    name: '',
    phoneNumber: '',
    provider: 'Cloud API Oficial (Meta / Graph v20.0)',
    verticalId: 'vert-folha',
  });

  const handleTestConnection = (wa: WhatsAppNumber) => {
    setSelectedNumber(wa);
    setTestSuccess(false);
    setTestModalOpen(true);
  };

  const executeTestSend = () => {
    setTestSuccess(true);
    playNotificationSound();
    addAuditLog('Teste de WhatsApp', `Número ${selectedNumber?.phoneNumber}`, 'Mensagem de teste enviada e confirmada.');
  };

  const handleToggleConnect = (id: string) => {
    setWhatsAppNumbers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newStatus: WhatsAppStatus = w.status === 'Conectado' ? 'Desconectado' : 'Conectado';
          addAuditLog('Status WhatsApp', `Número ${w.phoneNumber}`, `Status alterado para ${newStatus}`);
          return {
            ...w,
            status: newStatus,
            lastSync: newStatus === 'Conectado' ? 'Agora mesmo' : w.lastSync,
          };
        }
        return w;
      })
    );
  };

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumberData.phoneNumber.trim() || whatsAppNumbers.length >= 6) return;

    const newNum: WhatsAppNumber = {
      id: 'wa-' + Date.now(),
      name: newNumberData.name || `Canal ${newNumberData.phoneNumber}`,
      phoneNumber: newNumberData.phoneNumber,
      provider: newNumberData.provider,
      status: 'Conectado',
      webhookUrl: `https://api.helpdesk.com.br/webhook/wa-${Date.now()}`,
      verticalId: newNumberData.verticalId,
      lastSync: 'Agora mesmo',
      messagesReceived: 0,
      messagesSent: 0,
    };

    setWhatsAppNumbers((prev) => [...prev, newNum]);
    addAuditLog('Novo WhatsApp', `Número ${newNum.phoneNumber}`, 'Canal adicionado.');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            Canais de Atendimento WhatsApp
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de até 6 números oficiais conectados via Cloud API da Meta ou Gateway Enterprise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {whatsAppNumbers.length} / 6 números utilizados
          </span>
          <button
            onClick={() => setAddModalOpen(true)}
            disabled={whatsAppNumbers.length >= 6}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Número</span>
          </button>
        </div>
      </div>

      {/* Grid of Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {whatsAppNumbers.map((wa) => {
          const vert = verticals.find((v) => v.id === wa.verticalId);
          const isConnected = wa.status === 'Conectado';

          return (
            <div
              key={wa.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                      isConnected
                        ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
                        : wa.status === 'Conectando'
                        ? 'bg-amber-950/80 border-amber-800/80 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    {wa.status}
                  </span>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {wa.lastSync || 'Sem sincronização'}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{wa.name}</div>
                <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">
                  {wa.phoneNumber}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Vertical Vinculada:</span>
                    <span className="text-slate-200 font-medium">{vert?.name || 'Geral'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Provedor:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{wa.provider}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Tráfego:</span>
                    <span className="text-slate-300 font-mono">
                      {wa.messagesReceived} rec / {wa.messagesSent} env
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedNumber(wa);
                    setQrModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                  QR Code
                </button>

                <button
                  onClick={() => handleTestConnection(wa)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Testar
                </button>

                <button
                  onClick={() => handleToggleConnect(wa.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isConnected
                      ? 'bg-red-950/40 text-red-300 hover:bg-red-900/50 border border-red-800/50'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <div className="font-semibold text-white mb-0.5">Segurança & Conformidade Oficial WhatsApp</div>
          Utilizamos exclusivamente conexões via Cloud API Oficial da Meta ou parceiros autorizados BSP.
          As credenciais de webhook e tokens são mantidos em cofre seguro com isolamento tenant e conformidade com a LGPD.
        </div>
      </div>

      {/* Modal Add Number */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Conectar Novo Número WhatsApp</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNumber} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome de Identificação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canal Arrecadação / Tributos"
                  value={newNumberData.name}
                  onChange={(e) => setNewNumberData({ ...newNumberData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Número de Telefone (com DDI/DDD) *</label>
                <input
                  type="text"
                  required
                  placeholder="+55 (11) 98888-7000"
                  value={newNumberData.phoneNumber}
                  onChange={(e) => setNewNumberData({ ...newNumberData, phoneNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vertical Vinculada</label>
                <select
                  value={newNumberData.verticalId}
                  onChange={(e) => setNewNumberData({ ...newNumberData, verticalId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white"
                >
                  Adicionar Canal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">QR Code de Conexão</span>
              <button onClick={() => setQrModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-6 flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <QrCode className="w-44 h-44 text-slate-900" />
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-3">{selectedNumber?.phoneNumber}</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Abra o WhatsApp no aparelho, vá em Dispositivos Conectados e aponte a câmera para sincronizar a sessão.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Test Send */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white">Teste de Conexão e Webhook</span>
              <button onClick={() => setTestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Canal de Origem:</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedNumber?.name} (${selectedNumber?.phoneNumber})`}
                  className="w-full bg-slate-800 rounded p-2 text-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Webhook Endpoint:</label>
                <input
                  type="text"
                  disabled
                  value={selectedNumber?.webhookUrl}
                  className="w-full bg-slate-800 rounded p-2 text-emerald-400 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mensagem de Teste:</label>
                <textarea
                  rows={2}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full bg-slate-800 rounded p-2 text-white"
                />
              </div>

              {testSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Mensagem enviada com sucesso! Resposta 200 OK do Webhook.</span>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setTestModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
              >
                Fechar
              </button>
              <button
                onClick={executeTestSend}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white"
              >
                Disparar Teste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
