import React, { useState, useEffect, useRef } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Conversation, ChatMessage } from '../../types';
import { ClientProfileDrawer } from '../../components/helpdesk/ClientProfileDrawer';
import { ClientHistoryModal } from '../../components/helpdesk/ClientHistoryModal';
import { CloseTicketFlowModal } from '../../components/helpdesk/CloseTicketFlowModal';
import { EmptyChatIllustration } from '../../components/helpdesk/EmptyChatIllustration';
import { StartAttendanceModal } from '../../components/helpdesk/StartAttendanceModal';
import { TagsManagementModal } from '../../components/helpdesk/TagsManagementModal';
import { DevChatModal } from '../../components/helpdesk/DevChatModal';
import { GlobalHistoryModal } from '../../components/helpdesk/GlobalHistoryModal';
import { KanbanBoardModal } from '../../components/helpdesk/KanbanBoardModal';
import { NormalKanbanView } from '../../components/helpdesk/NormalKanbanView';
import { NormalDevView } from '../../components/helpdesk/NormalDevView';
import { NormalKnowledgeBaseView } from '../../components/helpdesk/NormalKnowledgeBaseView';
import { NormalHistoryView } from '../../components/helpdesk/NormalHistoryView';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  UserCheck,
  Clock,
  Sparkles,
  Send,
  Paperclip,
  CheckCheck,
  Check,
  Bot,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  Smile,
  Mic,
  Volume2,
  X,
  Plus,
  MoreVertical,
  History,
  Image,
  Zap,
  ArrowLeft,
  Trash2,
  Play,
  Pause,
  FileText,
  Music,
  Columns,
  Tag as TagIcon,
  Code2,
  Sliders,
  Reply,
  Pin,
  Star,
  Forward,
  BookOpen,
} from 'lucide-react';
import { IPTechLogo } from '../../components/common/IPTechLogo';
import { SidebarProfileMenu } from '../../components/layout/SidebarProfileMenu';
import { SidebarNotificationsMenu } from '../../components/layout/SidebarNotificationsMenu';
import { MinimizedConversationsGrid } from '../../components/helpdesk/MinimizedConversationsGrid';
import { MessageContextMenu } from '../../components/helpdesk/MessageContextMenu';
import { MessageDetailsModal } from '../../components/helpdesk/MessageDetailsModal';
import { ForwardMessageModal } from '../../components/helpdesk/ForwardMessageModal';
import { EditMessageModal } from '../../components/helpdesk/EditMessageModal';
import { MetaAiModal } from '../../components/helpdesk/MetaAiModal';

