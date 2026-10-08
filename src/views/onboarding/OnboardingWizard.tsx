import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Building2,
  UserCheck,
  Layers,
  Network,
  Users,
  Smartphone,
  GitBranch,
  MessageSquare,
  Clock,
  ShieldAlert,
  Sparkles,
  Code2,
  Bell,
  CheckCircle2,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const {
    onboarding,
    updateOnboarding,
    runOnboardingTest,
    activateOrganization,
    verticals,
    setVerticals,
    teams,
    setTeams,
    users,
    setUsers,
    clients,
    setClients,
    whatsAppNumbers,
    setWhatsAppNumbers,
    navigate,
  } = useHelpdesk();

  const [stepIndex, setStepIndex] = useState(onboarding.currentStepIndex || 0);

  const steps = [
    { id: 'step_01', name: 'Dados da Organização', required: true, icon: Building2 },
    { id: 'step_02', name: 'Administrador Principal', required: true, icon: UserCheck },
    { id: 'step_03', name: 'Configuração das Verticais', required: true, icon: Layers },
    { id: 'step_04', name: 'Montar Equipes', required: true, icon: Network },
    { id: 'step_05', name: 'Cadastrar Técnicos', required: true, icon: Users },
    { id: 'step_06', name: 'Cadastrar Clientes', required: false, icon: Building2 },
    { id: 'step_07', name: 'Conectar WhatsApp', required: true, icon: Smartphone },
    { id: 'step_08', name: 'Fluxo de Atendimento', required: true, icon: GitBranch },
    { id: 'step_09', name: 'Mensagens e Comandos', required: true, icon: MessageSquare },
    { id: 'step_10', name: 'Horários de Atendimento', required: true, icon: Clock },
    { id: 'step_11', name: 'Configuração de SLA', required: true, icon: ShieldAlert },
    { id: 'step_12', name: 'Configurar Agente IA', required: false, icon: Sparkles },
    { id: 'step_13', name: 'Canal de Desenvolvimento', required: false, icon: Code2 },
    { id: 'step_14', name: 'Notificações', required: true, icon: Bell },
    { id: 'step_15', name: 'Teste do Ambiente', required: true, icon: CheckCircle2 },
    { id: 'step_16', name: 'Ativação da Organização', required: true, icon: Rocket },
  ];

  const currentStep = steps[stepIndex];
  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      updateOnboarding((prev) => ({
        ...prev,
        currentStepIndex: nextIndex,
        completedSteps: Array.from(new Set([...prev.completedSteps, steps[stepIndex].id])),
        state: nextIndex >= 14 ? 'ready_for_testing' : 'setup_in_progress',
      }));
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Wizard Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Onboarding de Implantação</div>
            <div className="text-xs text-slate-400">
              Etapa {stepIndex + 1} de {steps.length}: <span className="text-emerald-400 font-semibold">{currentStep.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-300">{progressPercent}% Concluído</div>
            <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/gestao/dashboard')}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            Salvar e Sair
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Steps Navigation */}
        <aside className="w-72 bg-slate-900/60 border-r border-slate-800/80 overflow-y-auto p-4 hidden md:block">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Roteiro de Configuração
          </div>
          <div className="space-y-1">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = idx === stepIndex;
              const isDone = onboarding.completedSteps.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => setStepIndex(idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                    isCurrent
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : isDone
                      ? 'text-slate-300 hover:bg-slate-800/40'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className="truncate flex-1">{s.name}</span>
                  {!s.required && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400">
                      Opcional
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Step Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            {/* Step Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <currentStep.icon className="w-4 h-4" />
                <span>Passo {stepIndex + 1} de {steps.length}</span>
                {currentStep.required ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-300">
                    Obrigatório
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Opcional
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{currentStep.name}</h2>
            </div>

            {/* Step Dynamic Content */}
            <div className="py-2">
              {stepIndex === 0 && <Step01OrgProfile />}
              {stepIndex === 1 && <Step02Admin />}
              {stepIndex === 2 && <Step03Verticals />}
              {stepIndex === 3 && <Step04Teams />}
              {stepIndex === 4 && <Step05TechUsers />}
              {stepIndex === 5 && <Step06Clients />}
              {stepIndex === 6 && <Step07WhatsApp />}
              {stepIndex === 7 && <Step08Workflow />}
              {stepIndex === 8 && <Step09Messages />}
              {stepIndex === 9 && <Step10Hours />}
              {stepIndex === 10 && <Step11SLA />}
              {stepIndex === 11 && <Step12AI />}
              {stepIndex === 12 && <Step13Dev />}
              {stepIndex === 13 && <Step14Notifications />}
              {stepIndex === 14 && <Step15TestEnv />}
              {stepIndex === 15 && <Step16Activation onActivate={activateOrganization} />}
            </div>
          </div>

          {/* Wizard Footer Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <div className="flex items-center gap-3">
              {!currentStep.required && stepIndex < steps.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Pular etapa opcional
                </button>
              )}

              {stepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                >
                  Salvar e Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={activateOrganization}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-xl shadow-indigo-950/50 transition cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  Ativar Organização em Produção
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Subcomponent: Step 01 - Organization Profile
const Step01OrgProfile: React.FC = () => {
  const { onboarding, updateOnboarding } = useHelpdesk();
  const profile = onboarding.organizationProfile;

  const handleChange = (field: string, val: string) => {
    updateOnboarding((prev) => ({
      ...prev,
      organizationProfile: {
        ...prev.organizationProfile,
        [field]: val,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400 leading-relaxed">
        Cadastre os dados cadastrais da empresa ou entidade responsável pela gestão do Helpdesk.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Nome da Empresa / Razão Social <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={profile.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Nome Fantasia</label>
          <input
            type="text"
            value={profile.tradeName}
            onChange={(e) => handleChange('tradeName', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">CNPJ</label>
          <input
            type="text"
            value={profile.document}
            onChange={(e) => handleChange('document', e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            E-mail Principal <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Telefone de Contato</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">País</label>
          <input
            type="text"
            value={profile.country}
            disabled
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Fuso Horário</label>
          <select
            value={profile.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          >
            <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
            <option value="America/Manaus">America/Manaus (GMT-4)</option>
            <option value="America/Cuiaba">America/Cuiaba (GMT-4)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Idioma</label>
          <select
            value={profile.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Step 02 - Administrator
const Step02Admin: React.FC = () => {
  const { onboarding, updateOnboarding } = useHelpdesk();
  const admin = onboarding.administrator;

  const handleChange = (field: string, val: any) => {
    updateOnboarding((prev) => ({
      ...prev,
      administrator: {
        ...prev.administrator,
        [field]: val,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Defina as credenciais do Administrador Principal (Super Admin) que terá gestão plena de usuários e configurações.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Nome Completo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={admin.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            E-mail Institucional <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Nome de Usuário (Login)</label>
          <input
            type="text"
            value={admin.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Telefone / WhatsApp</label>
          <input
            type="text"
            value={admin.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
        <div className="text-xs font-semibold text-slate-300">Diretrizes de Segurança:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={admin.passwordPolicy}
              onChange={(e) => handleChange('passwordPolicy', e.target.checked)}
              className="rounded bg-slate-800 text-emerald-500"
            />
            Política de Senha Forte
          </label>
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={admin.emailVerification}
              onChange={(e) => handleChange('emailVerification', e.target.checked)}
              className="rounded bg-slate-800 text-emerald-500"
            />
            Verificação por E-mail
          </label>
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={admin.twoFactorOptional}
              onChange={(e) => handleChange('twoFactorOptional', e.target.checked)}
              className="rounded bg-slate-800 text-emerald-500"
            />
            2FA Opcional para Técnicos
          </label>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Step 03 - Verticals
const Step03Verticals: React.FC = () => {
  const { verticals, setVerticals } = useHelpdesk();
  const [newVerticalName, setNewVerticalName] = useState('');

  const toggleActive = (id: string) => {
    setVerticals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
  };

  const handleAddVertical = () => {
    if (!newVerticalName.trim()) return;
    const newV = {
      id: 'vert-' + Date.now(),
      name: newVerticalName.trim(),
      code: newVerticalName.trim().toUpperCase().replace(/\s+/g, '_'),
      description: 'Vertical customizada de atendimento',
      color: '#8B5CF6',
      icon: 'Layers',
      active: true,
      customerAccess: true,
      technicalAccess: true,
    };
    setVerticals((prev) => [...prev, newV]);
    setNewVerticalName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Selecione as verticais ativas da organização. A vertical Desenvolvimento é restrita para comunicação técnica interna.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {verticals.map((vert) => (
          <div
            key={vert.id}
            className={`p-3 rounded-xl border flex items-center justify-between transition ${
              vert.active
                ? 'bg-slate-900 border-slate-700'
                : 'bg-slate-900/30 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: vert.color }}
              />
              <div>
                <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  {vert.name}
                  {vert.isDevelopment && (
                    <span className="text-[9px] px-1 rounded bg-red-900/40 text-red-300 border border-red-800">
                      Interno
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{vert.code}</div>
              </div>
            </div>

            <button
              onClick={() => toggleActive(vert.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                vert.active
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {vert.active ? 'Ativa' : 'Inativa'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Vertical */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newVerticalName}
          onChange={(e) => setNewVerticalName(e.target.value)}
          placeholder="Criar nova vertical (ex: Jurídico, Suprimentos)..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
        />
        <button
          onClick={handleAddVertical}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </button>
      </div>
    </div>
  );
};

