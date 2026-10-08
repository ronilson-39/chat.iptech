import React from 'react';
import { X, Info, CheckCheck, Clock, User, Hash, FileText, Pin, Star } from 'lucide-react';
import { ChatMessage, Conversation } from '../../types';

interface MessageDetailsModalProps {
  message: ChatMessage | null;
  conversation: Conversation | null;
  onClose: () => void;
}

export const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  message,
  conversation,
  onClose,
}) => {
  if (!message || !conversation) return null;

  const isClient = message.senderType === 'client';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Dados da Mensagem</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {message.id}</p>
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Mensagem Preview */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Conteúdo da Mensagem
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-xs">
              {message.content}
            </p>
          </div>

          {/* Grid de Metadados */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Remetente</span>
              </div>
              <div className="font-semibold text-white truncate">
                {message.senderName}
              </div>
              <div className="text-[10px] text-slate-400">
                {isClient ? 'Cliente' : 'Técnico Especialista'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horário</span>
              </div>
              <div className="font-semibold text-white">
                {message.createdAt}
              </div>
              <div className="text-[10px] text-slate-400">
                {message.editedAt ? `Editada às ${message.editedAt}` : 'Mensagem original'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status de Entrega</span>
              </div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {message.status === 'read' ? 'Lida' : message.status === 'delivered' ? 'Entregue' : 'Enviada'}
              </div>
              <div className="text-[10px] text-slate-400">
                Criptografia ponta a ponta
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>Protocolo</span>
              </div>
              <div className="font-mono font-bold text-white truncate">
                {conversation.protocol}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {conversation.clientName}
              </div>
            </div>
          </div>

          {/* Badges Adicionais */}
          <div className="flex items-center gap-2 flex-wrap">
            {message.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[11px] font-medium">
                <Pin className="w-3 h-3" />
                Fixada no topo
              </span>
            )}
            {message.isStarred && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[11px] font-medium">
                <Star className="w-3 h-3 fill-amber-300" />
                Favoritada
              </span>
            )}
            {message.reactions && message.reactions.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
                <span>Reações:</span>
                <span>{message.reactions.join(' ')}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px]">
              <FileText className="w-3 h-3" />
              {message.content.length} caracteres
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
