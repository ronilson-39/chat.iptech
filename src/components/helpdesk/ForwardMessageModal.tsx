import React, { useState } from 'react';
import { X, Forward, Search, Check, MessageSquare } from 'lucide-react';
import { ChatMessage, Conversation } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';

interface ForwardMessageModalProps {
  message: ChatMessage | null;
  currentConversationId: string;
  onClose: () => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  message,
  currentConversationId,
  onClose,
}) => {
  const { conversations, forwardMessage } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!message) return null;

  const targetList = conversations.filter(
    (c) => c.id !== currentConversationId && c.status !== 'Encerrado'
  );

  const filtered = targetList.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientPhone.includes(searchTerm)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleForward = () => {
    if (selectedIds.length === 0) return;
    forwardMessage(message, selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Forward className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Encaminhar Mensagem</h3>
              <p className="text-[11px] text-slate-400">
                Selecione os atendimentos para onde deseja enviar
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

        {/* Preview do texto */}
        <div className="p-3.5 bg-slate-950/80 border-b border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-semibold uppercase mb-1">
            Mensagem a ser encaminhada:
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 italic">
            "{message.content}"
          </p>
        </div>

        {/* Busca */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, protocolo ou telefone..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((conv) => {
            const isSelected = selectedIds.includes(conv.id);
            return (
              <div
                key={conv.id}
                onClick={() => toggleSelect(conv.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500/70 text-white'
                    : 'bg-slate-850/50 hover:bg-slate-800/80 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={conv.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={conv.clientName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-white">
                      {conv.clientName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {conv.protocol} • {conv.clientPhone}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              Nenhuma conversa encontrada para encaminhamento.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {selectedIds.length > 0 ? (
              <span className="font-semibold text-emerald-400">
                {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
              </span>
            ) : (
              'Selecione ao menos um'
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleForward}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Forward className="w-3.5 h-3.5" />
              <span>Encaminhar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