// Subcomponent: Step 04 - Teams
const Step04Teams: React.FC = () => {
  const { teams, verticals } = useHelpdesk();
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Equipes sugeridas vinculadas às verticais operacionais. Cada vertical ativa possui sua equipe dedicada.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teams.map((t) => {
          const vert = verticals.find((v) => v.id === t.verticalId);
          return (
            <div key={t.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-100">{t.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1.5">
                  <span className="text-emerald-400">Vertical: {vert?.name || 'Geral'}</span>
                  <span>•</span>
                  <span>Horário: {t.businessHours}</span>
                  <span>•</span>
                  <span>SLA: {t.sla}</span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Subcomponent: Step 05 - Tech Users
const Step05TechUsers: React.FC = () => {
  const { users } = useHelpdesk();
  const techUsers = users.filter((u) => u.role === 'technical_user');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Técnicos cadastrados para atendimento. Você pode importar em lote (CSV/XLSX) ou convidar por e-mail.
        </p>
        <span className="text-xs text-emerald-400 font-semibold">{techUsers.length} técnicos ativos</span>
      </div>

      <div className="space-y-2">
        {techUsers.map((u) => (
          <div key={u.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              <div>
                <div className="text-xs font-semibold text-slate-100">{u.name}</div>
                <div className="text-[10px] text-slate-400">{u.email} • Login: {u.username}</div>
              </div>
            </div>
            <div className="text-[10px] text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 px-2 py-1 rounded">
              {u.cargo || 'Técnico Especialista'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Step 06 - Clients
const Step06Clients: React.FC = () => {
  const { clients } = useHelpdesk();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Entidades conveniadas (Prefeituras, Câmaras e Autarquias). Esta etapa é opcional e pode ser pulada.
        </p>
        <span className="text-xs text-emerald-400 font-semibold">{clients.length} entidades cadastradas</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {clients.map((c) => (
          <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-100">{c.companyName}</div>
              <div className="text-[10px] text-slate-400">
                CNPJ: {c.document} • {c.city}/{c.state} • WhatsApp: {c.whatsapp}
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              {c.verticalIds.length} verticais
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Step 07 - WhatsApp
const Step07WhatsApp: React.FC = () => {
  const { whatsAppNumbers } = useHelpdesk();
  const [testSent, setTestSent] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Conecte os números de WhatsApp que receberão as mensagens dos clientes. Limite inicial de até 6 números.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {whatsAppNumbers.map((wa) => (
          <div key={wa.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-100">{wa.name}</div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  wa.status === 'Conectado'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : wa.status === 'Conectando'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {wa.status}
              </span>
            </div>
            <div className="text-xs font-mono text-emerald-400">{wa.phoneNumber}</div>
            <div className="text-[10px] text-slate-400 truncate">Provedor: {wa.provider}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="text-xs text-slate-300">
          Validação de Webhook e Conexão de Teste:
        </div>
        <button
          onClick={() => setTestSent(true)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          {testSent ? 'Mensagem Testada com Sucesso!' : 'Enviar Mensagem de Teste'}
        </button>
      </div>
    </div>
  );
};

// Subcomponent: Step 08 - Workflow
const Step08Workflow: React.FC = () => {
  const { workflow } = useHelpdesk();
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Fluxo interativo de triagem: ao receber mensagem, identifica o cliente, apresenta o menu de verticais e encaminha com SLA.
      </p>
      <div className="space-y-2">
        {workflow.nodes.map((node, i) => (
          <div key={node.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>{node.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {node.type}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">{node.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Step 09 - Messages
const Step09Messages: React.FC = () => {
  const { quickMessages, slashCommands } = useHelpdesk();
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Modelos padrão de mensagens prontas e comandos rápidos (trigger /) para agilizar o atendimento dos técnicos.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Mensagens Automáticas:</div>
          {quickMessages.slice(0, 4).map((qm) => (
            <div key={qm.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-xs font-medium text-slate-200">{qm.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{qm.content}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">Comandos Rápidos (/):</div>
          {slashCommands.slice(0, 4).map((cmd) => (
            <div key={cmd.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">{cmd.trigger}</span>
                <div className="text-[10px] text-slate-400">{cmd.description}</div>
              </div>
              <span className="text-[10px] text-slate-500">{cmd.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Step 10 - Business Hours
const Step10Hours: React.FC = () => {
  const { onboarding } = useHelpdesk();
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Defina os horários em que as equipes estarão em expediente ativo para resposta imediata.
      </p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
        {onboarding.businessHours.days.map((d) => (
          <div key={d.day} className="p-2.5 flex items-center justify-between">
            <span className="font-medium text-slate-200">{d.day}</span>
            <div className="flex items-center gap-3 text-slate-400">
              <span>{d.enabled ? `${d.start} às ${d.end}` : 'Fechado'}</span>
              <span className="text-[10px] text-slate-500">Intervalo: {d.lunchBreak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Step 11 - SLA
const Step11SLA: React.FC = () => {
  const { onboarding } = useHelpdesk();
  const sla = onboarding.slaConfig;
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Metas máximas de tempo para Primeira Resposta e Resolução final por prioridade do chamado.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
          <div className="text-xs font-bold text-red-400">Urgente</div>
          <div className="text-xs text-slate-300 mt-1">1ª Resposta: {sla.urgent.firstResponse}</div>
          <div className="text-[11px] text-slate-400">Resolução: {sla.urgent.resolution}</div>
        </div>
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl">
          <div className="text-xs font-bold text-amber-400">Alta</div>
          <div className="text-xs text-slate-300 mt-1">1ª Resposta: {sla.high.firstResponse}</div>
          <div className="text-[11px] text-slate-400">Resolução: {sla.high.resolution}</div>
        </div>
        <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl">
          <div className="text-xs font-bold text-blue-400">Normal</div>
          <div className="text-xs text-slate-300 mt-1">1ª Resposta: {sla.normal.firstResponse}</div>
          <div className="text-[11px] text-slate-400">Resolução: {sla.normal.resolution}</div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs font-bold text-slate-400">Baixa</div>
          <div className="text-xs text-slate-300 mt-1">1ª Resposta: {sla.low.firstResponse}</div>
          <div className="text-[11px] text-slate-400">Resolução: {sla.low.resolution}</div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Step 12 - AI Agent
const Step12AI: React.FC = () => {
  const { onboarding, updateOnboarding } = useHelpdesk();
  const ai = onboarding.aiConfig;
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Configuração do Assistente de Inteligência Artificial integrado (Gemini 3.8 Flash). Recomenda-se aprovação humana antes do envio ao cliente.
      </p>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Provedor de IA</label>
            <input type="text" value={ai.provider} disabled className="w-full bg-slate-800 rounded p-2 text-xs text-slate-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Modelo Selecionado</label>
            <input type="text" value={ai.model} disabled className="w-full bg-slate-800 rounded p-2 text-xs text-emerald-400 font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">System Prompt</label>
          <textarea
            value={ai.systemPrompt}
            onChange={(e) =>
              updateOnboarding((prev) => ({
                ...prev,
                aiConfig: { ...prev.aiConfig, systemPrompt: e.target.value },
              }))
            }
            rows={3}
            className="w-full bg-slate-800 rounded p-2 text-xs text-white"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={ai.requireHumanApproval}
            onChange={(e) =>
              updateOnboarding((prev) => ({
                ...prev,
                aiConfig: { ...prev.aiConfig, requireHumanApproval: e.target.checked },
              }))
            }
            className="rounded bg-slate-800 text-emerald-500"
          />
          Exigir revisão do técnico antes de enviar a resposta gerada pela IA
        </label>
      </div>
    </div>
  );
};

// Subcomponent: Step 13 - Development
const Step13Dev: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Configurações do canal interno de Desenvolvimento de Software para comunicação entre suporte técnico e engenharia de software.
      </p>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          Canal Interno Ativo com Segurança de Dados
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          • Mensagens trocadas no canal de Desenvolvimento não são visíveis para os clientes externos.<br />
          • Suporte a threads técnicas, anexos de logs e envio de evidências em imagem.<br />
          • Vinculação direta ao protocolo do chamado original para rastreabilidade.
        </p>
      </div>
    </div>
  );
};

// Subcomponent: Step 14 - Notifications
const Step14Notifications: React.FC = () => {
  const { playNotificationSound } = useHelpdesk();
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Configure alertas sonoros e notificações de área de trabalho para chamados em fila.
      </p>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200">Alerta Sonoro (Web Audio API)</div>
            <div className="text-[11px] text-slate-400">Emite sinal sonoro suave quando um cliente envia mensagem.</div>
          </div>
          <button
            onClick={playNotificationSound}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            Testar Som
          </button>
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Step 15 - Test Environment
const Step15TestEnv: React.FC = () => {
  const { onboarding, runOnboardingTest } = useHelpdesk();
  const [runningAll, setRunningAll] = useState(false);

  const testList = [
    'Login',
    'Permissões',
    'Vertical',
    'Equipe',
    'Técnico',
    'WhatsApp',
    'Recebimento de mensagem',
    'Roteamento',
    'Notificação',
    'Atendimento',
    'Finalização',
    'Pesquisa de satisfação',
    'Agente IA',
  ];

  const handleRunAll = async () => {
    setRunningAll(true);
    for (const t of testList) {
      await runOnboardingTest(t);
    }
    setRunningAll(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Validação automatizada de todos os componentes antes da ativação oficial em produção.
        </p>
        <button
          onClick={handleRunAll}
          disabled={runningAll}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white rounded-lg transition flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5" />
          {runningAll ? 'Executando Testes...' : 'Executar Todos os Testes'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {testList.map((tName) => {
          const res = onboarding.testResults[tName] || 'not_configured';
          return (
            <div
              key={tName}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <span className="text-xs font-medium text-slate-200">{tName}</span>
              {res === 'passed' ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Aprovado
                </span>
              ) : (
                <button
                  onClick={() => runOnboardingTest(tName)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Testar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Subcomponent: Step 16 - Activation
const Step16Activation: React.FC<{ onActivate: () => void }> = ({ onActivate }) => {
  const { onboarding } = useHelpdesk();

  const checklist = [
    'Dados da organização configurados',
    'Administrador configurado',
    'Pelo menos uma vertical ativa',
    'Equipes configuradas',
    'Técnicos cadastrados',
    'Horário configurado',
    'SLA configurado',
    'Fluxo configurado',
    'Canal de atendimento WhatsApp configurado',
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Rocket className="w-4 h-4" />
          A Organização Está Pronta para Operar!
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Todos os requisitos essenciais foram checados e validados. Ao ativar, os canais de atendimento serão liberados e o Helpdesk entrará em modo de produção.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-300 mb-2">Checklist de Conformidade:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
