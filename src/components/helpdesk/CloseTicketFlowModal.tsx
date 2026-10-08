import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  MessageSquare,
  Star,
  FileText,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { Conversation } from '../../types';

interface CloseTicketFlowModalProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClose: (
    withSurvey: boolean,
    catalogData: { title: string; date: string; summary: string }
  ) => void;
}

export const CloseTicketFlowModal: React.FC<CloseTicketFlowModalProps> = ({
  conversation,
  isOpen,
  onClose,
  onConfirmClose,
}) => {
  const [step, setStep] = useState<'choice' | 'catalog'>('choice');
  const [withSurveyChoice, setWithSurveyChoice] = useState<boolean>(true);

  // Mandatory fields for Step 2
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [validationError, setValidationError] = useState('');

  // Pre-fill initial values when modal opens
  useEffect(() => {
    if (isOpen && conversation) {
      setStep('choice');
      setValidationError('');

      // Pre-fill Title intelligently
      const firstClientMsg = conversation.messages.find((m) => m.senderType === 'client')?.content || '';
      let initialTitle = conversation.title;
      if (!initialTitle) {
        if (firstClientMsg.length > 5) {
          const shortFirst = firstClientMsg.slice(0, 50).trim();
          initialTitle = `${conversation.verticalName}: ${shortFirst}${firstClientMsg.length > 50 ? '...' : ''}`;
        } else {
          initialTitle = `Suporte em ${conversation.verticalName} - ${conversation.clientName}`;
        }
      }
      setTitle(initialTitle);

      // Pre-fill Date
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(conversation.ticketDate || todayStr);

      // Pre-fill Summary ("já mostre o resumo daquele suporte")
      let initialSummary = conversation.ticketSummary;
      if (!initialSummary) {
        const clientMsgs = conversation.messages.filter((m) => m.senderType === 'client');
        const techMsgs = conversation.messages.filter((m) => m.senderType === 'technician');
        const clientIssue = clientMsgs[0]?.content || conversation.lastMessageSnippet;
        const techSolution = techMsgs[techMsgs.length - 1]?.content || 'Procedimento verificado e orientado com sucesso.';

        initialSummary = `Atendimento realizado para ${conversation.clientName} referente à vertical de ${conversation.verticalName}. Demanda inicial: "${clientIssue}". Resolução técnica: "${techSolution}". Suporte concluído sem pendências.`;
      }
      setSummary(initialSummary);
    }
  }, [isOpen, conversation]);

  if (!isOpen) return null;

  const handleSelectChoice = (withSurvey: boolean) => {
    setWithSurveyChoice(withSurvey);
    setStep('catalog');
  };

  const handleSaveCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !summary.trim()) {
      setValidationError('Todos os campos são obrigatórios: Título, Data e Resumo do suporte devem ser preenchidos.');
      return;
    }

    setValidationError('');
    onConfirmClose(withSurveyChoice, {
      title: title.trim(),
      date: date.trim(),
      summary: summary.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Step 1: Escolha do Modo de Encerramento */}
        {step === 'choice' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Encerrar Atendimento
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protocolo <strong className="text-slate-200">{conversation.protocol}</strong> • {conversation.clientName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Como você deseja finalizar esta sessão de atendimento com o cliente?
            </p>

            <div className="space-y-3">
              {/* Botão 1: Finalizar com mensagem de encerramento e avaliação e nota de atendimento */}
              <button
                type="button"
                onClick={() => handleSelectChoice(true)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 hover:from-emerald-900/60 hover:to-slate-800 border-2 border-emerald-600/70 hover:border-emerald-500 transition group cursor-pointer shadow-lg shadow-emerald-950/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      Finalizar com mensagem de encerramento e avaliação e nota de atendimento
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Envia ao WhatsApp do cliente a mensagem formal de conclusão junto à pesquisa de nota (1 a 5 estrelas ⭐) para avaliação do técnico.
                    </p>
                  </div>
                </div>
              </button>

              {/* Botão 2: Finalizar sem mensagem */}
              <button
                type="button"
                onClick={() => handleSelectChoice(false)}
                className="w-full text-left p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                      Finalizar sem mensagem
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Conclui o chamado diretamente no sistema sem enviar mensagens ou notificações adicionais ao cliente.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Popup de Catalogação Obrigatória (Título, Data, Resumo, Salvar) */}
        {step === 'catalog' && (
          <form onSubmit={handleSaveCatalog} className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Catalogar Chamado no Histórico
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protocolo <strong className="text-slate-200">{conversation.protocol}</strong> •{' '}
                  <span className={withSurveyChoice ? 'text-emerald-400' : 'text-slate-400'}>
                    {withSurveyChoice ? 'Com avaliação de satisfação' : 'Sem mensagem ao cliente'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Todos os campos abaixo são <strong>obrigatórios</strong> para indexação e facilitar a busca futura nos históricos de conversa.
              </span>
            </div>

            {validationError && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-[11px] text-red-300 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Campo 1: Título do Chamado (Obrigatório) */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Título do Chamado <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Correção de cálculo da alíquota do INSS na folha suplementar"
                required
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Campo 2: Data do Atendimento (Obrigatório) */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Data do Atendimento <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Campo 3: Resumo daquele Suporte (Obrigatório) */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
                <span>
                  Resumo do Suporte <span className="text-red-400">*</span>
                </span>
                <span className="text-[10px] text-indigo-400 font-normal">
                  (Preenchido automaticamente / editável)
                </span>
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Descreva o problema atendido e a solução aplicada pelo suporte..."
                required
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition leading-relaxed resize-none"
              />
            </div>

            {/* Actions: Voltar & Salvar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('choice')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Voltar à Escolha
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition shadow-md shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar e Concluir Chamado</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
