import React from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Smartphone,
  GitBranch,
  MessageSquare,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const OnboardingDashboard: React.FC = () => {
  const { onboarding, navigate } = useHelpdesk();

  const cards = [
    {
      title: 'Configuração Geral & Perfil',
      description: 'Dados da organização, país, idioma e administrador principal.',
      status: 'Concluído',
      icon: Building2,
      stepTarget: 0,
    },
    {
      title: 'Equipes & Verticais',
      description: 'Definição de verticais ativas, equipes e responsáveis técnicos.',
      status: 'Concluído',
      icon: Users,
      stepTarget: 2,
    },
    {
      title: 'Canais WhatsApp',
      description: 'Configuração de até 6 números de atendimento e webhooks.',
      status: 'Concluído',
      icon: Smartphone,
      stepTarget: 6,
    },
    {
      title: 'Fluxos de Atendimento',
      description: 'Triagem automática, identificação de cliente e roteamento.',
      status: 'Concluído',
      icon: GitBranch,
      stepTarget: 7,
    },
    {
      title: 'Mensagens & SLA',
      description: 'Templates rápidos, comandos slash e limites de tempo.',
      status: 'Concluído',
      icon: MessageSquare,
      stepTarget: 8,
    },
    {
      title: 'Agente de IA (Gemini)',
      description: 'Assistente para sugestão de respostas e resumo de chamados.',
      status: onboarding.aiConfig ? 'Concluído' : 'Pendente',
      icon: Sparkles,
      stepTarget: 11,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Painel de Conclusão do Onboarding
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe o status das etapas de implantação da organização e revise configurações a qualquer momento.
          </p>
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
        >
          <span>Abrir Assistente Completo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white">Status da Organização:</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5 capitalize">
              {onboarding.state === 'active' ? 'Produção Ativa' : 'Em Implantação'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {onboarding.completedSteps.length} de 16 etapas concluídas com validação de conformidade.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-slate-200">100%</div>
            <div className="text-xs text-slate-400">Prontidão Operacional</div>
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-full" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-semibold">
                    {c.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Revisar Etapa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
