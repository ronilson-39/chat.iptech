import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Settings,
  Building,
  Bell,
  Shield,
  Smartphone,
  Save,
  CheckCircle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { onboarding, updateOnboarding, playNotificationSound, addAuditLog } = useHelpdesk();
  const [activeTab, setActiveTab] = useState<'general' | 'attendance' | 'notifications' | 'security'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const org = onboarding.organizationProfile;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    addAuditLog('Alteração de Configuração', 'Configurações Gerais', 'Parâmetros atualizados.');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Configurações da Organização
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Preferências gerais, parâmetros de atendimento, políticas de segurança e notificações.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            Configurações salvas com sucesso!
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'general' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          Geral & Identidade
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'attendance' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          Regras de Atendimento
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'notifications' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          Notificações
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'security' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-red-400" />
          Segurança & Sessões
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl text-xs">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Razão Social / Nome da Entidade</label>
              <input
                type="text"
                value={org.companyName}
                onChange={(e) =>
                  updateOnboarding((prev) => ({
                    ...prev,
                    organizationProfile: { ...prev.organizationProfile, companyName: e.target.value },
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Fantasia da Plataforma</label>
              <input
                type="text"
                value={org.tradeName}
                onChange={(e) =>
                  updateOnboarding((prev) => ({
                    ...prev,
                    organizationProfile: { ...prev.organizationProfile, tradeName: e.target.value },
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Fuso Horário</label>
                <input
                  type="text"
                  disabled
                  value={org.timezone}
                  className="w-full bg-slate-800/80 rounded-lg p-2 text-slate-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Idioma Oficial</label>
                <input
                  type="text"
                  disabled
                  value={org.language}
                  className="w-full bg-slate-800/80 rounded-lg p-2 text-slate-400"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tempo Limite de Espera na Fila (Minutos)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 text-emerald-500" />
              <span>Enviar pesquisa de satisfação automática após encerramento do chamado</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 text-emerald-500" />
              <span>Permitir que o cliente reabra o chamado respondendo à mensagem de finalização</span>
            </label>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div>
                <div className="font-semibold text-white">Sinal Sonoro de Novas Mensagens</div>
                <div className="text-[11px] text-slate-400">Toca áudio D5-A5 sutil para novos clientes na fila.</div>
              </div>
              <button
                type="button"
                onClick={playNotificationSound}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition"
              >
                Testar Áudio
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 text-emerald-500" />
              <span>Exigir complexidade mínima de senha (8 caracteres, letras, números e símbolos)</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 text-emerald-500" />
              <span>Desconectar sessão inativa após 60 minutos</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 text-emerald-500" />
              <span>Armazenar registros de auditoria em conformidade com o marco civil e LGPD</span>
            </label>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white shadow-lg shadow-indigo-950/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Parâmetros</span>
          </button>
        </div>
      </form>
    </div>
  );
};
