import React, { useState, useRef, useEffect } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { FloatingWindow, ChatMessage } from '../../types';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Move,
  CornerDownRight,
  Smile,
  MoreVertical,
  Mic,
} from 'lucide-react';

export const FloatingWindowManager: React.FC = () => {
  const {
    floatingWindows,
    isF2GridActive,
    closeFloatingWindow,
    minimizeFloatingWindow,
    maximizeFloatingWindow,
    bringToFront,
    updateFloatingWindowPos,
  } = useHelpdesk();

  return (
    <>
      {floatingWindows.map((win) => (
        <FloatingWindowItem
          key={win.id}
          window={win}
          onClose={() => closeFloatingWindow(win.id)}
          onMinimize={() => minimizeFloatingWindow(win.id)}
          onMaximize={() => maximizeFloatingWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
          onPosChange={(x, y, w, h) => updateFloatingWindowPos(win.id, x, y, w, h)}
        />
      ))}
      {/* Minimized windows tray at bottom showing conversation name (oculto quando modo F2 estiver ativo) */}
      {!isF2GridActive && floatingWindows.some((w) => w.isMinimized) && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-auto max-w-[92vw] overflow-x-auto p-1.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            Janelas Minimizadas:
          </span>
          {floatingWindows
            .filter((w) => w.isMinimized)
            .map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  minimizeFloatingWindow(w.id);
                  bringToFront(w.id);
                }}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs shadow-md transition cursor-pointer select-none"
                title={`Clique para restaurar conversa: ${w.title}`}
              >
                {w.type === 'ai_assistant' ? (
                  <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className="font-semibold text-white max-w-[180px] sm:max-w-[240px] truncate">
                  {w.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 ml-1 shrink-0 transition" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFloatingWindow(w.id);
                  }}
                  className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition ml-1"
                  title="Fechar janela"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

interface WindowItemProps {
  window: FloatingWindow;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPosChange: (x: number, y: number, w: number, h: number) => void;
}

const FloatingWindowItem: React.FC<WindowItemProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPosChange,
}) => {
  const { conversations, sendMessage, quickMessages, currentUser, addMediaToConversation } = useHelpdesk();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const conversation = win.type === 'conversation' ? conversations.find((c) => c.id === win.dataId) : null;
  const [inputText, setInputText] = useState('');
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Handle Dragging - allows moving freely to any position/screen
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    });
  };

  // Handle Resizing - customizable pulling from all corners and edges
  const handleMouseDownResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(direction);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: win.x,
      y: win.y,
      w: win.width,
      h: win.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Can be moved freely anywhere across the screen / monitor area
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onPosChange(newX, newY, win.width, win.height);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        const MIN_W = 280;
        const MIN_H = 220;

        let newX = resizeStart.x;
        let newY = resizeStart.y;
        let newW = resizeStart.w;
        let newH = resizeStart.h;

        // East (Right)
        if (isResizing.includes('e')) {
          newW = Math.max(MIN_W, resizeStart.w + deltaX);
        }
        // West (Left)
        if (isResizing.includes('w')) {
          const rawW = resizeStart.w - deltaX;
          if (rawW >= MIN_W) {
            newW = rawW;
            newX = resizeStart.x + deltaX;
          } else {
            newW = MIN_W;
            newX = resizeStart.x + (resizeStart.w - MIN_W);
          }
        }
        // South (Bottom)
        if (isResizing.includes('s')) {
          newH = Math.max(MIN_H, resizeStart.h + deltaY);
        }
        // North (Top)
        if (isResizing.includes('n')) {
          const rawH = resizeStart.h - deltaY;
          if (rawH >= MIN_H) {
            newH = rawH;
            newY = resizeStart.y + deltaY;
          } else {
            newH = MIN_H;
            newY = resizeStart.y + (resizeStart.h - MIN_H);
          }
        }

        onPosChange(newX, newY, newW, newH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win, onPosChange]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onClick={onFocus}
      className="flex flex-col bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-md select-none ring-1 ring-white/5"
    >
      {/* Window Header (Modelo da imagem com as 3 bolinhas coloridas vermelho/amarelo/verde) */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/95 border-b border-slate-700/80 cursor-move text-slate-100 select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Três botões estilo janela do modelo da imagem (Vermelho, Amarelo, Verde) */}
          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 border border-red-600 flex items-center justify-center transition cursor-pointer group"
              title="Fechar Janela"
            >
              <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-300 border border-amber-500 flex items-center justify-center transition cursor-pointer group"
              title="Minimizar para a grade / bandeja"
            >
              <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 border border-emerald-600 flex items-center justify-center transition cursor-pointer group"
              title={win.isMaximized ? 'Restaurar' : 'Maximizar'}
            >
              <Maximize2 className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>

          {/* Avatar e Título da Conversa */}
          {conversation && (
            <div className="relative shrink-0">
              <img
                src={conversation.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={conversation.clientName}
                className="w-6 h-6 rounded-full object-cover border border-slate-600 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
            </div>
          )}

          <div className="min-w-0 flex items-center gap-1.5">
            <span className="text-xs font-bold truncate text-white">{win.title}</span>
            {conversation && (
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline truncate">
                • {conversation.clientPhone}
              </span>
            )}
          </div>
        </div>

        {/* Lado Direito do Cabeçalho: Protocolo e Ações Rápidas */}
        <div className="flex items-center gap-1 shrink-0">
          {conversation && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-900/80 text-emerald-300 border border-slate-700/60 hidden xs:inline-block">
              {conversation.protocol}
            </span>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-950/60 select-text">
        {win.type === 'conversation' && conversation && (
          <div className="flex-1 flex flex-col h-full">
            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {conversation.messages.map((m) => {
                const isClient = m.senderType === 'client';
                const isSystem = m.senderType === 'system';
                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center text-[11px] text-slate-400 py-1">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
                        {m.content}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}>
                    {isClient && (
                      <div className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName}</div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                        isClient
                          ? 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
                          : 'bg-emerald-500 text-black rounded-tr-none'
                      }`}
                    >
                      {!isClient ? (
                        <>
                          <div className="font-bold text-black text-xs leading-tight">
                            {(m.senderName || 'Técnico').replace(/:$/, '')}:
                          </div>
                          <div className="font-normal text-black text-xs leading-relaxed mt-0.5 whitespace-pre-wrap">
                            {m.content}
                          </div>
                        </>
                      ) : (
                        m.content
                      )}
                      <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${isClient ? 'opacity-75 text-slate-300' : 'text-black/70 font-medium'}`}>
                        <span>{m.createdAt}</span>
                        {!isClient && <CheckCheck className="w-3 h-3 text-black" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inputText.trim()) return;
                sendMessage(conversation.id, inputText);
                setInputText('');
              }}
              className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 relative"
            >
              {/* Backdrops */}
              {(quickRepliesOpen || emojiPickerOpen) && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setQuickRepliesOpen(false);
                    setEmojiPickerOpen(false);
                  }}
                />
              )}

              {/* Three dots for Quick Replies */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setQuickRepliesOpen(!quickRepliesOpen);
                    setEmojiPickerOpen(false);
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    quickRepliesOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title="Respostas Rápidas"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {quickRepliesOpen && (
                  <div className="absolute bottom-10 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-56 overflow-y-auto">
                    <div className="text-[10px] font-bold text-white px-2 py-1 border-b border-slate-800 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                      Respostas Rápidas
                    </div>
                    <div className="space-y-0.5">
                      {quickMessages.map((qm) => (
                        <button
                          key={qm.id}
                          type="button"
                          onClick={() => {
                            const replaced = qm.content
                              .replace(/{{cliente}}/g, conversation.clientName)
                              .replace(/{{tecnico}}/g, currentUser.name)
                              .replace(/{{protocolo}}/g, conversation.protocol);
                            setInputText(replaced);
                            setQuickRepliesOpen(false);
                          }}
                          className="w-full text-left p-1.5 rounded hover:bg-slate-800 text-[11px] text-slate-200 transition"
                        >
                          <div className="font-semibold text-slate-300">{qm.name}</div>
                          <div className="text-[9px] text-slate-500 line-clamp-1">{qm.content}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Emoji icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setEmojiPickerOpen(!emojiPickerOpen);
                    setQuickRepliesOpen(false);
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    emojiPickerOpen ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                  }`}
                  title="Inserir Emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>

                {emojiPickerOpen && (
                  <div className="absolute bottom-10 left-0 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                    <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
                      {['👍', '👋', '🙏', '😊', '✅', '🤝', '😉', '⭐', '🚀', '💡', '⏰', '🎉', '📁', '💻', '📞', '❓', '😀', '❤️'].map((em, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInputText((prev) => prev + em);
                          }}
                          className="w-7 h-7 rounded hover:bg-slate-800 text-sm flex items-center justify-center transition hover:scale-125"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg transition cursor-pointer"
                title="Enviar mensagem"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (conversation) {
                    addMediaToConversation(conversation.id, {
                      title: 'Mensagem de Voz (00:08)',
                      url: 'https://actions.google.com/sounds/v1/ambiences/office.ogg',
                      type: 'audio',
                      senderType: 'technician',
                      senderName: currentUser.name,
                      size: '0.8 MB',
                    });
                  }
                }}
                className="p-2 bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50 text-slate-300 rounded-lg transition cursor-pointer"
                title="Gravar áudio"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </form>
          </div>
        )}

        {win.type === 'ai_assistant' && (
          <FloatingAIAssistantContent conversationId={win.dataId} />
        )}
      </div>

      {/* Customizable Multi-Corner and Edge Resize Handles */}
      {!win.isMaximized && (
        <>
          {/* Top-Left Corner */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'nw')}
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-30 group"
            title="Puxar pelo canto para redimensionar"
          >
            <div className="w-2 h-2 border-t-2 border-l-2 border-slate-500 group-hover:border-indigo-400 m-0.5 rounded-tl-sm transition" />
          </div>

          {/* Top-Right Corner */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'ne')}
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-30 group flex justify-end"
            title="Puxar pelo canto para redimensionar"
          >
            <div className="w-2 h-2 border-t-2 border-r-2 border-slate-500 group-hover:border-indigo-400 m-0.5 rounded-tr-sm transition" />
          </div>

          {/* Bottom-Left Corner */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'sw')}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-30 group flex items-end"
            title="Puxar pelo canto para redimensionar"
          >
            <div className="w-2 h-2 border-b-2 border-l-2 border-slate-500 group-hover:border-indigo-400 m-0.5 rounded-bl-sm transition" />
          </div>

          {/* Bottom-Right Corner */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'se')}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-30 group flex items-end justify-end p-0.5"
            title="Puxar pelo canto para redimensionar"
          >
            <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-slate-500 group-hover:border-indigo-400 rounded-br-sm transition" />
          </div>

          {/* 4 Edges for smooth resizing */}
          {/* Top edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'n')}
            className="absolute top-0 left-4 right-4 h-1.5 cursor-ns-resize z-20 hover:bg-indigo-500/30 transition"
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 's')}
            className="absolute bottom-0 left-4 right-4 h-1.5 cursor-ns-resize z-20 hover:bg-indigo-500/30 transition"
          />
          {/* Left edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'w')}
            className="absolute left-0 top-4 bottom-4 w-1.5 cursor-ew-resize z-20 hover:bg-indigo-500/30 transition"
          />
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'e')}
            className="absolute right-0 top-4 bottom-4 w-1.5 cursor-ew-resize z-20 hover:bg-indigo-500/30 transition"
          />
        </>
      )}
    </div>
  );
};

const FloatingAIAssistantContent: React.FC<{ conversationId?: string }> = ({ conversationId }) => {
  const { conversations } = useHelpdesk();
  const conv = conversationId ? conversations.find((c) => c.id === conversationId) : null;
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleQuickAction = async (action: string) => {
    setLoading(true);
    setAiOutput(null);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          vertical: conv?.verticalName || 'Geral',
          context: `Cliente: ${conv?.clientName || 'Geral'}. Protocolo: ${conv?.protocol || 'N/A'}.`,
          conversationHistory: conv?.messages.map((m) => `${m.senderName}: ${m.content}`) || [],
        }),
      });
      const data = await res.json();
      setAiOutput(data.result || 'Sem resposta.');
    } catch {
      setAiOutput('Erro ao conectar com a IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 space-y-3 text-xs overflow-y-auto">
      <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-lg p-2.5 text-indigo-200">
        <div className="flex items-center gap-1.5 font-medium text-xs mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Copiloto IA Integrado (Gemini 3.8 Flash)
        </div>
        <p className="text-[11px] text-indigo-300/80">
          Gere respostas profissionais, resuma ocorrências e consulte resoluções em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleQuickAction('suggest_response')}
          disabled={loading}
          className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left text-slate-200 hover:text-white transition"
        >
          <div className="font-medium text-[11px]">Sugerir Resposta</div>
          <div className="text-[9px] text-slate-400">Resposta cordial e técnica</div>
        </button>
        <button
          onClick={() => handleQuickAction('summarize')}
          disabled={loading}
          className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left text-slate-200 hover:text-white transition"
        >
          <div className="font-medium text-[11px]">Resumir Chamado</div>
          <div className="text-[9px] text-slate-400">Pontos chave da conversa</div>
        </button>
        <button
          onClick={() => handleQuickAction('identify_problem')}
          disabled={loading}
          className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left text-slate-200 hover:text-white transition"
        >
          <div className="font-medium text-[11px]">Diagnosticar Causa</div>
          <div className="text-[9px] text-slate-400">Identificar inconsistência</div>
        </button>
        <button
          onClick={() => handleQuickAction('suggest_solution')}
          disabled={loading}
          className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left text-slate-200 hover:text-white transition"
        >
          <div className="font-medium text-[11px]">Passo a Passo</div>
          <div className="text-[9px] text-slate-400">Procedimento de resolução</div>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-6 text-indigo-400 text-xs gap-2">
          <Sparkles className="w-4 h-4 animate-spin" />
          Processando análise com Gemini IA...
        </div>
      )}

      {aiOutput && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-slate-200 leading-relaxed text-xs">
          <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold mb-1">Resultado:</div>
          <div className="whitespace-pre-wrap">{aiOutput}</div>
        </div>
      )}
    </div>
  );
};
