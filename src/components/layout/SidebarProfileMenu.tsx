import React, { useState, useRef, useEffect } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { UserStatus } from '../../types';
import {
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Headphones,
  Check,
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Wifi,
  WifiOff,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import { LoginModal } from '../auth/LoginModal';

interface SidebarProfileMenuProps {
  isExpanded?: boolean;
}

const AVATAR_PRESETS = [
  { id: '1', name: 'Suporte 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
  { id: '2', name: 'Técnico 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { id: '3', name: 'Técnica 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { id: '4', name: 'Técnico 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
  { id: '5', name: 'Especialista 5', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200' },
  { id: '6', name: 'Analista 6', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200' },
  { id: '7', name: 'Suporte TI 7', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' },
  { id: '8', name: 'Dev & Suporte 8', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200' },
  { id: '9', name: 'Engenheiro 9', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { id: '10', name: 'Atendente 10', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' },
  { id: '11', name: 'Supervisor 11', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200' },
  { id: '12', name: 'Atendimento 12', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200' },
];

export const SidebarProfileMenu: React.FC<SidebarProfileMenuProps> = ({ isExpanded = false }) => {
  const {
    currentUser,
    users,
    switchUserById,
    theme,
    setTheme,
    logout,
    navigate,
    currentPath,
    userStatus,
    updateUserAvatar,
  } = useHelpdesk();

  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(currentUser.avatar || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [photoTab, setPhotoTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusColors: Record<string, string> = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    away: 'bg-orange-500',
    offline: 'bg-slate-500',
  };

  const statusLabels: Record<string, string> = {
    online: 'Online',
    busy: 'Ocupado',
    away: 'Ausente',
    offline: 'Offline',
  };

  // Sync selected avatar with currentUser
  useEffect(() => {
    setSelectedAvatarUrl(currentUser.avatar || '');
  }, [currentUser.avatar]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowUserPicker(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A foto selecionada deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setSelectedAvatarUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (selectedAvatarUrl) {
      updateUserAvatar(currentUser.id, selectedAvatarUrl);
      setShowPhotoModal(false);
    }
  };

  const isTechnicalUser = currentUser.role === 'technical_user';

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Profile Trigger Button (replaces "Novo" button at bottom of sidebar) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-xl flex items-center transition cursor-pointer group relative ${
          isExpanded
            ? 'w-full px-2.5 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800/80 gap-2.5'
            : 'w-10 h-10 justify-center hover:bg-slate-800'
        } ${isOpen ? 'ring-2 ring-indigo-500/50 bg-slate-800' : ''}`}
        title={`Perfil: ${currentUser.name} (${statusLabels[userStatus]})`}
      >
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-600 shadow-sm"
          />
          {/* Automatic Status Dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColors[userStatus]} ring-2 ring-slate-900`}
          />
        </div>

        {isExpanded && (
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-semibold text-slate-200 truncate leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <span>{isTechnicalUser ? 'Técnico' : 'Admin'}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{statusLabels[userStatus]}</span>
            </div>
          </div>
        )}

        {isExpanded && (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto group-hover:text-slate-200 transition" />
        )}
      </button>

      {/* Popover Menu: positioned with high z-index and safe vertical constraints */}
      {isOpen && (
        <div className="absolute left-full bottom-0 ml-3 w-84 max-w-[calc(100vw-5rem)] max-h-[calc(100vh-2rem)] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-[100] p-3.5 text-xs animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Header with User Info and Photo Change Action */}
          <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
            {/* Avatar with Camera Icon Overlay for Changing Photo */}
            <div className="relative shrink-0 group/avatar">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-600 group-hover/avatar:border-indigo-400 transition shadow-md"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${statusColors[userStatus]} ring-2 ring-slate-900`}
              />
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                title="Escolher foto de perfil"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xs truncate">{currentUser.name}</span>
                {isTechnicalUser ? (
                  <Headphones className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                {currentUser.email}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
                {/* Botão Escolher Foto (Request 3) */}
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-[10px] font-semibold transition cursor-pointer shadow-xs"
                  title="Alterar ou escolher foto de perfil"
                >
                  <Camera className="w-3 h-3 text-indigo-300" />
                  <span>Escolher Foto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Automático do Técnico (Request 6) */}
          <div className="py-2.5 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>Status do Técnico:</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Automático
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
              <div className="relative shrink-0">
                <span className={`block w-3.5 h-3.5 rounded-full ${statusColors[userStatus]} ring-2 ring-slate-800`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{statusLabels[userStatus]}</span>
                  {userStatus === 'online' && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> Conectado ao Sistema
                    </span>
                  )}
                  {userStatus === 'away' && (
                    <span className="text-[10px] text-orange-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ausente (Inativo)
                    </span>
                  )}
                  {userStatus === 'offline' && (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> Desconectado da Rede
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {userStatus === 'online'
                    ? 'Usuário técnico acessou e está ativo no sistema.'
                    : userStatus === 'away'
                    ? 'Com internet, mas sem interação ou em outra janela.'
                    : 'Sem conexão de internet ou desconectado.'}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 leading-tight space-y-0.5">
              <div>• <strong>Online:</strong> definido automaticamente ao acessar o sistema.</div>
              <div>• <strong>Ausente:</strong> com rede mas sem acesso/atividade recente.</div>
              <div>• <strong>Offline:</strong> quando a conexão de internet é interrompida.</div>
            </div>
          </div>

          {/* Opção de Tema: Tema Claro e Tema Escuro */}
          <div className="py-2.5 border-b border-slate-800 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
              <span>Tema do Sistema:</span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {theme === 'light' ? 'Tema Claro Ativo' : 'Tema Escuro Ativo'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border shadow-sm ${
                  theme === 'light'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold ring-1 ring-amber-400/30'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Ativar Tema Claro (cores claras e adaptáveis)"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Tema Claro</span>
                {theme === 'light' && <Check className="w-3 h-3 text-amber-300 ml-auto" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border shadow-sm ${
                  theme === 'dark'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-bold ring-1 ring-indigo-400/30'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Ativar Tema Escuro"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tema Escuro</span>
                {theme === 'dark' && <Check className="w-3 h-3 text-indigo-300 ml-auto" />}
              </button>
            </div>

            {/* Botão de Desconectar do Sistema (Botão Resetar Dados REMOVIDO conforme Request 2) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900/90 border border-red-800/80 text-red-200 hover:text-white text-xs font-bold transition cursor-pointer shadow-md active:scale-98 group"
                title="Desconectar do sistema automaticamente"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                <span>Desconectar do Sistema</span>
              </button>
            </div>
          </div>

          {/* User Switcher Dropdown Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowUserPicker(!showUserPicker)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-[11px]"
            >
              <span className="font-semibold">Alternar Usuário / Conta</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  showUserPicker ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showUserPicker && (
              <div className="mt-1.5 max-h-48 overflow-y-auto space-y-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUserById(u.id);
                      setIsOpen(false);
                      if (u.role === 'technical_user' && currentPath.startsWith('/gestao')) {
                        navigate('/helpdesk/inbox');
                      }
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-left transition cursor-pointer ${
                      u.id === currentUser.id
                        ? 'bg-indigo-950/60 text-indigo-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] truncate leading-tight">{u.name}</div>
                      <div className="text-[9px] text-slate-500">
                        {u.role === 'technical_user' ? 'Técnico' : 'Admin'}
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full py-1 text-center text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer pt-1 border-t border-slate-800/80"
                >
                  Acessar com outra senha...
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Escolha de Foto de Perfil do Usuário Técnico (Request 3) */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Escolher Foto de Perfil</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Preview da foto atual / selecionada */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative group">
                  <img
                    src={selectedAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt="Pré-visualização"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-200 mt-2">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400">Pré-visualização da imagem</span>
              </div>

              {/* Tabs de Seleção */}
              <div className="flex border-b border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPhotoTab('upload')}
                  className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    photoTab === 'upload'
                      ? 'border-indigo-500 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Do Computador</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('presets')}
                  className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    photoTab === 'presets'
                      ? 'border-indigo-500 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Galeria de Avatares</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('url')}
                  className={`flex-1 py-2 font-medium flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
                    photoTab === 'url'
                      ? 'border-indigo-500 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Link / URL</span>
                </button>
              </div>

              {/* Conteúdo Tab: Upload */}
              {photoTab === 'upload' && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition hover:bg-slate-800/40 group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 mx-auto mb-2 transition-transform group-hover:-translate-y-0.5" />
                    <p className="text-xs font-semibold text-slate-200">Clique para selecionar imagem</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP até 5MB</p>
                  </div>
                </div>
              )}

              {/* Conteúdo Tab: Galeria */}
              {photoTab === 'presets' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">Escolha uma foto profissional da equipe:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected = selectedAvatarUrl === p.url;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedAvatarUrl(p.url)}
                          className={`relative rounded-full p-0.5 transition cursor-pointer group ${
                            isSelected ? 'ring-2 ring-indigo-500 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={p.name}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {isSelected && (
                            <span className="absolute inset-0 bg-indigo-600/40 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conteúdo Tab: URL */}
              {photoTab === 'url' && (
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-300 font-medium">Link da Imagem (URL):</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://exemplo.com/minha-foto.jpg"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          setSelectedAvatarUrl(customUrlInput.trim());
                        }
                      }}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-950/50 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}
    </div>
  );
};
