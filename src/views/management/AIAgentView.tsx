import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Sparkles,
  Bot,
  Play,
  Save,
  CheckCircle2,
  Sliders,
  BookOpen,
  Send,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export const AIAgentView: React.FC = () => {
  const { onboarding, updateOnboarding, verticals, addAuditLog, knowledgeArticles } = useHelpdesk();
  const [testPrompt, setTestPrompt] = useState('Cliente informou erro 401 ao enviar lote S-1200 do eSocial. O que devo responder e conferir?');
  const [selectedVertical, setSelectedVertical] = useState('vert-esocial');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sourceNotice, setSourceNotice] = useState<string | null>(null);

  const ai = onboarding.aiConfig;

  const handleTestPrompt = async () => {
    setLoading(true);
    setAiOutput(null);
    setSourceNotice(null);

    const targetVert = verticals.find((v) => v.id === selectedVertical);
    const kbContent = knowledgeArticles
      .map((k) => `${k.title}:\n${k.content}`)
      .join('\n\n');

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_response',
          prompt: testPrompt,
          vertical: targetVert?.name || 'Geral',
          context: 'Ambiente de teste e validação de prompt do administrador.',
          knowledgeBase: kbContent,
        }),
      });

      const data = await res.json();
      setAiOutput(data.result);
      setSourceNotice(data.source === 'gemini-3.8-flash' ? 'Processado via Google Gemini 3.8 Flash' : data.notice || 'Motor Heurístico Local');
      addAuditLog('Teste de Agente IA', 'IA Gemini', 'Prompt de teste avaliado pelo administrador.');
    } catch (err: any) {
      setAiOutput('Erro na requisição com o backend de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('Configuração de IA', 'IA Gemini', 'Parâmetros de temperatura e prompt atualizados.');
    alert('Configurações do Agente IA salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Configuração do Agente de Inteligência Artificial
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Parametrização do copiloto inteligente para sugestão de respostas, diagnósticos e resumos com Google Gemini 3.8 Flash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-semibold flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            {ai.model}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Parâmetros do Modelo & Diretrizes
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Provedor</label>
                <input
                  type="text"
                  disabled
                  value={ai.provider}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Modelo Ativo</label>
                <input
                  type="text"
                  disabled
                  value={ai.model}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Temperatura: {ai.temperature}</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={ai.temperature}
                onChange={(e) =>
                  updateOnboarding((prev) => ({
                    ...prev,
                    aiConfig: { ...prev.aiConfig, temperature: parseFloat(e.target.value) },
                  }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0.1 (Mais preciso/técnico)</span>
                <span>1.0 (Mais criativo)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Instrução do Sistema (System Prompt)</label>
              <textarea
                rows={5}
                value={ai.systemPrompt}
                onChange={(e) =>
                  updateOnboarding((prev) => ({
                    ...prev,
                    aiConfig: { ...prev.aiConfig, systemPrompt: e.target.value },
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white leading-relaxed font-sans"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ai.requireHumanApproval}
                  onChange={(e) =>
                    updateOnboarding((prev) => ({
                      ...prev,
                      aiConfig: { ...prev.aiConfig, requireHumanApproval: e.target.checked },
                    }))
                  }
                  className="rounded bg-slate-800 text-indigo-500"
                />
                <span className="font-medium">Exigir Revisão do Técnico (Human in the loop)</span>
              </label>
              <p className="text-[11px] text-slate-400">
                A IA atua apenas como copiloto sugerindo rascunhos. Nenhuma resposta é enviada ao cliente sem a ação explícita de envio pelo atendente.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition shadow-lg shadow-indigo-950/40"
            >
              Salvar Alterações
            </button>
          </form>
        </div>

        {/* Right: Interactive Playground */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Playground de Teste em Tempo Real
              </h2>
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                {verticals.map((v) => (
                  <option key={v.id} value={v.id}>
                    Vertical: {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-medium">Prompt / Pergunta do Teste:</label>
              <textarea
                rows={3}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleTestPrompt}
                disabled={loading || !testPrompt.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Consultando Gemini...' : 'Executar Análise com IA'}</span>
              </button>
            </div>

            {/* Output Display */}
            {aiOutput && (
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-400">Resposta Gerada:</span>
                  {sourceNotice && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                      {sourceNotice}
                    </span>
                  )}
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto font-sans">
                  {aiOutput}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Base de conhecimento (artigos e manuais) conectada automaticamente.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
