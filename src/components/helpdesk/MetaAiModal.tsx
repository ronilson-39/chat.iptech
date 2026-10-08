import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, CornerDownLeft, Bot, Check, Zap } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface MetaAiModalProps {
  message: ChatMessage | null;
  onClose: () => void;
  onUseResponse: (replyText: string) => void;
}

export const MetaAiModal: React.FC<MetaAiModalProps> = ({
  message,
  onClose,
  onUseResponse,
}) => {
  const { setActiveToast } = useHelpdesk();
  const [prompt, setPrompt] = useState('Como responder profissionalmente a esta mensagem?');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>(() => {
    if (!message) return '';
    return `Com base na mensagem: "${message.content}", aqui está uma sugestão de resposta profissional e cordial:\n\n"Olá, compreendo perfeitamente a sua solicitação. Já verifiquei o status do seu chamado e estou providenciando o procedimento adequado para resolver com rapidez e precisão. Por gentileza, aguarde apenas alguns instantes enquanto valido os dados finais. Qualquer dúvida adicional, sigo à disposição!"`;
  });
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const quickPrompts = [
    'Sugerir resposta cordial',
    'Explicar termos técnicos',
    'Resumir solicitação',
    'Verificar conformidade com edital/processo',
  ];

  const handleAsk = (customPrompt?: string) => {
    const activeQuery = customPrompt || prompt;
    if (!activeQuery.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (activeQuery.includes('Resumir')) {
        setAiResponse(
          `Resumo Executivo da Mensagem:\n• Cliente/Técnico solicita andamento referente a: "${message.content.slice(0, 50)}..."\n• Ponto focal: Resolução rápida e validação de requisitos técnicos.\n• Nível de urgência estimado: Normal / Médio.`
        );
      } else if (activeQuery.includes('termos')) {
        setAiResponse(
          `Análise Técnica:\nA mensagem faz referência a processos operacionais e de homologação. Recomenda-se manter a clareza técnica sem jargões complexos, confirmando dados de protocolo e horários de atendimento previstos no SLA.`
        );
      } else if (activeQuery.includes('edital') || activeQuery.includes('conformidade')) {
        setAiResponse(
          `Conformidade Regulatória & PNCP:\nA solicitação atende aos padrões do processo administrativo. Para garantir validade documental, mencione o número de protocolo e registre o parecer nos anexos do chamado.`
        );
      } else {
        setAiResponse(
          `Sugestão de Resposta Refinada:\n\n"Olá ${message.senderName || 'prezado(a)'}, obrigado pelo retorno. Estamos cientes da necessidade apontada em sua mensagem e nossa equipe técnica já está atuando para garantir o atendimento completo. Manteremos você informado(a) por este mesmo canal."`
        );
      }
    }, 600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setActiveToast({
        title: 'Copiado',
        message: 'Resposta da IA copiada com sucesso.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleInject = () => {
    onUseResponse(aiResponse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Pergunte à Meta AI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  Copilot
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Assistente inteligente para auxílio em mensagens e respostas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensagem em Contexto */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-semibold uppercase mb-1 flex items-center gap-1">
            <Bot className="w-3 h-3 text-indigo-400" />
            Mensagem selecionada:
          </div>
          <p className="text-xs text-slate-300 line-clamp-3 italic">
            "{message.content}"
          </p>
        </div>

        {/* Sugestões Rápidas de Prompt */}
        <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0">Opções rápidas:</span>
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              type="button"
              onClick={() => {
                setPrompt(qp);
                handleAsk(qp);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-950/60 hover:text-indigo-300 border border-slate-700/80 text-slate-300 shrink-0 transition cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Resposta Gerada */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Resposta da IA</span>
            {isGenerating && (
              <span className="text-indigo-400 flex items-center gap-1 normal-case font-normal animate-pulse">
                <Zap className="w-3 h-3" />
                Processando...
              </span>
            )}
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[140px] font-sans">
            {aiResponse}
          </div>
        </div>

        {/* Input de Pergunta Customizada */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            placeholder="O que você deseja perguntar sobre esta mensagem?..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => handleAsk()}
            disabled={isGenerating || !prompt.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0"
            title="Enviar para a IA"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer com Ações */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={handleInject}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Inserir na Resposta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
