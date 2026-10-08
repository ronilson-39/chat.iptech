import React, { useState, useEffect } from 'react';
import { X, Pencil, Check } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface EditMessageModalProps {
  message: ChatMessage | null;
  conversationId: string;
  onClose: () => void;
}

export const EditMessageModal: React.FC<EditMessageModalProps> = ({
  message,
  conversationId,
  onClose,
}) => {
  const { updateMessage } = useHelpdesk();
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (message) {
      setNewContent(message.content);
    }
  }, [message]);

  if (!message) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    updateMessage(conversationId, message.id, { content: newContent.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Editar Mensagem</h3>
              <p className="text-[11px] text-slate-400">
                Altere o conteúdo da mensagem enviada
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

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Texto da mensagem
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
              placeholder="Digite o novo texto..."
              autoFocus
            />
            <div className="text-[10px] text-slate-500 text-right mt-1">
              {newContent.length} caracteres
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newContent.trim() || newContent.trim() === message.content}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
