import React, { useEffect, useRef, useState } from 'react';
import {
  Info,
  Reply,
  Copy,
  Smile,
  Forward,
  Pin,
  Sparkles,
  Star,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';
import { ChatMessage, Conversation } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface MessageContextMenuProps {
  position: { x: number; y: number } | null;
  message: ChatMessage | null;
  conversation: Conversation | null;
  onClose: () => void;
  onReply: (message: ChatMessage) => void;
  onAskAi: (message: ChatMessage) => void;
  onOpenDetails: (message: ChatMessage) => void;
  onOpenForward: (message: ChatMessage) => void;
  onOpenEdit: (message: ChatMessage) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥'];

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  position,
  message,
  conversation,
  onClose,
  onReply,
  onAskAi,
  onOpenDetails,
  onOpenForward,
  onOpenEdit,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    toggleMessageReaction,
    togglePinMessage,
    toggleStarMessage,
    deleteMessage,
    currentUser,
    setActiveToast,
  } = useHelpdesk();

  // Fechar ao clicar fora ou ao rolar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!position || !message || !conversation) return null;

  // Ajustar posição para não transbordar da tela
  const menuWidth = 230;
  const menuHeight = 390;
  const padding = 12;

  const adjustedX = Math.min(
    Math.max(position.x, padding),
    window.innerWidth - menuWidth - padding
  );
  const adjustedY = Math.min(
    Math.max(position.y, padding),
    window.innerHeight - menuHeight - padding
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setActiveToast({
        title: 'Copiado',
        message: 'Texto da mensagem copiado para a área de transferência.',
        type: 'success',
      });
      setTimeout(() => {
        onClose();
      }, 300);
    } catch {
      setActiveToast({
        title: 'Erro ao copiar',
        message: 'Não foi possível copiar o texto.',
        type: 'warning',
      });
      onClose();
    }
  };

  const handleReaction = (reaction: string) => {
    toggleMessageReaction(conversation.id, message.id, reaction);
    onClose();
  };

  const handlePin = () => {
    togglePinMessage(conversation.id, message.id);
    onClose();
  };

  const handleStar = () => {
    toggleStarMessage(conversation.id, message.id);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Deseja realmente apagar esta mensagem da conversa?')) {
      deleteMessage(conversation.id, message.id);
    }
    onClose();
  };

  const isTechnicianMsg = message.senderType === 'technician';
  const canEdit = isTechnicianMsg || currentUser.role !== 'technical_user';

  return (
    <div
      ref={menuRef}
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      className="fixed z-[100] w-[220px] bg-slate-900/98 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Barra de Reação Rápida Flutuante quando acionada */}
      {showReactions && (
        <div className="flex items-center justify-between gap-1 p-1.5 mb-1.5 bg-slate-950/90 rounded-xl border border-slate-800 animate-in fade-in">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleReaction(emoji)}
              className="w-6 h-6 flex items-center justify-center text-sm rounded-lg hover:bg-slate-800 hover:scale-125 transition cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 1. Dados da mensagem */}
      <button
        type="button"
        onClick={() => {
          onOpenDetails(message);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        <Info className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition shrink-0" />
        <span className="font-medium">Dados da mensagem</span>
      </button>

      {/* 2. Responder */}
      <button
        type="button"
        onClick={() => {
          onReply(message);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        <Reply className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition shrink-0" />
        <span className="font-medium">Responder</span>
      </button>

      {/* 3. Copiar */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400 transition shrink-0" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition shrink-0" />
        )}
        <span className="font-medium">{copied ? 'Copiado!' : 'Copiar'}</span>
      </button>

      {/* 4. Reagir */}
      <button
        type="button"
        onClick={() => setShowReactions(!showReactions)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group ${
          showReactions ? 'bg-slate-800 text-white' : ''
        }`}
      >
        <Smile className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition shrink-0" />
        <span className="font-medium">Reagir</span>
      </button>

      {/* 5. Encaminhar */}
      <button
        type="button"
        onClick={() => {
          onOpenForward(message);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        <Forward className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition shrink-0" />
        <span className="font-medium">Encaminhar</span>
      </button>

      {/* 6. Fixar */}
      <button
        type="button"
        onClick={handlePin}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        <Pin className={`w-4 h-4 transition shrink-0 ${message.isPinned ? 'text-amber-400 rotate-45' : 'text-slate-400 group-hover:text-amber-400'}`} />
        <span className="font-medium">{message.isPinned ? 'Desafixar' : 'Fixar'}</span>
      </button>

      {/* 7. Pergunte à Meta AI */}
      <button
        type="button"
        onClick={() => {
          onAskAi(message);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group text-indigo-300"
      >
        <Sparkles className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition shrink-0" />
        <span className="font-medium text-slate-100">Pergunte à Meta AI</span>
      </button>

      {/* 8. Favoritar */}
      <button
        type="button"
        onClick={handleStar}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
      >
        <Star className={`w-4 h-4 transition shrink-0 ${message.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400 group-hover:text-amber-400'}`} />
        <span className="font-medium">{message.isStarred ? 'Desfavoritar' : 'Favoritar'}</span>
      </button>

      {/* 9. Editar */}
      {canEdit && (
        <button
          type="button"
          onClick={() => {
            onOpenEdit(message);
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-800 hover:text-white transition cursor-pointer group"
        >
          <Pencil className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition shrink-0" />
          <span className="font-medium">Editar</span>
        </button>
      )}

      {/* Divisor */}
      <div className="border-t border-slate-800 my-1" />

      {/* 10. Apagar */}
      <button
        type="button"
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-red-950/40 text-red-400 hover:text-red-300 transition cursor-pointer group"
      >
        <Trash2 className="w-4 h-4 text-red-400 group-hover:scale-110 transition shrink-0" />
        <span className="font-medium">Apagar</span>
      </button>
    </div>
  );
};
