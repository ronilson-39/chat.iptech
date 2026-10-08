// Core Domain Types for IPTech Profissional

export type UserRole = 'super_admin' | 'admin' | 'technical_user';

export type UserStatus = 'online' | 'busy' | 'away' | 'offline';

export interface UserPermission {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  phone?: string;
  cargo?: string;
  teams: string[]; // Team IDs
  verticals: string[]; // Vertical IDs
  permissions: string[];
  businessHours?: string;
  status: UserStatus;
  active: boolean;
  lastLogin?: string;
}

export interface Vertical {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
  isDevelopment?: boolean; // Special internal vertical
  customerAccess: boolean;
  technicalAccess: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  verticalId: string;
  coordinatorId: string;
  memberIds: string[];
  businessHours: string;
  sla: string;
  active: boolean;
}

export interface Tag {
  id: string;
  name: string;
  type: 'entity' | 'system'; // 'Entidade' ou 'Sistema'
  targetId?: string;
  targetName?: string;
  color: string;
  textColor?: string;
  createdAt?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  active: boolean;
  tagIds?: string[];
  tags?: Tag[];
}

export interface Client {
  id: string;
  companyName: string;
  tradeName: string;
  document: string; // CNPJ or CPF
  registration?: string; // Inscrição estadual/municipal
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  verticalIds: string[];
  contacts: ClientContact[];
  notes?: string;
  active: boolean;
  createdAt: string;
}

export type WhatsAppStatus = 'Conectado' | 'Desconectado' | 'Conectando' | 'Erro' | 'Aguardando configuração';

export interface WhatsAppNumber {
  id: string;
  name: string;
  phoneNumber: string;
  provider: string;
  status: WhatsAppStatus;
  webhookUrl: string;
  verticalId?: string;
  lastSync?: string;
  messagesReceived: number;
  messagesSent: number;
}

export type TicketStatus = 'Pendente' | 'Em atendimento' | 'Aguardando cliente' | 'Aguardando equipe' | 'Transferido' | 'Encerrado';
export type TicketPriority = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
export type SLAStatus = 'Dentro do SLA' | 'Próximo do vencimento' | 'Vencido';

export type MessageSenderType = 'client' | 'technician' | 'system' | 'ai';
export type MessageType = 'text' | 'image' | 'document' | 'audio';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderName: string;
  senderId?: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  mediaName?: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  isPinned?: boolean;
  isStarred?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  editedAt?: string;
}

export interface MediaItem {
  id: string;
  conversationId: string;
  senderType: 'client' | 'technician';
  senderName: string;
  title: string;
  url: string;
  type: 'image' | 'document' | 'audio';
  size?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  protocol: string; // e.g. HD-2026-000101
  title?: string;
  ticketDate?: string;
  ticketSummary?: string;
  closedWithSurvey?: boolean;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  verticalId: string;
  verticalName: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  status: TicketStatus;
  priority: TicketPriority;
  slaStatus: SLAStatus;
  slaTargetMinutes: number;
  slaMinutesElapsed: number;
  slaExpiresAt: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageAt: string;
  startedAt?: string;
  closedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  messages: ChatMessage[];
  mediaList?: MediaItem[];
  whatsappNumberId?: string;
  tags?: Tag[];
  tagIds?: string[];
}

export interface QuickMessage {
  id: string;
  name: string;
  category: string;
  content: string;
  active: boolean;
}

export interface SlashCommand {
  id: string;
  trigger: string; // e.g. /ola
  description: string;
  content: string;
  category: string;
}

export interface WorkflowNode {
  id: string;
  type: 'Mensagem' | 'Pergunta' | 'Menu' | 'Condição' | 'Encaminhamento' | 'Equipe' | 'Técnico' | 'IA' | 'Espera' | 'Horário' | 'SLA' | 'Finalização';
  title: string;
  description: string;
  config: Record<string, any>;
  x: number;
  y: number;
  connections: string[]; // next node IDs
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  nodes: WorkflowNode[];
}

export interface WorkspaceThread {
  id: string;
  title: string;
  clientId?: string;
  verticalId?: string;
  technicianId: string;
  technicianName: string;
  status: 'Aberta' | 'Em discussão' | 'Resolvida' | 'Arquivada';
  type: 'Thread' | 'Nota interna' | 'Tarefa' | 'Discussão';
  messages: {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
    attachments?: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DevelopmentTicket {
  id: string;
  title: string;
  protocol: string;
  technicianId: string;
  technicianName: string;
  clientId: string;
  clientName: string;
  verticalId: string;
  description: string;
  priority: TicketPriority;
  status: 'Backlog' | 'Em Análise' | 'Em Correção' | 'Homologação' | 'Resolvido';
  evidenceUrls?: string[];
  comments: {
    id: string;
    authorName: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  module?: string;
  assignedDev?: string;
  ticketNumber?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  verticalId?: string;
  content: string;
  tags: string[];
  published: boolean;
  views: number;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  date: string;
  time: string;
  ip: string;
  targetEntity: string;
  details: string;
}

export interface AppPushNotification {
  id: string;
  title: string;
  body: string;
  type: 'whatsapp_message' | 'kanban_task_assigned' | 'sla_warning' | 'system';
  timestamp: string;
  read: boolean;
  data?: {
    conversationId?: string;
    taskId?: string;
    technicianId?: string;
    technicianName?: string;
    clientName?: string;
    protocol?: string;
  };
}

export interface FloatingWindow {
  id: string;
  title: string;
  type: 'conversation' | 'ai_assistant' | 'thread';
  dataId: string; // conversationId etc.
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface OnboardingState {
  version: string;
  currentStepIndex: number;
  state: 'created' | 'setup_in_progress' | 'configuration_pending' | 'ready_for_testing' | 'ready_for_activation' | 'active' | 'suspended';
  completedSteps: string[];
  organizationProfile: {
    companyName: string;
    tradeName: string;
    document: string;
    email: string;
    phone: string;
    country: string;
    timezone: string;
    language: string;
    logoUrl?: string;
  };
  administrator: {
    name: string;
    email: string;
    phone: string;
    username: string;
    password?: string;
    confirmPassword?: string;
    avatarUrl?: string;
    passwordPolicy: boolean;
    emailVerification: boolean;
    twoFactorOptional: boolean;
  };
  aiConfig: {
    provider: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    tokenLimit: number;
    authorizedVerticals: string[];
    requireHumanApproval: boolean;
  };
  businessHours: {
    days: {
      day: string;
      enabled: boolean;
      start: string;
      end: string;
      lunchBreak: string;
    }[];
    holidays: { date: string; description: string; closed: boolean }[];
  };
  slaConfig: {
    urgent: { firstResponse: string; resolution: string };
    high: { firstResponse: string; resolution: string };
    normal: { firstResponse: string; resolution: string };
    low: { firstResponse: string; resolution: string };
  };
  notificationsConfig: {
    sound: boolean;
    browserNotification: boolean;
    webPush: boolean;
    events: string[];
  };
  testResults: Record<string, 'passed' | 'failed' | 'warning' | 'not_configured'>;
}