// Playable WhatsApp-style Voice Note Component
const AudioMessagePlayer: React.FC<{ url?: string; duration?: string; isClient?: boolean }> = ({
  url,
  duration,
  isClient,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2.5 py-1 px-0.5 min-w-[200px]">
      <audio
        ref={audioRef}
        src={url || 'https://actions.google.com/sounds/v1/ambiences/office.ogg'}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
          isClient
            ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
            : 'bg-emerald-800 hover:bg-emerald-900 text-white'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Waveform Visualization Bars */}
      <div className="flex-1 flex items-center gap-0.5 h-5">
        {[40, 75, 30, 90, 55, 80, 50, 100, 70, 45, 85, 60, 35, 75, 50, 85, 60, 40].map((h, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-all duration-150 ${
              isPlaying ? (isClient ? 'bg-emerald-400 animate-pulse' : 'bg-white animate-pulse') : isClient ? 'bg-slate-500' : 'bg-emerald-200/80'
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <span className="text-[10px] font-mono opacity-80 shrink-0">
        {duration || '00:12'}
      </span>
    </div>
  );
};

const EMOJI_CATEGORIES = [
  {
    name: 'Frequentes',
    emojis: [
      '👍', '❤️', '👏', '🙏', '😊', '😂', '🔥', '🎉', '✅', '🤝', '😉', '⭐', '🚀', '💡',
      '⏰', '🎯', '🙌', '🤩', '💪', '✨', '💯', '👀', '⚡', '😎', '☕', '💼', '👌', '🆗', '💬'
    ],
  },
  {
    name: 'Expressões',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🙂', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😋', '😜', '🤪', '🤓', '😎', '🤗', '🤔', '🤐', '😐', '😴', '😷', '🥳', '🧐'
    ],
  },
  {
    name: 'Mãos & Gestos',
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤝', '✌️', '🤞', '🤙', '👊', '🖐️', '✋', '👋', '👌',
      '✍️', '🙏', '💪', '👈', '👉', '👆', '👇', '🤳'
    ],
  },
  {
    name: 'Trabalho',
    emojis: [
      '📁', '📂', '📄', '📋', '📌', '📎', '💼', '💻', '🖥️', '📱', '📞', '📧', '✉️', '📊',
      '📈', '📉', '⚙️', '🔒', '🔑', '⏰', '⏳', '💡', '🎯', '🏷️', '📝'
    ],
  },
  {
    name: 'Símbolos',
    emojis: [
      '✅', '❌', '⚠️', 'ℹ️', '🔔', '📢', '💬', '🗨️', '💭', '🚀', '⭐', '🌟', '💯', '🟢',
      '🟡', '🔴', '🔵', '🟣', '❓', '❗', '➕', '➖'
    ],
  },
];

export const HelpdeskInboxView: React.FC = () => {
  const {
    navigate,
    conversations,
    setConversations,
    currentUser,
    verticals,
    attendConversation,
    sendMessage,
    transferConversation,
    closeConversation,
    reopenConversation,
    openFloatingWindow,
    slashCommands,
    quickMessages,
    playNotificationSound,
    simulateIncomingClientMessage,
    addMediaToConversation,
    tags,
    addTagToConversation,
    removeTagFromConversation,
    startConversationWithContact,
    isFloatingModeActive,
    setIsFloatingModeActive,
    isF2GridActive,
    setIsF2GridActive,
    toggleFloatingMode,
    minimizeAllFloatingWindows,
    restoreAllFloatingWindows,
    openAllUserConversationsFloating,
    floatingWindows,
    updateMessage,
    deleteMessage,
    toggleMessageReaction,
    togglePinMessage,
    toggleStarMessage,
  } = useHelpdesk();

  // Context Menu and Message Tools (Right-click tools)
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    message: ChatMessage;
  } | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
  const [detailsModalMessage, setDetailsModalMessage] = useState<ChatMessage | null>(null);
  const [forwardModalMessage, setForwardModalMessage] = useState<ChatMessage | null>(null);
  const [editModalMessage, setEditModalMessage] = useState<ChatMessage | null>(null);
  const [metaAiModalMessage, setMetaAiModalMessage] = useState<ChatMessage | null>(null);

  // Resizable Sidebar Width (Mouse adjustable - Request 3)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('helpdesk_sidebar_width');
      return saved ? parseInt(saved, 10) : 68;
    } catch {
      return 68;
    }
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState<boolean>(false);

  // Resizable Inbox Width State
  const [inboxWidth, setInboxWidth] = useState<number>(360);
  const [isResizingInbox, setIsResizingInbox] = useState<boolean>(false);

  // Active View Mode ('inbox' | 'kanban' | 'dev' | 'history' | 'knowledge')
  const [activeNormalView, setActiveNormalView] = useState<'inbox' | 'kanban' | 'dev' | 'history' | 'knowledge'>('inbox');

  // New Modals (Requests 3 & 4)
  const [startAttendanceModalOpen, setStartAttendanceModalOpen] = useState(false);
  const [tagsManagementModalOpen, setTagsManagementModalOpen] = useState(false);
  const [devChatModalOpen, setDevChatModalOpen] = useState(false);
  const [globalHistoryModalOpen, setGlobalHistoryModalOpen] = useState(false);
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false);

  // Inline Tag Picker for Conversation Header (Request 5)
  const [tagPickerOpen, setTagPickerOpen] = useState(false);

  // Filter Dropdown state for dynamic responsive hiding into filter icon (Request 5)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleFilterClickOutside = (e: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };
    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleFilterClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleFilterClickOutside);
    };
  }, [filterDropdownOpen]);

  // Atalhos de Teclado F4 e F2 (Request do Usuário)
  // F4: Ativa/Desativa o modo de tela de conversa flutuante; quando ativo, todas as conversas do usuário em popup flutuante e área de conversa vazia
  // F2: Só deve funcionar se as telas flutuantes estiverem ativas! Popups flutuantes ficam minimizadas em linhas e colunas na área vazia
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        toggleFloatingMode();
        setSelectedConvId(null);
      } else if (e.key === 'F2') {
        e.preventDefault();
        // A funcionalidade da tecla "F2" só deve funcionar se a opção de telas flutuantes estiver ativa
        if (isFloatingModeActive) {
          if (isF2GridActive) {
            restoreAllFloatingWindows();
          } else {
            minimizeAllFloatingWindows();
          }
          setSelectedConvId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFloatingMode, minimizeAllFloatingWindows, restoreAllFloatingWindows, isFloatingModeActive, isF2GridActive]);

  // Mouse move handler for resizing sidebar and inbox list width with mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const clamped = Math.min(Math.max(e.clientX, 60), 260);
        setSidebarWidth(clamped);
      }
      if (isResizingInbox) {
        const calculated = e.clientX - sidebarWidth;
        const clamped = Math.min(Math.max(calculated, 260), 650);
        setInboxWidth(clamped);
      }
    };

    const handleMouseUp = () => {
      if (isResizingSidebar) {
        setIsResizingSidebar(false);
        try {
          localStorage.setItem('helpdesk_sidebar_width', sidebarWidth.toString());
        } catch {}
      }
      if (isResizingInbox) {
        setIsResizingInbox(false);
      }
    };

    if (isResizingSidebar || isResizingInbox) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingSidebar, isResizingInbox, sidebarWidth]);

  // Mobile navigation pane ('inbox' list vs 'chat' conversation)
  const [mobilePane, setMobilePane] = useState<'inbox' | 'chat'>('inbox');

  // Active filter tab
  const [activeTab, setActiveTab] = useState<'Pendentes' | 'Minhas' | 'Em atendimento' | 'Encerradas' | 'Todas'>('Pendentes');
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Conversation
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  // Message input state
  const [inputText, setInputText] = useState('');
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashSearch, setSlashSearch] = useState('');
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const [quickReplySearch, setQuickReplySearch] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);

  // Attachment Picker Modal
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);

  // Audio Recording State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecordingAudio = () => {
    setIsRecordingAudio(true);
    setRecordingSeconds(0);
    playNotificationSound();
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const cancelRecordingAudio = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingAudio(false);
    setRecordingSeconds(0);
  };

  const sendRecordedAudio = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    const duration = recordingSeconds || 1;
    const mins = Math.floor(duration / 60).toString().padStart(2, '0');
    const secs = (duration % 60).toString().padStart(2, '0');
    const durationStr = `${mins}:${secs}`;

    if (activeConv) {
      addMediaToConversation(activeConv.id, {
        title: `Mensagem de Voz (${durationStr})`,
        url: 'https://actions.google.com/sounds/v1/ambiences/office.ogg',
        type: 'audio',
        senderType: 'technician',
        senderName: currentUser.name,
        size: `${(duration * 0.12).toFixed(1)} MB`,
      });
    }

    setIsRecordingAudio(false);
    setRecordingSeconds(0);
  };

  // AI Assistant Drawer
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Client Profile Lateral Drawer (WhatsApp Profile & Medias)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  // Client History Search & Export Modal (PDF / Image)
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Close Ticket Flow Modal (2 Steps: Choice & Cataloging)
  const [closeFlowModalOpen, setCloseFlowModalOpen] = useState(false);

  // Transfer Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetVerticalId, setTargetVerticalId] = useState(verticals[0]?.id || '');
  const [transferNote, setTransferNote] = useState('');

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // RBAC: If technician has limited verticals, only show those!
    if (currentUser.role === 'technical_user' && currentUser.verticals.length > 0) {
      if (!currentUser.verticals.includes(c.verticalId)) {
        return false;
      }
    }

    // Tab filter
    if (activeTab === 'Pendentes' && c.status !== 'Pendente') return false;
    if (activeTab === 'Minhas' && c.assignedTechnicianId !== currentUser.id) return false;
    if (activeTab === 'Em atendimento' && c.status !== 'Em atendimento') return false;
    if (activeTab === 'Encerradas' && c.status !== 'Encerrado') return false;

    // Vertical filter
    if (selectedVertical !== 'all' && c.verticalId !== selectedVertical) return false;

    // Search filter
    if (searchTerm) {
      const match =
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastMessageSnippet.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  // Active conversation is set when selectedConvId is chosen; if null, shows empty illustration state
  const activeConv = selectedConvId ? (conversations.find((c) => c.id === selectedConvId) || null) : null;

  // Handle slash commands in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.startsWith('/')) {
      setSlashMenuOpen(true);
      setSlashSearch(val.slice(1).toLowerCase());
    } else {
      setSlashMenuOpen(false);
    }
  };

  const applySlashCommand = (template: string) => {
    if (!activeConv) return;
    const replaced = template
      .replace(/{{cliente}}/g, activeConv.clientName)
      .replace(/{{tecnico}}/g, currentUser.name)
      .replace(/{{empresa}}/g, 'Helpdesk Omnichannel Gov')
      .replace(/{{vertical}}/g, activeConv.verticalName)
      .replace(/{{protocolo}}/g, activeConv.protocol)
      .replace(/{{data}}/g, new Date().toLocaleDateString('pt-BR'))
      .replace(/{{hora}}/g, new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    setInputText(replaced);
    setSlashMenuOpen(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !inputText.trim()) return;
    sendMessage(
      activeConv.id,
      inputText.trim(),
      'text',
      undefined,
      replyingToMessage
        ? {
            id: replyingToMessage.id,
            senderName: replyingToMessage.senderName,
            content: replyingToMessage.content,
          }
        : undefined
    );
    setInputText('');
    setReplyingToMessage(null);
    setSlashMenuOpen(false);
  };

  const handleSimulateClientReply = () => {
    if (!activeConv) return;
    const replies = [
      'Entendi perfeitamente. Acabei de conferir o recibo aqui e deu certo!',
      'Segue em anexo a imagem do erro que apareceu na tela.',
      'Obrigado pelo esclarecimento! A folha foi validada com sucesso.',
      'Ainda estamos com dúvida na alíquota. Poderia verificar o cadastro da rubrica?',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessageSnippet: reply,
              lastMessageAt: timeStr,
              messages: [
                ...c.messages,
                {
                  id: 'm-' + Date.now(),
                  conversationId: c.id,
                  senderType: 'client',
                  senderName: c.clientName,
                  content: reply,
                  type: 'text',
                  createdAt: timeStr,
                  status: 'delivered',
                },
              ],
            }
          : c
      )
    );
    playNotificationSound();
  };

  const handleAiAction = async (action: string) => {
    if (!activeConv) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt: inputText,
          vertical: activeConv.verticalName,
          context: `Cliente: ${activeConv.clientName}. Protocolo: ${activeConv.protocol}.`,
          conversationHistory: activeConv.messages.map((m) => `${m.senderName}: ${m.content}`),
        }),
      });
      const data = await res.json();
      setAiResult(data.result);
    } catch {
      setAiResult('Falha na comunicação com o assistente Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  const isSidebarExpanded = sidebarWidth > 80;

  return (
    <div className="flex-1 min-h-0 flex overflow-hidden h-screen max-h-screen bg-slate-950 select-none">
      {/* Barra de Menu Lateral da Área de Atendimento (Ajustável com mouse, com Logo IPTech, Notificações e Perfil) */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="relative bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-3 shrink-0 z-40 select-none transition-[width] duration-75"
      >
        <div className="flex flex-col items-center gap-2.5 px-2 overflow-y-auto overflow-x-hidden flex-1">
          {/* Logo IPTech e Nome na Barra Lateral (Request 2) */}
          <div
            className={`flex items-center gap-2.5 w-full py-1 ${
              isSidebarExpanded ? 'justify-start px-1' : 'justify-center'
            }`}
            title="IPTech Helpdesk & Atendimento Omnichannel"
          >
            <IPTechLogo className="w-8 h-8 drop-shadow-md shrink-0" />
            {isSidebarExpanded && (
              <div className="min-w-0 flex-1 truncate">
                <div className="font-bold text-white text-sm tracking-wide leading-tight">IPTech</div>
                <div className="text-[9px] text-emerald-400 font-semibold leading-none">Helpdesk</div>
              </div>
            )}
          </div>

          {/* Atalho para Painel de Gestão (se tiver permissão) */}
          {currentUser.role !== 'technical_user' && (
            <button
              type="button"
              onClick={() => navigate('/gestao/dashboard')}
              className={`rounded-xl flex items-center transition cursor-pointer text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-1.5 gap-2.5 text-xs font-semibold'
                  : 'w-10 h-10 justify-center'
              }`}
              title="Acessar Painel de Gestão Administrativa"
            >
              <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate text-xs">Painel Gestão</span>
              )}
            </button>
          )}

          <div className="w-full border-t border-slate-800 my-0.5" />

          {/* Itens de Navegação */}
          <nav className="flex flex-col gap-1 w-full">
            {/* Atendimento */}
            <button
              type="button"
              onClick={() => setActiveNormalView('inbox')}
              className={`rounded-xl flex items-center transition cursor-pointer group ${
                activeNormalView === 'inbox'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
              } ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Atendimento"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">Atendimento</span>
              )}
            </button>

            {/* Bases de Conhecimento (Substitui Agente IA na barra lateral) */}
            <button
              type="button"
              onClick={() => setActiveNormalView(activeNormalView === 'knowledge' ? 'inbox' : 'knowledge')}
              className={`rounded-xl flex items-center transition cursor-pointer group ${
                activeNormalView === 'knowledge'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
              } ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Bases de Conhecimento"
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
              </div>
              {isSidebarExpanded && (
                <span className="truncate">Bases de conhecimento</span>
              )}
            </button>

            {/* Kanban */}
            <button
              type="button"
              onClick={() => setActiveNormalView(activeNormalView === 'kanban' ? 'inbox' : 'kanban')}
              className={`rounded-xl flex items-center transition cursor-pointer group ${
                activeNormalView === 'kanban'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              } ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Quadro Kanban de Chamados"
            >
              <Columns className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">Kanban</span>
              )}
            </button>

            {/* Etiquetas */}
            <button
              type="button"
              onClick={() => setTagsManagementModalOpen(true)}
              className={`rounded-xl flex items-center text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer group relative ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Gestão de Etiquetas"
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                {!isSidebarExpanded && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-mono px-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tags.length}
                  </span>
                )}
              </div>
              {isSidebarExpanded && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">Etiquetas</span>
                  <span className="text-[9px] font-mono px-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tags.length}
                  </span>
                </div>
              )}
            </button>

            {/* Dev */}
            <button
              type="button"
              onClick={() => setActiveNormalView(activeNormalView === 'dev' ? 'inbox' : 'dev')}
              className={`rounded-xl flex items-center transition cursor-pointer group ${
                activeNormalView === 'dev'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              } ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Canal de Desenvolvimento / Engenharia"
            >
              <Code2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">Engenharia Dev</span>
              )}
            </button>

            {/* Histórico */}
            <button
              type="button"
              onClick={() => setActiveNormalView(activeNormalView === 'history' ? 'inbox' : 'history')}
              className={`rounded-xl flex items-center transition cursor-pointer group ${
                activeNormalView === 'history'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/60'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
              } ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-medium'
                  : 'w-10 h-10 mx-auto justify-center'
              }`}
              title="Histórico Geral de Todas as Conversas"
            >
              <History className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">Histórico</span>
              )}
            </button>

            {/* Novo Atendimento */}
            <button
              type="button"
              onClick={() => setStartAttendanceModalOpen(true)}
              className={`rounded-xl flex items-center bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition cursor-pointer group ${
                isSidebarExpanded
                  ? 'w-full px-2.5 py-2 gap-2.5 text-xs font-semibold mt-1'
                  : 'w-10 h-10 mx-auto justify-center mt-1'
              }`}
              title="Iniciar Novo Atendimento por Entidade"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">Novo Atendimento</span>
              )}
            </button>
          </nav>
        </div>

        {/* Rodapé da Barra Lateral:
            4 - Ícone de notificação logo acima do ícone de perfil
            1 - Ícone de perfil no lugar do botão "Novo" com popover de status, modo claro/escuro, desconectar, etc. */}
        <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-slate-800 w-full px-2 shrink-0">
          {/* Notificações Push (acima do perfil) */}
          <SidebarNotificationsMenu isExpanded={isSidebarExpanded} />

          {/* Ícone de Perfil no lugar do botão "Novo" */}
          <SidebarProfileMenu isExpanded={isSidebarExpanded} />
        </div>

        {/* Ajuste com o mouse da barra lateral (Request 3) */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizingSidebar(true);
          }}
          className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/60 transition z-30 group ${
            isResizingSidebar ? 'bg-indigo-500' : ''
          }`}
          title="Arraste para ajustar a largura da barra lateral"
        >
          <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-indigo-400 group-active:bg-indigo-400 rounded-full mx-auto my-auto absolute top-1/2 -translate-y-1/2 right-0.5" />
        </div>
      </aside>

      {/* Área Principal de Conteúdo / Workspace */}
      <div className="flex-1 min-h-0 flex overflow-hidden w-full relative">
        {activeNormalView === 'kanban' ? (
          <NormalKanbanView
            onBackToInbox={() => setActiveNormalView('inbox')}
          onOpenConversation={(convId) => {
            setSelectedConvId(convId);
            setActiveNormalView('inbox');
            setMobilePane('chat');
          }}
        />
      ) : activeNormalView === 'dev' ? (
        <NormalDevView onBackToInbox={() => setActiveNormalView('inbox')} />
      ) : activeNormalView === 'history' ? (
        <NormalHistoryView
          onBackToInbox={() => setActiveNormalView('inbox')}
          onOpenConversation={(convId) => {
            setSelectedConvId(convId);
            setActiveNormalView('inbox');
            setMobilePane('chat');
          }}
        />
      ) : activeNormalView === 'knowledge' ? (
        <NormalKnowledgeBaseView
          onBackToInbox={() => setActiveNormalView('inbox')}
          onUseSnippetInChat={(snippet) => {
            setInputText(snippet);
            setActiveNormalView('inbox');
          }}
        />
      ) : (
        <>
          {/* Column 1: Inbox List Panel */}
      <div
        style={{
          width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${inboxWidth}px` : undefined,
        }}
        className={`w-full md:w-auto bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 ${
          mobilePane === 'chat' && activeConv ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Inbox Header & Search */}
        <div className="p-3.5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Atendimento
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, protocolo ou texto..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Tabs Dinâmicos com Ícone de Filtro (Request 5: conforme a área de atendimento é ajustada essas opções vão ficando ocultas dentro de um ícone de filtro) */}
          {(() => {
            const ALL_FILTER_TABS = ['Pendentes', 'Minhas', 'Em atendimento', 'Encerradas', 'Todas'] as const;

            // Determina quantas abas ficam visíveis de acordo com a largura da área de atendimento
            const visibleTabsCount = inboxWidth >= 520 ? 5 : inboxWidth >= 420 ? 3 : inboxWidth >= 330 ? 2 : 1;
            const visibleTabs = ALL_FILTER_TABS.slice(0, visibleTabsCount);
            const hiddenTabs = ALL_FILTER_TABS.slice(visibleTabsCount);
            const isHiddenTabActive = hiddenTabs.includes(activeTab as any);

            const getCount = (tab: typeof ALL_FILTER_TABS[number]) => {
              return conversations.filter((c) => {
                if (tab === 'Pendentes') return c.status === 'Pendente';
                if (tab === 'Minhas') return c.assignedTechnicianId === currentUser.id;
                if (tab === 'Em atendimento') return c.status === 'Em atendimento';
                if (tab === 'Encerradas') return c.status === 'Encerrado';
                return true;
              }).length;
            };

            return (
              <div className="flex items-center gap-1 pb-1 text-[11px] relative">
                {/* Abas Visíveis */}
                <div className="flex items-center gap-1 overflow-x-hidden min-w-0 flex-1">
                  {visibleTabs.map((tab) => {
                    const isActive = activeTab === tab;
                    const count = getCount(tab);

                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[90px]">{tab}</span>
                        <span className={`text-[10px] px-1 rounded-full ${isActive ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Ícone de Filtro onde ficam as opções ocultas conforme a área de atendimento é ajustada */}
                {hiddenTabs.length > 0 && (
                  <div className="relative shrink-0" ref={filterDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer border ${
                        isHiddenTabActive || filterDropdownOpen
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-750'
                      }`}
                      title={`Mais filtros (${hiddenTabs.length} opções ocultas)`}
                    >
                      <Filter className="w-3.5 h-3.5 text-emerald-300" />
                      {isHiddenTabActive ? (
                        <span className="truncate max-w-[80px] font-bold text-[11px]">
                          {activeTab}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-700 px-1 py-0.2 rounded-full font-mono text-slate-300">
                          +{hiddenTabs.length}
                        </span>
                      )}
                    </button>

                    {/* Popover / Menu Dropdown do Ícone de Filtro */}
                    {filterDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                          <span>Opções de Filtro</span>
                          <span className="text-emerald-400 font-mono text-[9px]">Filtro Ativo</span>
                        </div>

                        <div className="space-y-0.5">
                          {ALL_FILTER_TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            const count = getCount(tab);
                            const isHidden = hiddenTabs.includes(tab);

                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                  setActiveTab(tab);
                                  setFilterDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer text-left ${
                                  isActive
                                    ? 'bg-emerald-600/30 text-emerald-200 font-bold border border-emerald-500/40'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                                  <span className="truncate">{tab}</span>
                                  {isHidden && (
                                    <span className="text-[9px] text-slate-500 font-normal">(oculto)</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                                    {count}
                                  </span>
                                  {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {filteredConversations.map((c) => {
            const isSelected = activeConv?.id === c.id;
            const vert = verticals.find((v) => v.id === c.verticalId);
            const isPending = c.status === 'Pendente';

            return (
              <div
                key={c.id}
                onClick={() => {
                  if (isFloatingModeActive) {
                    openFloatingWindow(c.clientName, 'conversation', c.id);
                  } else {
                    setSelectedConvId(c.id);
                    setMobilePane('chat');
                  }
                }}
                className={`p-3.5 cursor-pointer transition text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-end mb-1">
                    <span className="text-[10px] text-slate-500 font-mono">{c.lastMessageAt}</span>
                  </div>

                  <div className="flex items-start gap-2.5 mt-1">
                    <img
                      src={c.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={c.clientName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{c.clientName}</div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 line-clamp-1">
                        {c.lastMessageSnippet}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60">
                  {/* Badge de Sistema / Vertical maior e mais legível */}
                  <span
                    className="text-xs px-3 py-1 rounded-lg font-bold border inline-flex items-center gap-1.5 shadow-sm transition"
                    style={{
                      backgroundColor: `${vert?.color || '#3B82F6'}25`,
                      borderColor: `${vert?.color || '#3B82F6'}55`,
                      color: vert?.color || '#93C5FD',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: vert?.color || '#3B82F6' }}
                    />
                    <span>{c.verticalName}</span>
                  </span>

                  {isPending ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        attendConversation(c.id);
                        setSelectedConvId(c.id);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>ATENDER</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 truncate max-w-[140px] font-medium">
                      {c.assignedTechnicianName || c.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="text-center py-16 px-4 text-slate-500 text-xs">
              Nenhum chamado encontrado nesta aba de atendimento.
            </div>
          )}
        </div>
      </div>

      {/* Barra divisória de redimensionamento de largura (Request 1) */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizingInbox(true);
        }}
        className={`hidden md:flex w-2 hover:w-2.5 cursor-col-resize items-center justify-center bg-slate-900 hover:bg-emerald-600/30 border-r border-slate-800 transition-all select-none z-10 group ${
          isResizingInbox ? 'bg-emerald-600/40 w-2.5 ring-1 ring-emerald-500' : ''
        }`}
        title="Arraste para aumentar ou diminuir a largura da lista de atendimento"
      >
        <div className="h-10 w-1 rounded-full bg-slate-700 group-hover:bg-emerald-400 group-active:bg-emerald-300 transition-colors" />
      </div>

      {/* Column 2: Active Conversation WhatsApp Panel (Se modo flutuante inativo) */}
      {activeConv && !isFloatingModeActive ? (
        <div className={`flex-1 flex flex-col overflow-hidden bg-slate-950 relative ${
          mobilePane === 'inbox' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Barra Minimalista do Chat (Cabeçalho Interativo com Opção de Etiqueta) */}
          <div className="min-h-[3.5rem] py-2 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-4 flex items-center justify-between shrink-0 transition-all gap-2 z-10">
            <div className="flex items-center gap-1 sm:gap-2.5 max-w-[75%] min-w-0">
              {/* Botão Voltar para Lista no Mobile */}
              <button
                type="button"
                onClick={() => setMobilePane('inbox')}
                className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
                title="Voltar para a lista de chamados"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>

              {/* Botão de Perfil do Cliente: Foto */}
              <div
                onClick={() => setProfileDrawerOpen(true)}
                className="relative shrink-0 cursor-pointer group"
                title="Ver perfil do cliente e mídias"
              >
                <img
                  src={activeConv.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={activeConv.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-emerald-400 group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Online" />
              </div>

              {/* Informações do Cliente & Etiquetas Abaixo do Nome (Request 5) */}
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    onClick={() => setProfileDrawerOpen(true)}
                    className="text-xs font-bold text-white hover:text-emerald-400 transition truncate cursor-pointer"
                    title={activeConv.clientName}
                  >
                    {activeConv.clientName}
                  </h2>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 hidden sm:inline-block">
                    {activeConv.protocol}
                  </span>
                </div>

                {/* Linha de Telefone & Vertical */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                  <span className="text-emerald-400 font-mono font-medium">{activeConv.clientPhone}</span>
                  <span>•</span>
                  <span className="text-slate-300 truncate">{activeConv.verticalName}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-slate-400 hidden md:inline truncate">
                    Técnico: <strong className="text-slate-300">{activeConv.assignedTechnicianName || '— Na Fila —'}</strong>
                  </span>
                </div>

                {/* Opção de 'Etiqueta' Abaixo do Nome (Request 5) */}
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {/* Etiquetas já vinculadas a este cliente */}
                  {activeConv.tags && activeConv.tags.map((tg) => (
                    <span
                      key={tg.id}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs"
                      style={{
                        backgroundColor: `${tg.color}25`,
                        borderColor: `${tg.color}60`,
                        color: tg.color,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tg.color }} />
                      <span className="truncate max-w-[120px]">{tg.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromConversation(activeConv.id, tg.id);
                        }}
                        className="hover:opacity-75 p-0.5 rounded cursor-pointer"
                        title={`Remover etiqueta ${tg.name}`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}

                  {/* Botão interativo '+ Etiqueta' para escolher existente ou criar nova */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTagPickerOpen(!tagPickerOpen);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-semibold transition cursor-pointer"
                      title="Adicionar ou criar etiqueta para este cliente"
                    >
                      <TagIcon className="w-2.5 h-2.5 text-amber-400" />
                      <span>+ Etiqueta</span>
                    </button>

                    {/* Popover / Seletor de Etiquetas */}
                    {tagPickerOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-7 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in"
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <TagIcon className="w-3.5 h-3.5 text-amber-400" />
                            Etiquetas do Cliente
                          </span>
                          <button
                            type="button"
                            onClick={() => setTagPickerOpen(false)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-[10px] text-slate-400 mb-2">
                          Selecione etiquetas existentes ou crie uma nova para este cliente:
                        </p>

                        {/* Lista de Etiquetas Cadastradas */}
                        <div className="max-h-40 overflow-y-auto space-y-1 mb-2 pr-1">
                          {tags.map((t) => {
                            const isAssigned = (activeConv.tags || []).some((tg) => tg.id === t.id);
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  if (isAssigned) {
                                    removeTagFromConversation(activeConv.id, t.id);
                                  } else {
                                    addTagToConversation(activeConv.id, t.id);
                                  }
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                                  isAssigned
                                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                                    : 'hover:bg-slate-800 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                                  <span className="truncate">{t.name}</span>
                                  <span className="text-[9px] text-slate-500 font-mono">
                                    ({t.type === 'entity' ? 'Entidade' : 'Sistema'})
                                  </span>
                                </div>
                                {isAssigned && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Botão de Criar Nova Etiqueta */}
                        <button
                          type="button"
                          onClick={() => {
                            setTagPickerOpen(false);
                            setTagsManagementModalOpen(true);
                          }}
                          className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Criar Nova Etiqueta</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Minimalistas do Cabeçalho */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Botão de Perfil / Mídias / Histórico rápido */}
              <button
                type="button"
                onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}
                className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  profileDrawerOpen
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                }`}
                title="Abrir perfil do WhatsApp e mídias"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline text-[11px] font-semibold text-emerald-400">Perfil</span>
              </button>

              {/* Botão de Janela Flutuante */}
              <button
                type="button"
                onClick={() => openFloatingWindow(activeConv.clientName, 'conversation', activeConv.id)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Destacar conversa em janela flutuante arrastável"
              >
                <Maximize2 className="w-4 h-4 text-indigo-400" />
              </button>

              {/* Copiloto IA Gemini */}
              <button
                type="button"
                onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
                className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  aiDrawerOpen
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
                }`}
                title="Copiloto IA Gemini"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">Copiloto</span>
              </button>

              {/* Transferir Atendimento */}
              <button
                type="button"
                onClick={() => setTransferModalOpen(true)}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Transferir atendimento"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              </button>

              {/* Encerrar ou Reabrir Chamado */}
              {activeConv.status === 'Encerrado' ? (
                <button
                  type="button"
                  onClick={() => reopenConversation(activeConv.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reabrir</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCloseFlowModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/70 hover:bg-red-900/80 border border-red-800/60 text-red-300 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95"
                  title="Encerrar atendimento com avaliação e catalogação"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Encerrar</span>
                </button>
              )}

              {/* Fechar conversa / Voltar para ilustração inicial */}
              <button
                type="button"
                onClick={() => setSelectedConvId(null)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Fechar conversa atual e ver tela de início"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pending Banner if not yet attended */}
          {activeConv.status === 'Pendente' && (
            <div className="bg-amber-950/70 border-b border-amber-800/60 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Chamado em espera na fila geral de {activeConv.verticalName}.</span>
              </div>
              <button
                onClick={() => attendConversation(activeConv.id)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                ASSUMIR ATENDIMENTO AGORA
              </button>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 select-text">
            {/* Pinned message banner if any message in conversation is pinned */}
            {activeConv.messages.some((m) => m.isPinned) && (
              <div className="sticky top-0 z-20 mb-3 p-2.5 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-300 shadow-md">
                <div className="flex items-center gap-2 min-w-0">
                  <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 rotate-45" />
                  <span className="font-semibold text-white shrink-0">Mensagem Fixada:</span>
                  <span className="text-slate-300 truncate text-[11px] italic">
                    "{activeConv.messages.find((m) => m.isPinned)?.content}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const pinned = activeConv.messages.find((m) => m.isPinned);
                    if (pinned) togglePinMessage(activeConv.id, pinned.id);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer shrink-0"
                >
                  Desafixar
                </button>
              </div>
            )}

            {activeConv.messages.map((m) => {
              const isClient = m.senderType === 'client';
              const isSystem = m.senderType === 'system';

              if (isSystem) {
                return (
                  <div key={m.id} className="text-center text-[11px] text-slate-400 py-1">
                    <span className="bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
                      {m.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                >
                  {/* Nome do Remetente em cima da mensagem apenas para o Cliente */}
                  {isClient && (
                    <div className="flex items-center gap-1.5 px-1 mb-1 justify-start">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {m.senderName || 'Cliente'}
                      </span>
                    </div>
                  )}

                  <div
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContextMenu({
                        position: { x: e.clientX, y: e.clientY },
                        message: m,
                      });
                    }}
                    className={`group/msg relative max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm transition cursor-pointer select-text ${
                      isClient
                        ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none hover:border-slate-700'
                        : 'bg-emerald-500 text-black rounded-tr-none hover:bg-emerald-400'
                    }`}
                    title="Clique com o botão direito para ferramentas da mensagem"
                  >
                    {/* Citação de Resposta (Reply Quote) */}
                    {m.replyTo && (
                      <div
                        className={`p-2 mb-2 rounded-xl border-l-4 text-[11px] leading-tight select-none ${
                          isClient
                            ? 'bg-slate-800/90 border-emerald-400 text-slate-300'
                            : 'bg-black/15 border-black/80 text-black/95 font-medium'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1">
                          <Reply className="w-3 h-3 shrink-0" />
                          <span>{m.replyTo.senderName}</span>
                        </div>
                        <div className="line-clamp-2 italic mt-0.5 opacity-90">
                          "{m.replyTo.content}"
                        </div>
                      </div>
                    )}

                    {!isClient ? (
                      <>
                        <div className="font-bold text-black text-xs sm:text-sm leading-tight">
                          {(m.senderName || currentUser.name).replace(/:$/, '')}:
                        </div>
                        <div className="font-normal text-black text-xs sm:text-sm leading-relaxed mt-0.5 whitespace-pre-wrap">
                          {m.content}
                        </div>
                      </>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}

                    <div className={`flex items-center justify-end gap-1.5 text-[9px] mt-1 font-mono ${isClient ? 'opacity-75' : 'text-black/75 font-medium'}`}>
                      {m.isStarred && (
                        <Star className={`w-3 h-3 ${isClient ? 'text-amber-400 fill-amber-400' : 'text-black fill-black'}`} />
                      )}
                      {m.isPinned && (
                        <Pin className={`w-3 h-3 rotate-45 ${isClient ? 'text-amber-400' : 'text-black'}`} />
                      )}
                      {m.editedAt && (
                        <span className="italic opacity-80">(editada)</span>
                      )}
                      <span>{m.createdAt}</span>
                      {!isClient && <CheckCheck className="w-3 h-3 text-black" />}
                    </div>
                  </div>

                  {/* Reações com Emojis */}
                  {m.reactions && m.reactions.length > 0 && (
                    <div className={`flex items-center gap-1 mt-1 px-1 ${isClient ? 'justify-start' : 'justify-end'}`}>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 shadow-xs text-xs">
                        {m.reactions.map((r, i) => (
                          <span
                            key={i}
                            onClick={() => toggleMessageReaction(activeConv.id, m.id, r)}
                            className="hover:scale-125 transition cursor-pointer select-none"
                            title="Remover reação"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slash Commands Dropdown Preview */}
          {slashMenuOpen && (
            <div className="absolute bottom-20 left-4 right-4 max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-60 overflow-y-auto">
              <div className="text-[10px] text-slate-400 font-semibold px-2 py-1 uppercase tracking-wider">
                Comandos de Atalho (Pressione para Injetar):
              </div>
              <div className="space-y-0.5">
                {slashCommands
                  .filter((cmd) => cmd.trigger.toLowerCase().includes(slashSearch))
                  .map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => applySlashCommand(cmd.content)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{cmd.trigger}</span>
                        <span className="text-slate-300 ml-2">{cmd.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{cmd.category}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Reaction Emojis Bar */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto select-none">
            <span className="text-[10px] text-slate-500 font-medium shrink-0 mr-1 hidden sm:inline">Reações rápidas:</span>
            {['👍', '❤️', '👏', '🙏', '😊', '😂', '🔥', '🎉', '✅', '🤝', '⭐', '🚀', '💡', '💯', '👌', '💬'].map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setInputText((prev) => prev + em)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-sm transition hover:scale-125 active:scale-95 cursor-pointer shrink-0"
                title={`Inserir ${em}`}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Banner de Resposta (Reply Quote Banner) */}
          {replyingToMessage && (
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  <Reply className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-emerald-400">
                    Respondendo a {replyingToMessage.senderName}
                  </div>
                  <p className="text-slate-300 truncate text-[11px] italic">
                    "{replyingToMessage.content}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyingToMessage(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition ml-2 shrink-0 cursor-pointer"
                title="Cancelar resposta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0 relative"
          >
            {/* Backdrop for popovers */}
            {(quickRepliesOpen || emojiPickerOpen) && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setQuickRepliesOpen(false);
                  setEmojiPickerOpen(false);
                }}
              />
            )}

            {isRecordingAudio ? (
              <div className="flex-1 flex items-center justify-between bg-slate-950 border border-red-500/50 rounded-xl px-3.5 py-2 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-xs font-bold text-red-400">Gravando áudio...</span>
                  <span className="text-xs font-mono font-semibold text-white px-2 py-0.5 rounded bg-slate-800">
                    {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  {/* Visualizer wave bars */}
                  <div className="hidden sm:flex items-center gap-0.5 h-4 ml-1">
                    {[40, 75, 30, 90, 55, 80, 50, 100, 70, 45, 85, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-red-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelRecordingAudio}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs transition cursor-pointer"
                    title="Descartar gravação"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </button>
                  <button
                    type="button"
                    onClick={sendRecordedAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-md cursor-pointer active:scale-95"
                    title="Enviar mensagem de voz"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Áudio</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Três pontinhos: Menu de Respostas Rápidas */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickRepliesOpen(!quickRepliesOpen);
                      setEmojiPickerOpen(false);
                    }}
                    className={`p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      quickRepliesOpen
                        ? 'bg-slate-700 text-indigo-300 ring-1 ring-indigo-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Respostas Rápidas"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {quickRepliesOpen && (
                    <div className="absolute bottom-12 left-0 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 mb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          Respostas Rápidas
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {quickMessages.length} opções
                        </span>
                      </div>

                      <div className="px-1 mb-2">
                        <input
                          type="text"
                          value={quickReplySearch}
                          onChange={(e) => setQuickReplySearch(e.target.value)}
                          placeholder="Buscar resposta..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {quickMessages
                          .filter(
                            (qm) =>
                              qm.name.toLowerCase().includes(quickReplySearch.toLowerCase()) ||
                              qm.content.toLowerCase().includes(quickReplySearch.toLowerCase()) ||
                              qm.category.toLowerCase().includes(quickReplySearch.toLowerCase())
                          )
                          .map((qm) => (
                            <button
                              key={qm.id}
                              type="button"
                              onClick={() => {
                                applySlashCommand(qm.content);
                                setQuickRepliesOpen(false);
                                setQuickReplySearch('');
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer text-xs group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200 group-hover:text-indigo-300">
                                  {qm.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                  {qm.category}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                {qm.content}
                              </div>
                            </button>
                          ))}

                        {quickMessages.length === 0 && (
                          <div className="p-3 text-center text-slate-500 text-xs">
                            Nenhuma resposta rápida cadastrada.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ícone de Emoji: Seletor de Emojis */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setEmojiPickerOpen(!emojiPickerOpen);
                      setQuickRepliesOpen(false);
                    }}
                    className={`p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      emojiPickerOpen
                        ? 'bg-slate-700 text-amber-400 ring-1 ring-amber-500'
                        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title="Inserir Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {emojiPickerOpen && (
                    <div className="absolute bottom-12 left-0 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-1 border-b border-slate-800 pb-1.5 mb-2 overflow-x-auto">
                        {EMOJI_CATEGORIES.map((cat, idx) => (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => setActiveEmojiCategory(idx)}
                            className={`px-2 py-1 rounded text-[10px] font-medium shrink-0 transition cursor-pointer ${
                              activeEmojiCategory === idx
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto p-1">
                        {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setInputText((prev) => prev + emoji);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-base flex items-center justify-center transition hover:scale-125 cursor-pointer active:scale-95"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  disabled={activeConv.status === 'Encerrado'}
                  placeholder={
                    activeConv.status === 'Encerrado'
                      ? 'Chamado encerrado. Reabra para responder.'
                      : 'Digite uma resposta ou use / para comandos...'
                  }
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                {/* Botão de Enviar Mensagem */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || activeConv.status === 'Encerrado'}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg transition shadow-md shadow-emerald-950/40 cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>

                {/* Botão para Gravar Áudio: Ao lado do botão de enviar a mensagem */}
                <button
                  type="button"
                  onClick={startRecordingAudio}
                  disabled={activeConv.status === 'Encerrado'}
                  className="p-2.5 bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50 text-slate-300 rounded-lg transition cursor-pointer shadow-sm group active:scale-95 disabled:opacity-40"
                  title="Gravar áudio para o cliente"
                >
                  <Mic className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                </button>
              </>
            )}
          </form>
        </div>
      ) : isFloatingModeActive && isF2GridActive ? (
        <MinimizedConversationsGrid
          onOpenInPanel={(convId) => {
            setSelectedConvId(convId);
            setIsFloatingModeActive(false);
            setIsF2GridActive(false);
          }}
        />
      ) : (
        <div className={`flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-center select-none overflow-y-auto relative ${
          mobilePane === 'inbox' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Imagem / Ilustração no Modelo da Imagem na Área Vazia (Request 3 e 4) */}
          <div className="relative mb-5 transform hover:scale-105 transition-transform duration-300">
            <EmptyChatIllustration className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 drop-shadow-2xl" />
          </div>

          <div className="max-w-md space-y-2 mb-5">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isFloatingModeActive ? 'Área de Conversa Liberada' : 'Nenhum Atendimento Selecionado'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isFloatingModeActive
                ? 'Todas as conversas do usuário estão abertas em popups flutuantes nesta área. Pressione F2 para organizá-las em linhas e colunas.'
                : 'Selecione um atendimento na lista à esquerda ou inicie um novo chamado selecionando uma entidade e seus contatos por etiquetas.'}
            </p>
          </div>

          {/* Botão abaixo da imagem: Iniciar atendimento (Request 3) */}
          <button
            type="button"
            onClick={() => setStartAttendanceModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/70 transition-all cursor-pointer flex items-center gap-2.5 active:scale-95 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Iniciar atendimento</span>
          </button>
        </div>
      )}

      {/* Column 3: AI Copilot Drawer (Side Panel) */}
      {aiDrawerOpen && activeConv && (
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right-10 duration-200">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Copiloto Gemini 3.8</span>
            </div>
            <button
              onClick={() => setAiDrawerOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            <div className="space-y-1.5">
              <button
                onClick={() => handleAiAction('suggest_response')}
                disabled={aiLoading}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-slate-200 font-medium transition"
              >
                <div>Sugerir Resposta Cordial</div>
                <div className="text-[10px] text-slate-400 font-normal">Baseada na vertical e histórico</div>
              </button>
              <button
                onClick={() => handleAiAction('summarize')}
                disabled={aiLoading}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-slate-200 font-medium transition"
              >
                <div>Resumir Conversa</div>
                <div className="text-[10px] text-slate-400 font-normal">Para passagem de turno ou ticket</div>
              </button>
              <button
                onClick={() => handleAiAction('identify_problem')}
                disabled={aiLoading}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-slate-200 font-medium transition"
              >
                <div>Diagnosticar Causa Raiz</div>
                <div className="text-[10px] text-slate-400 font-normal">Análise técnica do incidente</div>
              </button>
            </div>

            {aiLoading && (
              <div className="p-6 text-center text-indigo-400 text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Processando com IA...</span>
              </div>
            )}

            {aiResult && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-slate-200 leading-relaxed text-xs">
                <div className="font-semibold text-indigo-400 mb-1 text-[11px]">Sugestão:</div>
                <div className="whitespace-pre-wrap">{aiResult}</div>
                <button
                  onClick={() => {
                    setInputText(aiResult);
                    setAiDrawerOpen(false);
                  }}
                  className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold transition"
                >
                  Inserir no Rascunho
                </button>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
      </div>

      {/* Transfer Modal */}
      {transferModalOpen && activeConv && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">Transferir Atendimento</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vertical de Destino:</label>
                <select
                  value={targetVerticalId}
                  onChange={(e) => setTargetVerticalId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Motivo do Redirecionamento:</label>
                <textarea
                  rows={3}
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="Explique o motivo para a nova equipe..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 mt-4">
              <button
                onClick={() => setTransferModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 rounded text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  transferConversation(activeConv.id, targetVerticalId, undefined, undefined, transferNote);
                  setTransferModalOpen(false);
                  setTransferNote('');
                }}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 rounded font-semibold text-white"
              >
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column 4: Barra Lateral Direita - Perfil do WhatsApp, Mídias e Histórico */}
      {profileDrawerOpen && activeConv && (
        <ClientProfileDrawer
          conversation={activeConv}
          onClose={() => setProfileDrawerOpen(false)}
          onOpenHistory={() => {
            setProfileDrawerOpen(false);
            setHistoryModalOpen(true);
          }}
        />
      )}

      {/* Popups de Encerramento (2 Etapas: Escolha e Catalogação com campos obrigatórios) */}
      {closeFlowModalOpen && activeConv && (
        <CloseTicketFlowModal
          conversation={activeConv}
          isOpen={closeFlowModalOpen}
          onClose={() => setCloseFlowModalOpen(false)}
          onConfirmClose={(withSurvey, catalogData) => {
            closeConversation(activeConv.id, withSurvey, catalogData);
            setCloseFlowModalOpen(false);
          }}
        />
      )}

      {/* Popup de Histórico de Conversas (Busca por período, mensagens, frases e download PDF/Imagem) */}
      {historyModalOpen && activeConv && (
        <ClientHistoryModal
          clientName={activeConv.clientName}
          clientId={activeConv.clientId}
          clientPhone={activeConv.clientPhone}
          onClose={() => setHistoryModalOpen(false)}
        />
      )}

      {/* Modal de Iniciar Atendimento (Contatos por Entidade e Etiquetas - Requests 3 & 4) */}
      {startAttendanceModalOpen && (
        <StartAttendanceModal
          isOpen={startAttendanceModalOpen}
          onClose={() => setStartAttendanceModalOpen(false)}
          onSelectContact={(clientId, contactId, tagId) => {
            const newConv = startConversationWithContact(clientId, contactId, tagId);
            setSelectedConvId(newConv.id);
            setMobilePane('chat');
            setStartAttendanceModalOpen(false);
          }}
        />
      )}

      {/* Modal de Gestão de Etiquetas (Entidade & Sistema com cores aleatórias - Request 4) */}
      {tagsManagementModalOpen && (
        <TagsManagementModal
          isOpen={tagsManagementModalOpen}
          onClose={() => setTagsManagementModalOpen(false)}
          onTagCreated={(newTag) => {
            if (activeConv) {
              addTagToConversation(activeConv.id, newTag.id);
            }
          }}
        />
      )}

      {/* Modal de Conversa com o Desenvolvimento / Dev (Request 4) */}
      {devChatModalOpen && (
        <DevChatModal
          isOpen={devChatModalOpen}
          onClose={() => setDevChatModalOpen(false)}
        />
      )}

      {/* Modal de Histórico Geral de Todas as Conversas Salvas (Request 4) */}
      {globalHistoryModalOpen && (
        <GlobalHistoryModal
          isOpen={globalHistoryModalOpen}
          onClose={() => setGlobalHistoryModalOpen(false)}
        />
      )}

      {/* Modal do Quadro Kanban de Chamados (Request 4) */}
      {kanbanModalOpen && (
        <KanbanBoardModal
          isOpen={kanbanModalOpen}
          onClose={() => setKanbanModalOpen(false)}
          onSelectConversation={(convId) => {
            setSelectedConvId(convId);
            setMobilePane('chat');
            setKanbanModalOpen(false);
          }}
        />
      )}

      {/* Menu de Contexto do Botão Direito nas Mensagens (Ferramentas Funcionais) */}
      {contextMenu && activeConv && (
        <MessageContextMenu
          position={contextMenu.position}
          message={contextMenu.message}
          conversation={activeConv}
          onClose={() => setContextMenu(null)}
          onReply={(msg) => {
            setReplyingToMessage(msg);
          }}
          onAskAi={(msg) => {
            setMetaAiModalMessage(msg);
          }}
          onOpenDetails={(msg) => {
            setDetailsModalMessage(msg);
          }}
          onOpenForward={(msg) => {
            setForwardModalMessage(msg);
          }}
          onOpenEdit={(msg) => {
            setEditModalMessage(msg);
          }}
        />
      )}

      {/* Modal de Dados da Mensagem */}
      {detailsModalMessage && activeConv && (
        <MessageDetailsModal
          message={detailsModalMessage}
          conversation={activeConv}
          onClose={() => setDetailsModalMessage(null)}
        />
      )}

      {/* Modal de Encaminhar Mensagem */}
      {forwardModalMessage && activeConv && (
        <ForwardMessageModal
          message={forwardModalMessage}
          currentConversationId={activeConv.id}
          onClose={() => setForwardModalMessage(null)}
        />
      )}

      {/* Modal de Editar Mensagem */}
      {editModalMessage && activeConv && (
        <EditMessageModal
          message={editModalMessage}
          conversationId={activeConv.id}
          onClose={() => setEditModalMessage(null)}
        />
      )}

      {/* Modal Pergunte à Meta AI */}
      {metaAiModalMessage && (
        <MetaAiModal
          message={metaAiModalMessage}
          onClose={() => setMetaAiModalMessage(null)}
          onUseResponse={(text) => {
            setInputText(text);
          }}
        />
      )}
    </div>
  );
};
