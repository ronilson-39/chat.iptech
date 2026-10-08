import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserStatus,
  Vertical,
  Team,
  Client,
  WhatsAppNumber,
  Conversation,
  ChatMessage,
  MediaItem,
  QuickMessage,
  SlashCommand,
  Workflow,
  WorkspaceThread,
  DevelopmentTicket,
  KnowledgeArticle,
  AuditLog,
  FloatingWindow,
  OnboardingState,
  TicketStatus,
  TicketPriority,
  Tag,
  AppPushNotification,
} from '../types';
import {
  INITIAL_VERTICALS,
  INITIAL_TEAMS,
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_WHATSAPP_NUMBERS,
  INITIAL_CONVERSATIONS,
  INITIAL_QUICK_MESSAGES,
  INITIAL_SLASH_COMMANDS,
  INITIAL_WORKFLOW,
  INITIAL_THREADS,
  INITIAL_DEV_TICKETS,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ONBOARDING_STATE,
  INITIAL_TAGS,
} from '../data/mockData';

interface HelpdeskContextType {
  // Navigation & Authentication
  currentPath: string;
  navigate: (path: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateUserAvatar: (userId: string, avatarUrl: string) => void;
  userStatus: UserStatus;
  setUserStatus: (status: UserStatus) => void;
  isAuthenticated: boolean;
  logout: () => void;
  login: (user: User) => void;
  switchUserById: (userId: string) => void;
  hasPermission: (perm: string) => boolean;

  // Domain Entities
  verticals: Vertical[];
  setVerticals: React.Dispatch<React.SetStateAction<Vertical[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  whatsAppNumbers: WhatsAppNumber[];
  setWhatsAppNumbers: React.Dispatch<React.SetStateAction<WhatsAppNumber[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  quickMessages: QuickMessage[];
  setQuickMessages: React.Dispatch<React.SetStateAction<QuickMessage[]>>;
  slashCommands: SlashCommand[];
  setSlashCommands: React.Dispatch<React.SetStateAction<SlashCommand[]>>;
  workflow: Workflow;
  setWorkflow: React.Dispatch<React.SetStateAction<Workflow>>;
  threads: WorkspaceThread[];
  setThreads: React.Dispatch<React.SetStateAction<WorkspaceThread[]>>;
  devTickets: DevelopmentTicket[];
  setDevTickets: React.Dispatch<React.SetStateAction<DevelopmentTicket[]>>;
  knowledgeArticles: KnowledgeArticle[];
  setKnowledgeArticles: React.Dispatch<React.SetStateAction<KnowledgeArticle[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: string, details: string) => void;

  // Tags (Etiquetas de Entidade e Sistema)
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  createTag: (name: string, type: 'entity' | 'system', targetId?: string, targetName?: string, color?: string) => Tag;
  addTagToConversation: (conversationId: string, tagId: string) => void;
  removeTagFromConversation: (conversationId: string, tagId: string) => void;
  startConversationWithContact: (clientId: string, contactId: string, initialTagId?: string) => Conversation;

  // Onboarding
  onboarding: OnboardingState;
  updateOnboarding: (updater: (prev: OnboardingState) => OnboardingState) => void;
  runOnboardingTest: (testName: string) => Promise<'passed' | 'failed'>;
  activateOrganization: () => void;

  // Floating Windows
  floatingWindows: FloatingWindow[];
  openFloatingWindow: (title: string, type: 'conversation' | 'ai_assistant' | 'thread', dataId: string) => void;
  closeFloatingWindow: (id: string) => void;
  minimizeFloatingWindow: (id: string) => void;
  maximizeFloatingWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateFloatingWindowPos: (id: string, x: number, y: number, width: number, height: number) => void;
  isFloatingModeActive: boolean;
  setIsFloatingModeActive: (active: boolean) => void;
  isF2GridActive: boolean;
  setIsF2GridActive: (active: boolean) => void;
  toggleFloatingMode: () => void;
  minimizeAllFloatingWindows: () => void;
  restoreAllFloatingWindows: () => void;
  openAllUserConversationsFloating: (minimized?: boolean) => void;

  // Ticket Operations
  attendConversation: (conversationId: string) => void;
  sendMessage: (
    conversationId: string,
    content: string,
    type?: 'text' | 'image' | 'document' | 'audio',
    mediaUrl?: string,
    replyTo?: { id: string; senderName: string; content: string }
  ) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  toggleMessageReaction: (conversationId: string, messageId: string, reaction: string) => void;
  togglePinMessage: (conversationId: string, messageId: string) => void;
  toggleStarMessage: (conversationId: string, messageId: string) => void;
  forwardMessage: (sourceMessage: ChatMessage, targetConversationIds: string[]) => void;
  transferConversation: (conversationId: string, targetVerticalId: string, targetTeamId?: string, targetUserId?: string, note?: string) => void;
  closeConversation: (
    conversationId: string,
    sendFarewell: boolean,
    ticketDataOrRating?: { title: string; date: string; summary: string; satisfactionRating?: number } | number
  ) => void;
  addMediaToConversation: (
    conversationId: string,
    media: {
      title: string;
      url: string;
      type: 'image' | 'document' | 'audio';
      senderType: 'client' | 'technician';
      senderName: string;
      size?: string;
    }
  ) => void;
  reopenConversation: (conversationId: string) => void;
  simulateIncomingClientMessage: (clientId?: string, messageText?: string) => void;

  // Notification & Push
  playNotificationSound: () => void;
  activeToast: { title: string; message: string; type?: 'info' | 'success' | 'warning' } | null;
  setActiveToast: (toast: { title: string; message: string; type?: 'info' | 'success' | 'warning' } | null) => void;
  clearToast: () => void;
  pushNotifications: AppPushNotification[];
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<NotificationPermission>;
  dispatchPushNotification: (notif: {
    title: string;
    body: string;
    type: 'whatsapp_message' | 'kanban_task_assigned' | 'sla_warning' | 'system';
    data?: any;
  }) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

  // Theme (Dark / Light Mode)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Reset
  resetAllData: () => void;
}

const HelpdeskContext = createContext<HelpdeskContextType | undefined>(undefined);

const STORAGE_PREFIX = 'helpdesk_saas_v1_';

export const HelpdeskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname !== '/' && window.location.pathname ? window.location.pathname : '/gestao/dashboard';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/gestao/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // State with localStorage persistence
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [verticals, setVerticals] = useState<Vertical[]>(() => loadStored('verticals', INITIAL_VERTICALS));
  const [teams, setTeams] = useState<Team[]>(() => loadStored('teams', INITIAL_TEAMS));
  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [clients, setClients] = useState<Client[]>(() => loadStored('clients', INITIAL_CLIENTS));
  const [whatsAppNumbers, setWhatsAppNumbers] = useState<WhatsAppNumber[]>(() => loadStored('whatsapp', INITIAL_WHATSAPP_NUMBERS));
  const [conversations, setConversations] = useState<Conversation[]>(() => loadStored('conversations', INITIAL_CONVERSATIONS));
  const [quickMessages, setQuickMessages] = useState<QuickMessage[]>(() => loadStored('quick_messages', INITIAL_QUICK_MESSAGES));
  const [slashCommands, setSlashCommands] = useState<SlashCommand[]>(() => loadStored('slash_commands', INITIAL_SLASH_COMMANDS));
  const [workflow, setWorkflow] = useState<Workflow>(() => loadStored('workflow', INITIAL_WORKFLOW));
  const [threads, setThreads] = useState<WorkspaceThread[]>(() => loadStored('threads', INITIAL_THREADS));
  const [devTickets, setDevTickets] = useState<DevelopmentTicket[]>(() => loadStored('dev_tickets', INITIAL_DEV_TICKETS));
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(() => loadStored('kb', INITIAL_KNOWLEDGE_ARTICLES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStored('audit', INITIAL_AUDIT_LOGS));
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => loadStored('onboarding', INITIAL_ONBOARDING_STATE));
  const [tags, setTags] = useState<Tag[]>(() => loadStored('tags', INITIAL_TAGS));

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tags', JSON.stringify(tags));
  }, [tags]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'is_authenticated');
      if (saved !== null) {
        return saved === 'true';
      }
      return true;
    } catch {
      return true;
    }
  });

  // Current logged in user (default to Super Admin)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    return saved || 'user-super';
  });

  // Automatic Technician Status (Requirement 6)
  // - When technician accesses the system: status 'online'
  // - If internet network disconnects: status 'offline'
  // - If network is on but technician hasn't accessed / is idle: status 'away'
  const [userStatus, setUserStatusState] = useState<UserStatus>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }
    return 'online';
  });

  const setUserStatus = (status: UserStatus) => {
    setUserStatusState(status);
  };

  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const setOnline = () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setUserStatusState('offline');
        return;
      }
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        setUserStatusState('away');
        return;
      }
      setUserStatusState('online');
      resetIdleTimer();
    };

    const setOffline = () => {
      setUserStatusState('offline');
    };

    const setAway = () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setUserStatusState('offline');
      } else {
        setUserStatusState('away');
      }
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      // Inactivity timeout: if inactive for 60s, switch to 'away'
      idleTimer = setTimeout(() => {
        setAway();
      }, 60000);
    };

    const handleUserActivity = () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      setUserStatusState((prev: UserStatus) => (prev !== 'online' ? 'online' : prev));
      resetIdleTimer();
    };

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        setAway();
      } else {
        handleUserActivity();
      }
    };

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('focus', handleUserActivity);
    window.addEventListener('blur', setAway);

    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('focus', handleUserActivity);
      window.removeEventListener('blur', setAway);
    };
  }, [isAuthenticated]);

  // Sync user status to users array
  useEffect(() => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, status: userStatus } : u))
    );
  }, [userStatus, currentUserId]);

  const rawCurrentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentUser: User = {
    ...rawCurrentUser,
    status: userStatus,
  };

  const updateUserAvatar = (userId: string, avatarUrl: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, avatar: avatarUrl } : u))
    );
    addAuditLog('Foto de Perfil', currentUser.name, 'Foto de perfil do usuário atualizada.');
    setActiveToast({
      title: 'Foto Atualizada',
      message: 'Foto de perfil alterada com sucesso!',
      type: 'success',
    });
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
    setIsAuthenticated(true);
    setUserStatusState('online');
    try {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', user.id);
      localStorage.setItem(STORAGE_PREFIX + 'is_authenticated', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const login = (user: User) => {
    setCurrentUser(user);
    addAuditLog('Login no Sistema', user.email, `Sessão iniciada como ${user.name} (${user.role}).`);
    setActiveToast({
      title: 'Sessão Iniciada',
      message: `Bem-vindo, ${user.name}! Acesso autorizado.`,
      type: 'success',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserStatusState('offline');
    try {
      localStorage.setItem(STORAGE_PREFIX + 'is_authenticated', 'false');
    } catch (e) {
      console.error(e);
    }
    addAuditLog('Logout do Sistema', currentUser?.email || 'Usuário', 'Sessão desconectada automaticamente pelo usuário.');
    setActiveToast({
      title: 'Desconectado',
      message: 'Você foi desconectado do sistema com sucesso.',
      type: 'info',
    });
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      addAuditLog('Login / Troca de Usuário', 'Usuário', `Sessão alternada para ${found.name} (${found.role})`);
      if (found.role === 'technical_user' && currentPath.startsWith('/gestao')) {
        navigate('/helpdesk/inbox');
      }
    }
  };

  // Toast & Audio Notifications
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type?: 'info' | 'success' | 'warning' } | null>(null);
  const clearToast = () => setActiveToast(null);

  const INITIAL_PUSH_NOTIFICATIONS: AppPushNotification[] = [
    {
      id: 'notif-1',
      title: '💬 Nova mensagem no WhatsApp: Alpha Distribuidora',
      body: 'Folha de Pagamento: "Dúvida no cálculo da rescisão de colaborador"',
      type: 'whatsapp_message',
      timestamp: '10:42',
      read: false,
      data: {
        clientName: 'Alpha Distribuidora Ltda',
        protocol: 'HD-2026-000412',
      },
    },
    {
      id: 'notif-2',
      title: '📋 Tarefa Atribuída no Kanban: Homologar Sped Fiscal',
      body: 'Atribuída ao técnico de suporte | Cliente: Beta Logística S/A',
      type: 'kanban_task_assigned',
      timestamp: '09:15',
      read: false,
      data: {
        technicianName: 'Carlos Silva',
        clientName: 'Beta Logística S/A',
        protocol: 'IP-2026-384910',
      },
    },
    {
      id: 'notif-3',
      title: '💬 Nova mensagem no WhatsApp: Ômega Engenharia',
      body: 'Tributos & NF-e: "Alguém pode verificar a rejeição do lote 8821?"',
      type: 'whatsapp_message',
      timestamp: '08:30',
      read: true,
      data: {
        clientName: 'Ômega Engenharia e Obras',
        protocol: 'HD-2026-000305',
      },
    },
  ];

  const [pushNotifications, setPushNotifications] = useState<AppPushNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'push_notifications');
    return saved ? JSON.parse(saved) : INITIAL_PUSH_NOTIFICATIONS;
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext unavailable or blocked by autoplay
    }
  };

  const requestPushPermission = async (): Promise<NotificationPermission> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          playNotificationSound();
          setActiveToast({
            title: 'Notificações Push Ativadas!',
            message: 'Você receberá alertas em tempo real sobre mensagens do WhatsApp e tarefas do Kanban.',
            type: 'success',
          });
        }
        return perm;
      } catch (err) {
        console.warn('Erro ao solicitar permissão de push:', err);
      }
    }
    return 'denied';
  };

  const dispatchPushNotification = (notif: {
    title: string;
    body: string;
    type: 'whatsapp_message' | 'kanban_task_assigned' | 'sla_warning' | 'system';
    data?: any;
  }) => {
    // 1. Som de alerta sintetizado
    playNotificationSound();

    // 2. Disparo de Web Push nativo no navegador (se permitido)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const nativeNotif = new Notification(notif.title, {
          body: notif.body,
          icon: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=128',
          tag: `${notif.type}-${Date.now()}`,
        });
        nativeNotif.onclick = () => {
          window.focus();
          if (notif.type === 'whatsapp_message') {
            navigate('/helpdesk/inbox');
          }
        };
      } catch (err) {
        console.warn('Native push notification error:', err);
      }
    }

    // 3. Salva no feed interno de notificações push
    const now = new Date();
    const newNotif: AppPushNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: notif.title,
      body: notif.body,
      type: notif.type,
      timestamp: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      data: notif.data,
    };
    setPushNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);

    // 4. Banner Toast em tela
    setActiveToast({
      title: notif.title,
      message: notif.body,
      type: notif.type === 'kanban_task_assigned' ? 'info' : 'success',
    });
  };

  const markNotificationAsRead = (id: string) => {
    setPushNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setPushNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setPushNotifications([]);
  };

  // Floating Windows State
  const [floatingWindows, setFloatingWindows] = useState<FloatingWindow[]>([]);

  const openFloatingWindow = (title: string, type: 'conversation' | 'ai_assistant' | 'thread', dataId: string) => {
    const existing = floatingWindows.find((w) => w.dataId === dataId && w.type === type);
    if (existing) {
      bringToFront(existing.id);
      if (existing.isMinimized) {
        setFloatingWindows((prev) => prev.map((w) => (w.id === existing.id ? { ...w, isMinimized: false } : w)));
      }
      return;
    }

    const newWindow: FloatingWindow = {
      id: 'fw-' + Math.random().toString(36).substr(2, 9),
      title,
      type,
      dataId,
      x: 100 + floatingWindows.length * 40,
      y: 100 + floatingWindows.length * 40,
      width: type === 'ai_assistant' ? 440 : 540,
      height: 600,
      isMinimized: false,
      isMaximized: false,
      zIndex: 50 + floatingWindows.length,
    };

    setFloatingWindows((prev) => [...prev, newWindow]);
  };

  const closeFloatingWindow = (id: string) => {
    setFloatingWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const minimizeFloatingWindow = (id: string) => {
    setFloatingWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)));
  };

  const maximizeFloatingWindow = (id: string) => {
    setFloatingWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  };

  const bringToFront = (id: string) => {
    setFloatingWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 50);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  const updateFloatingWindowPos = (id: string, x: number, y: number, width: number, height: number) => {
    setFloatingWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y, width, height } : w))
    );
  };

  // Modo de Tela de Conversa Flutuante (F4 & F2)
  const [isFloatingModeActive, setIsFloatingModeActive] = useState<boolean>(false);
  const [isF2GridActive, setIsF2GridActive] = useState<boolean>(false);

  const openAllUserConversationsFloating = (minimized: boolean = false) => {
    // Busca as conversas atribuídas ao usuário técnico logado
    const userConvs = conversations.filter(
      (c) => c.assignedTechnicianId === currentUser.id
    );
    // Se não tiver conversas atribuídas a este técnico, pega as conversas em atendimento ou pendentes
    const targetConvs = userConvs.length > 0
      ? userConvs
      : conversations.filter((c) => c.status !== 'Encerrado').slice(0, 8);

    if (targetConvs.length === 0) {
      setActiveToast({
        title: 'Nenhuma Conversa',
        message: 'Não há conversas ativas no momento para abrir.',
        type: 'info',
      });
      return;
    }

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Posiciona as janelas flutuantes iniciando dentro da área vazia de conversa (após a barra e o atendimento)
    const baseOffsetX = Math.max(380, Math.min(screenW * 0.34, 460));
    const availableWidth = Math.max(480, screenW - baseOffsetX - 40);
    const windowWidth = Math.min(500, Math.max(360, availableWidth * 0.58));
    const windowHeight = Math.min(560, Math.max(420, screenH - 120));

    const newWindows: FloatingWindow[] = targetConvs.map((c, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const posX = baseOffsetX + (col * 40) + (row * 20);
      const posY = 65 + (row * 40) + (col * 15);

      return {
        id: 'fw-' + c.id,
        title: c.clientName,
        type: 'conversation' as const,
        dataId: c.id,
        x: Math.max(20, Math.min(posX, screenW - windowWidth - 20)),
        y: Math.max(20, Math.min(posY, screenH - windowHeight - 20)),
        width: windowWidth,
        height: windowHeight,
        isMinimized: minimized,
        isMaximized: false,
        zIndex: 60 + idx,
      };
    });

    setFloatingWindows(newWindows);
  };

  const toggleFloatingMode = () => {
    if (!isFloatingModeActive) {
      setIsFloatingModeActive(true);
      setIsF2GridActive(false); // Área de conversa fica VAZIA no modelo da imagem com popups flutuantes!
      openAllUserConversationsFloating(false);
      setActiveToast({
        title: 'Modo Flutuante Ativado (F4)',
        message: 'Todas as conversas em popups flutuantes na área vazia. Pressione F2 para organizar na grade.',
        type: 'info',
      });
    } else {
      setIsFloatingModeActive(false);
      setIsF2GridActive(false);
      setFloatingWindows([]);
      setActiveToast({
        title: 'Modo Flutuante Desativado (F4)',
        message: 'Janelas flutuantes fechadas. Retornado ao modo de conversa padrão.',
        type: 'info',
      });
    }
  };

  const minimizeAllFloatingWindows = () => {
    // A funcionalidade da tecla "F2" só deve funcionar se a opção de telas flutuantes estiver ativa
    if (!isFloatingModeActive) {
      return;
    }
    setIsF2GridActive(true); // Popups ficam minimizados em linhas e colunas na área vazia!
    openAllUserConversationsFloating(true);
    setActiveToast({
      title: 'Conversas Minimizadas (F2)',
      message: 'Popups organizados em linhas e colunas na área vazia de conversa.',
      type: 'info',
    });
  };

  const restoreAllFloatingWindows = () => {
    setIsF2GridActive(false);
    setFloatingWindows((prev) => prev.map((w) => ({ ...w, isMinimized: false })));
  };

  // Helper Permission Check
  const hasPermission = (perm: string): boolean => {
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.permissions.includes('all')) return true;
    return currentUser.permissions.includes(perm);
  };

  const addAuditLog = (action: string, entity: string, details: string) => {
    const now = new Date();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR'),
      ip: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      targetEntity: entity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Ticket Operations
  const attendConversation = (conversationId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages: ChatMessage[] = [
            ...c.messages,
            {
              id: 'm-' + Date.now(),
              conversationId,
              senderType: 'system',
              senderName: 'Sistema',
              content: `Atendimento assumido por ${currentUser.name}. Protocolo: ${c.protocol}. Início às ${timeStr}.`,
              type: 'text',
              createdAt: timeStr,
            },
          ];

          return {
            ...c,
            status: 'Em atendimento',
            assignedTechnicianId: currentUser.id,
            assignedTechnicianName: currentUser.name,
            startedAt: timeStr,
            unreadCount: 0,
            messages: updatedMessages,
          };
        }
        return c;
      })
    );

    addAuditLog('Assumir Atendimento', `Ticket ${conversationId}`, `Técnico ${currentUser.name} assumiu chamado.`);
    setActiveToast({
      title: 'Atendimento Iniciado',
      message: `Você assumiu o chamado com sucesso.`,
      type: 'success',
    });
  };

  const sendMessage = (
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'document' | 'audio' = 'text',
    mediaUrl?: string,
    replyTo?: { id: string; senderName: string; content: string }
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      conversationId,
      senderType: 'technician',
      senderName: currentUser.name,
      senderId: currentUser.id,
      content,
      type,
      mediaUrl,
      createdAt: timeStr,
      status: 'sent',
      replyTo,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessageSnippet: content.slice(0, 80),
            lastMessageAt: timeStr,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const updateMessage = (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = c.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates, editedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } : m
          );
          return { ...c, messages: updated };
        }
        return c;
      })
    );
    setActiveToast({
      title: 'Mensagem Editada',
      message: 'A mensagem foi alterada com sucesso.',
      type: 'success',
    });
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = c.messages.filter((m) => m.id !== messageId);
          return {
            ...c,
            messages: updated,
            lastMessageSnippet: updated.length > 0 ? updated[updated.length - 1].content.slice(0, 80) : c.lastMessageSnippet,
          };
        }
        return c;
      })
    );
    setActiveToast({
      title: 'Mensagem Apagada',
      message: 'A mensagem foi removida da conversa.',
      type: 'info',
    });
  };

  const toggleMessageReaction = (conversationId: string, messageId: string, reaction: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = c.messages.map((m) => {
            if (m.id === messageId) {
              const current = m.reactions || [];
              const exists = current.includes(reaction);
              const nextReactions = exists
                ? current.filter((r) => r !== reaction)
                : [...current, reaction];
              return { ...m, reactions: nextReactions };
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
  };

  const togglePinMessage = (conversationId: string, messageId: string) => {
    let newPinned = false;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = c.messages.map((m) => {
            if (m.id === messageId) {
              newPinned = !m.isPinned;
              return { ...m, isPinned: newPinned };
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
    setActiveToast({
      title: newPinned ? 'Mensagem Fixada' : 'Mensagem Desafixada',
      message: newPinned ? 'A mensagem agora está fixada no topo da conversa.' : 'A mensagem foi desafixada.',
      type: 'success',
    });
  };

  const toggleStarMessage = (conversationId: string, messageId: string) => {
    let newStarred = false;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = c.messages.map((m) => {
            if (m.id === messageId) {
              newStarred = !m.isStarred;
              return { ...m, isStarred: newStarred };
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
    setActiveToast({
      title: newStarred ? 'Mensagem Favoritada' : 'Removida dos Favoritos',
      message: newStarred ? 'A mensagem foi marcada com estrela.' : 'A mensagem foi desmarcada dos favoritos.',
      type: 'info',
    });
  };

  const forwardMessage = (sourceMessage: ChatMessage, targetConversationIds: string[]) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (targetConversationIds.includes(c.id)) {
          const forwardedMsg: ChatMessage = {
            id: 'm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            conversationId: c.id,
            senderType: 'technician',
            senderName: currentUser.name,
            senderId: currentUser.id,
            content: sourceMessage.content,
            type: sourceMessage.type,
            mediaUrl: sourceMessage.mediaUrl,
            mediaName: sourceMessage.mediaName,
            createdAt: timeStr,
            status: 'sent',
          };
          return {
            ...c,
            lastMessageSnippet: `[Encaminhada] ${sourceMessage.content.slice(0, 60)}`,
            lastMessageAt: timeStr,
            messages: [...c.messages, forwardedMsg],
          };
        }
        return c;
      })
    );
    setActiveToast({
      title: 'Mensagem Encaminhada',
      message: `Encaminhada com sucesso para ${targetConversationIds.length} conversa(s).`,
      type: 'success',
    });
  };

  const transferConversation = (
    conversationId: string,
    targetVerticalId: string,
    targetTeamId?: string,
    targetUserId?: string,
    note?: string
  ) => {
    const targetVert = verticals.find((v) => v.id === targetVerticalId);
    const targetUser = users.find((u) => u.id === targetUserId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const sysMsg: ChatMessage = {
            id: 'm-' + Date.now(),
            conversationId,
            senderType: 'system',
            senderName: 'Sistema',
            content: `Atendimento transferido para a vertical ${targetVert?.name || 'Geral'}${targetUser ? ` (Técnico: ${targetUser.name})` : ''}. Motivo: ${note || 'Redirecionamento técnico'}`,
            type: 'text',
            createdAt: timeStr,
          };

          return {
            ...c,
            verticalId: targetVerticalId,
            verticalName: targetVert?.name || c.verticalName,
            assignedTechnicianId: targetUserId || undefined,
            assignedTechnicianName: targetUser?.name || undefined,
            status: targetUserId ? 'Em atendimento' : 'Pendente',
            messages: [...c.messages, sysMsg],
          };
        }
        return c;
      })
    );

    addAuditLog('Transferência de Ticket', `Ticket ${conversationId}`, `Transferido para vertical ${targetVert?.name}`);
    setActiveToast({
      title: 'Ticket Transferido',
      message: `Atendimento transferido com sucesso para ${targetVert?.name}.`,
      type: 'info',
    });
  };

  const closeConversation = (
    conversationId: string,
    sendFarewell: boolean,
    ticketDataOrRating?: { title: string; date: string; summary: string; satisfactionRating?: number } | number
  ) => {
    const ticketData = typeof ticketDataOrRating === 'object' ? ticketDataOrRating : undefined;
    const satisfactionRating = typeof ticketDataOrRating === 'number' ? ticketDataOrRating : ticketData?.satisfactionRating;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMessages = [...c.messages];
          if (sendFarewell) {
            newMessages.push({
              id: 'm-farewell-' + Date.now(),
              conversationId,
              senderType: 'technician',
              senderName: currentUser.name,
              content: 'Seu atendimento foi concluído com sucesso! Por favor, avalie nosso suporte atribuindo uma nota de 1 a 5 estrelas: ⭐⭐⭐⭐⭐',
              type: 'text',
              createdAt: timeStr,
              status: 'sent',
            });
          }
          newMessages.push({
            id: 'm-sys-' + Date.now(),
            conversationId,
            senderType: 'system',
            senderName: 'Sistema',
            content: `Atendimento "${ticketData?.title || c.title || c.protocol}" encerrado por ${currentUser.name} às ${timeStr}. Protocolo ${c.protocol}.`,
            type: 'text',
            createdAt: timeStr,
          });

          return {
            ...c,
            title: ticketData?.title || c.title || `Suporte ${c.verticalName} - ${c.clientName}`,
            ticketDate: ticketData?.date || c.ticketDate || dateStr,
            ticketSummary: ticketData?.summary || c.ticketSummary || c.lastMessageSnippet,
            closedWithSurvey: sendFarewell,
            status: 'Encerrado',
            closedAt: timeStr,
            satisfactionRating: satisfactionRating || (sendFarewell ? 5 : c.satisfactionRating),
            messages: newMessages,
          };
        }
        return c;
      })
    );

    addAuditLog('Encerramento de Ticket', `Ticket ${conversationId}`, `Encerrado por ${currentUser.name}`);
    setActiveToast({
      title: 'Atendimento Concluído',
      message: `O chamado foi encerrado e catalogado no histórico com sucesso.`,
      type: 'success',
    });
  };

  const addMediaToConversation = (
    conversationId: string,
    media: {
      title: string;
      url: string;
      type: 'image' | 'document' | 'audio';
      senderType: 'client' | 'technician';
      senderName: string;
      size?: string;
    }
  ) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMediaItem: MediaItem = {
      id: 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      conversationId,
      senderType: media.senderType,
      senderName: media.senderName,
      title: media.title,
      url: media.url,
      type: media.type,
      size: media.size || '1.2 MB',
      createdAt: timeStr,
    };

    const newChatMessage: ChatMessage = {
      id: 'm-' + Date.now(),
      conversationId,
      senderType: media.senderType,
      senderName: media.senderName,
      content: media.type === 'image' ? `📷 [Foto]: ${media.title}` : media.type === 'document' ? `📄 [Documento]: ${media.title}` : `🎤 [Áudio]: ${media.title}`,
      type: media.type,
      mediaUrl: media.url,
      mediaName: media.title,
      createdAt: timeStr,
      status: 'delivered',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMedia = [...(c.mediaList || []), newMediaItem];
          return {
            ...c,
            lastMessageSnippet: newChatMessage.content,
            lastMessageAt: timeStr,
            messages: [...c.messages, newChatMessage],
            mediaList: updatedMedia,
          };
        }
        return c;
      })
    );

    playNotificationSound();
  };

  const reopenConversation = (conversationId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            status: 'Em atendimento',
            closedAt: undefined,
            messages: [
              ...c.messages,
              {
                id: 'm-reopen-' + Date.now(),
                conversationId,
                senderType: 'system',
                senderName: 'Sistema',
                content: `Atendimento reaberto por ${currentUser.name} às ${timeStr}.`,
                type: 'text',
                createdAt: timeStr,
              },
            ],
          };
        }
        return c;
      })
    );

    addAuditLog('Reabertura de Ticket', `Ticket ${conversationId}`, `Reaberto por ${currentUser.name}`);
  };

  // Tags Operations
  const createTag = (
    name: string,
    type: 'entity' | 'system',
    targetId?: string,
    targetName?: string,
    color?: string
  ): Tag => {
    const randomColors = [
      '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
      '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#84CC16',
      '#F97316', '#A855F7'
    ];
    const chosenColor = color || randomColors[Math.floor(Math.random() * randomColors.length)];
    const newTag: Tag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      type,
      targetId,
      targetName,
      color: chosenColor,
      createdAt: new Date().toISOString(),
    };
    setTags((prev) => [newTag, ...prev]);
    addAuditLog('Criação de Etiqueta', `Etiqueta: ${newTag.name}`, `Tipo: ${type} | Destino: ${targetName || 'Geral'}`);
    return newTag;
  };

  const addTagToConversation = (conversationId: string, tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    if (!tag) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const currentTags = c.tags || [];
          if (currentTags.some((t) => t.id === tagId)) return c;
          const updatedTags = [...currentTags, tag];
          return {
            ...c,
            tags: updatedTags,
            tagIds: updatedTags.map((t) => t.id),
          };
        }
        return c;
      })
    );
  };

  const removeTagFromConversation = (conversationId: string, tagId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const currentTags = c.tags || [];
          const updatedTags = currentTags.filter((t) => t.id !== tagId);
          return {
            ...c,
            tags: updatedTags,
            tagIds: updatedTags.map((t) => t.id),
          };
        }
        return c;
      })
    );
  };

  const startConversationWithContact = (
    clientId: string,
    contactId: string,
    initialTagId?: string
  ): Conversation => {
    const client = clients.find((c) => c.id === clientId) || clients[0];
    const contact = client.contacts.find((ct) => ct.id === contactId) || client.contacts[0] || {
      id: 'contact-general',
      name: client.tradeName || client.companyName,
      role: 'Responsável',
      phone: client.phone,
      whatsapp: client.whatsapp,
      email: client.email,
      active: true,
    };

    const existing = conversations.find(
      (c) => (c.clientId === clientId || c.clientPhone === (contact.whatsapp || contact.phone)) && c.status !== 'Encerrado'
    );

    if (existing) {
      if (initialTagId) {
        addTagToConversation(existing.id, initialTagId);
      }
      return existing;
    }

    const assignedTags = initialTagId ? tags.filter((t) => t.id === initialTagId) : [];
    const newProto = `IP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const vert = verticals.find((v) => client.verticalIds?.includes(v.id)) || verticals[0];

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      protocol: newProto,
      clientId: client.id,
      clientName: `${client.tradeName || client.companyName} (${contact.name})`,
      clientPhone: contact.whatsapp || contact.phone || client.whatsapp,
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      verticalId: vert.id,
      verticalName: vert.name,
      assignedTechnicianId: currentUser.id,
      assignedTechnicianName: currentUser.name,
      status: 'Em atendimento',
      priority: 'Normal',
      slaStatus: 'Dentro do SLA',
      slaTargetMinutes: 120,
      slaMinutesElapsed: 1,
      slaExpiresAt: new Date(Date.now() + 120 * 60000).toISOString(),
      unreadCount: 0,
      lastMessageSnippet: `Atendimento iniciado com ${contact.name} (${contact.role})`,
      lastMessageAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      startedAt: new Date().toISOString(),
      tags: assignedTags,
      tagIds: assignedTags.map((t) => t.id),
      messages: [
        {
          id: `msg-${Date.now()}-sys`,
          conversationId: `conv-${Date.now()}`,
          senderType: 'system',
          senderName: 'Sistema IPTech',
          content: `Atendimento iniciado por ${currentUser.name} para ${contact.name} (${contact.role}) - ${client.companyName}. Protocolo ${newProto}.`,
          type: 'text',
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    addAuditLog('Novo Atendimento', client.companyName, `Contato: ${contact.name} | Protocolo: ${newProto}`);
    return newConv;
  };

  // Simulate incoming message from client to show real-time queues & alerts
  const simulateIncomingClientMessage = (clientId?: string, messageText?: string) => {
    const targetClient = clientId ? clients.find((c) => c.id === clientId) : clients[Math.floor(Math.random() * clients.length)];
    if (!targetClient) return;

    const availableVerticals = targetClient.verticalIds.length > 0 ? targetClient.verticalIds : ['vert-folha'];
    const chosenVertId = availableVerticals[Math.floor(Math.random() * availableVerticals.length)];
    const chosenVert = verticals.find((v) => v.id === chosenVertId) || verticals[0];

    const sampleQueries = [
      'Olá, estamos com dúvida no fechamento da competência do mês.',
      'Gostaria de solicitar suporte referente à conferência de valores de tributos.',
      'O sistema apresentou uma mensagem de aviso ao exportar a prestação de contas.',
      'Precisamos de auxílio urgente para homologação de folha suplementar.',
      'Alguém da equipe pode nos orientar sobre o envio do evento periódico?',
    ];

    const query = messageText || sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const protoNum = Math.floor(100 + Math.random() * 900);
    const newProtocol = `HD-2026-000${protoNum}`;

    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      protocol: newProtocol,
      clientId: targetClient.id,
      clientName: targetClient.companyName,
      clientPhone: targetClient.whatsapp || targetClient.phone,
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      verticalId: chosenVert.id,
      verticalName: chosenVert.name,
      status: 'Pendente',
      priority: Math.random() > 0.7 ? 'Alta' : 'Normal',
      slaStatus: 'Dentro do SLA',
      slaTargetMinutes: 60,
      slaMinutesElapsed: 0,
      slaExpiresAt: new Date(Date.now() + 60 * 60000).toISOString(),
      unreadCount: 1,
      lastMessageSnippet: query,
      lastMessageAt: timeStr,
      messages: [
        {
          id: 'm-' + Date.now(),
          conversationId: 'conv-' + Date.now(),
          senderType: 'client',
          senderName: targetClient.contacts[0]?.name || targetClient.companyName,
          content: query,
          type: 'text',
          createdAt: timeStr,
          status: 'delivered',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);

    // Dispara Notificação Push completa (Alerta sonoro, Web Push no navegador e registro de notificação)
    dispatchPushNotification({
      title: `💬 Nova mensagem WhatsApp: ${targetClient.tradeName || targetClient.companyName}`,
      body: `${chosenVert.name}: "${query.slice(0, 80)}"`,
      type: 'whatsapp_message',
      data: {
        conversationId: newConv.id,
        clientName: targetClient.companyName,
        protocol: newProtocol,
      },
    });
  };

  // Onboarding Helpers
  const updateOnboarding = (updater: (prev: OnboardingState) => OnboardingState) => {
    setOnboarding((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_PREFIX + 'onboarding', JSON.stringify(next));
      return next;
    });
  };

  const runOnboardingTest = async (testName: string): Promise<'passed' | 'failed'> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result: 'passed' | 'failed' = 'passed';
        updateOnboarding((prev) => ({
          ...prev,
          testResults: {
            ...prev.testResults,
            [testName]: result,
          },
        }));
        resolve(result);
      }, 500);
    });
  };

  const activateOrganization = () => {
    updateOnboarding((prev) => ({
      ...prev,
      state: 'active',
      currentStepIndex: 15,
    }));
    addAuditLog('Ativação da Organização', 'Organização', 'Organização colocada em estado de Produção Ativa.');
    setActiveToast({
      title: 'Organização Ativada!',
      message: 'Sua plataforma de Helpdesk está 100% pronta para operação em produção.',
      type: 'success',
    });
    navigate('/gestao/dashboard');
  };

  const resetAllData = () => {
    localStorage.clear();
    setVerticals(INITIAL_VERTICALS);
    setTeams(INITIAL_TEAMS);
    setUsers(INITIAL_USERS);
    setClients(INITIAL_CLIENTS);
    setWhatsAppNumbers(INITIAL_WHATSAPP_NUMBERS);
    setConversations(INITIAL_CONVERSATIONS);
    setQuickMessages(INITIAL_QUICK_MESSAGES);
    setSlashCommands(INITIAL_SLASH_COMMANDS);
    setWorkflow(INITIAL_WORKFLOW);
    setThreads(INITIAL_THREADS);
    setDevTickets(INITIAL_DEV_TICKETS);
    setKnowledgeArticles(INITIAL_KNOWLEDGE_ARTICLES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setOnboarding(INITIAL_ONBOARDING_STATE);
    setCurrentUserId('user-super');
    setActiveToast({
      title: 'Dados Redefinidos',
      message: 'Dados demonstrativos restaurados com sucesso.',
      type: 'info',
    });
  };

  // Auto-sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'verticals', JSON.stringify(verticals));
  }, [verticals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'whatsapp', JSON.stringify(whatsAppNumbers));
  }, [whatsAppNumbers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'quick_messages', JSON.stringify(quickMessages));
  }, [quickMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'slash_commands', JSON.stringify(slashCommands));
  }, [slashCommands]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'workflow', JSON.stringify(workflow));
  }, [workflow]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'dev_tickets', JSON.stringify(devTickets));
  }, [devTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'kb', JSON.stringify(knowledgeArticles));
  }, [knowledgeArticles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'push_notifications', JSON.stringify(pushNotifications));
  }, [pushNotifications]);

  return (
    <HelpdeskContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        setCurrentUser,
        updateUserAvatar,
        userStatus,
        setUserStatus,
        isAuthenticated,
        logout,
        login,
        switchUserById,
        hasPermission,
        verticals,
        setVerticals,
        teams,
        setTeams,
        users,
        setUsers,
        clients,
        setClients,
        whatsAppNumbers,
        setWhatsAppNumbers,
        conversations,
        setConversations,
        quickMessages,
        setQuickMessages,
        slashCommands,
        setSlashCommands,
        workflow,
        setWorkflow,
        threads,
        setThreads,
        devTickets,
        setDevTickets,
        knowledgeArticles,
        setKnowledgeArticles,
        auditLogs,
        addAuditLog,
        tags,
        setTags,
        createTag,
        addTagToConversation,
        removeTagFromConversation,
        startConversationWithContact,
        onboarding,
        updateOnboarding,
        runOnboardingTest,
        activateOrganization,
        floatingWindows,
        openFloatingWindow,
        closeFloatingWindow,
        minimizeFloatingWindow,
        maximizeFloatingWindow,
        bringToFront,
        updateFloatingWindowPos,
        isFloatingModeActive,
        setIsFloatingModeActive,
        isF2GridActive,
        setIsF2GridActive,
        toggleFloatingMode,
        minimizeAllFloatingWindows,
        restoreAllFloatingWindows,
        openAllUserConversationsFloating,
        attendConversation,
        sendMessage,
        updateMessage,
        deleteMessage,
        toggleMessageReaction,
        togglePinMessage,
        toggleStarMessage,
        forwardMessage,
        transferConversation,
        closeConversation,
        addMediaToConversation,
        reopenConversation,
        simulateIncomingClientMessage,
        playNotificationSound,
        activeToast,
        setActiveToast,
        clearToast,
        pushNotifications,
        pushPermission,
        requestPushPermission,
        dispatchPushNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        theme,
        setTheme,
        toggleTheme,
        resetAllData,
      }}
    >
      {children}
    </HelpdeskContext.Provider>
  );
};

export const useHelpdesk = () => {
  const context = useContext(HelpdeskContext);
  if (!context) {
    throw new Error('useHelpdesk must be used within a HelpdeskProvider');
  }
  return context;
};
