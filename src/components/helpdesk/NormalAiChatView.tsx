import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  Trash2,
  Copy,
  Check,
  Zap,
  Lightbulb,
  FileText,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface AiMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  time: string;
}

const DEFAULT_AI_PROMPTS = [
  'Como solucionar rejeição de XML no evento S-1200 do eSocial?',
  'Sugerir resposta cordial para cliente solicitando recibo',
  'Passo a passo para cadastro de rubrica com incidência',
  'Resumo técnico do chamado para passagem de turno',
];

interface NormalAiChatViewProps {
  onBackToInbox: () => void;
}

export const NormalAiChatView: React.FC<NormalAiChatViewProps> = ({ onBackToInbox }) => {
  const { currentUser } = useHelpdesk();

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'ai-intro',
      sender: 'agent',
      content: `Olá, ${currentUser.name}! Sou o Agente de Inteligência Artificial da IPTech. Estou pronto para ajudar com dúvidas de sistemas públicos (Folha, eSocial, Contabilidade, Tributos), diagnósticos de incidentes, geração de respostas cordiais e análise de regras de negócio. Como posso ajudar agora?`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: text,
          context: `Usuário técnico: ${currentUser.name} (${currentUser.role}). Sistema IPTech Atendimento Omnichannel.`,
          conversationHistory: messages.slice(-4).map((m) => `${m.sender}: ${m.content}`),
        }),
      });

      const data = await res.json();
      const replyContent = data.result || 'Entendido. Com base na base de conhecimento da IPTech, realize a conferência da tabela de rubricas e valide o certificado digital A1 antes de reenviar o lote.';

      const agentMsg: AiMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        content: replyContent,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      // Fallback response if offline
      const fallbackMsg: AiMessage = {
        id: `a-err-${Date.now()}`,
        sender: 'agent',
        content: `Entendido! Para a demanda informada ("${text}"), recomendo:
1. Conferir a versão do layout e os parâmetros da vertical correspondente.
2. Certificar que o usuário possui permissão adequada e certificado digital válido.
3. Se o incidente persistir, encaminhe ao canal de Desenvolvimento na aba Dev.`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `ai-intro-${Date.now()}`,
        sender: 'agent',
        content: 'Conversa reiniciada. Em que posso auxiliá-lo?',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 overflow-hidden select-none animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToInbox}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Voltar ao Atendimento"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Ícone de Agente IA (Request 4) */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center relative">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Chat com o Agente IA
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Gemini Agent
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                Copiloto inteligente treinado nas regras de atendimento da IPTech
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
            title="Limpar histórico do chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0 select-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Sugestões:
        </span>
        {DEFAULT_AI_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-950/60 hover:text-indigo-300 hover:border-indigo-500/50 border border-slate-700/80 text-[11px] text-slate-300 transition shrink-0 cursor-pointer text-left active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 select-text">
        {messages.map((m) => {
          const isAgent = m.sender === 'agent';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 px-1">
                {isAgent ? (
                  <div className="flex items-center gap-1 text-indigo-400 font-bold">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Agente IA IPTech</span>
                  </div>
                ) : (
                  <span className="font-semibold text-slate-300">{currentUser.name}</span>
                )}
                <span>• {m.time}</span>
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm relative group ${
                  isAgent
                    ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {m.content}

                {isAgent && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.id, m.content)}
                    className="absolute bottom-2 right-2 p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Copiar resposta"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-indigo-400 text-xs py-2 px-1 animate-pulse">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>O Agente IA está formulando a resposta...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-auto p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Pergunte ao Agente IA sobre regras do sistema, eSocial, folha ou peça uma resposta para cliente..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputVal.trim() || loading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-indigo-950/40 cursor-pointer"
          title="Enviar pergunta ao Agente IA"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
