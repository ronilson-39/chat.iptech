import React, { useState } from 'react';
import {
  X,
  Phone,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  History,
  Image,
  FileText,
  Music,
  Download,
  ExternalLink,
  Plus,
  ShieldCheck,
  Layers,
  ChevronRight,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Conversation, MediaItem } from '../../types';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { MediaViewerModal } from './MediaViewerModal';

interface ClientProfileDrawerProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenHistory: () => void;
}

export const ClientProfileDrawer: React.FC<ClientProfileDrawerProps> = ({
  conversation,
  onClose,
  onOpenHistory,
}) => {
  const { clients, conversations, addMediaToConversation, currentUser } = useHelpdesk();

  const [activeMediaTab, setActiveMediaTab] = useState<'all' | 'image' | 'document' | 'audio'>('all');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [addMediaModalOpen, setAddMediaModalOpen] = useState(false);

  // New media simulation inputs
  const [newMediaType, setNewMediaType] = useState<'image' | 'document' | 'audio'>('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaSender, setNewMediaSender] = useState<'client' | 'technician'>('client');

  const clientData = clients.find((c) => c.id === conversation.clientId);

  // Gather all medias from this conversation AND any past conversation of this client
  const clientConversations = conversations.filter(
    (c) => c.clientId === conversation.clientId || c.clientPhone === conversation.clientPhone
  );

  const allMediaList: MediaItem[] = [];
  const seenMediaIds = new Set<string>();

  clientConversations.forEach((c) => {
    (c.mediaList || []).forEach((m) => {
      if (!seenMediaIds.has(m.id)) {
        seenMediaIds.add(m.id);
        allMediaList.push(m);
      }
    });

    // Also extract media from chat messages if any has mediaUrl and not yet in mediaList
    c.messages.forEach((msg) => {
      if (msg.mediaUrl && !seenMediaIds.has('msg-' + msg.id)) {
        seenMediaIds.add('msg-' + msg.id);
        allMediaList.push({
          id: 'msg-' + msg.id,
          conversationId: c.id,
          senderType: msg.senderType === 'client' ? 'client' : 'technician',
          senderName: msg.senderName,
          title: msg.mediaName || (msg.type === 'image' ? 'Imagem WhatsApp' : 'Documento Anexo'),
          url: msg.mediaUrl,
          type: msg.type === 'text' ? 'image' : (msg.type as 'image' | 'document' | 'audio'),
          createdAt: msg.createdAt,
        });
      }
    });
  });

  const filteredMedia = allMediaList.filter((m) => {
    if (activeMediaTab === 'all') return true;
    return m.type === activeMediaTab;
  });

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(conversation.clientPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) return;

    let defaultUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
    if (newMediaType === 'document') {
      defaultUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    } else if (newMediaType === 'audio') {
      defaultUrl = 'https://actions.google.com/sounds/v1/ambiences/office.ogg';
    }

    addMediaToConversation(conversation.id, {
      title: newMediaTitle.trim(),
      url: defaultUrl,
      type: newMediaType,
      senderType: newMediaSender,
      senderName: newMediaSender === 'client' ? conversation.clientName : currentUser.name,
      size: newMediaType === 'image' ? '1.8 MB' : newMediaType === 'document' ? '650 KB' : '2.4 MB',
    });

    setNewMediaTitle('');
    setAddMediaModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 md:relative md:inset-auto w-full md:w-80 sm:md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 h-full overflow-hidden animate-in slide-in-from-right-10 duration-200 select-none shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">Perfil do WhatsApp</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {/* Section: Client Header Card */}
          <div className="p-4 text-center bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950/60">
            <div className="relative inline-block mx-auto mb-3">
              <img
                src={
                  conversation.clientAvatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
                }
                alt={conversation.clientName}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/80 shadow-lg mx-auto"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online no WhatsApp" />
            </div>

            <h2 className="text-sm font-bold text-white leading-snug">{conversation.clientName}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{clientData?.tradeName || clientData?.companyName || 'Órgão / Cliente Público'}</p>

            {/* WhatsApp Phone Card with Copy */}
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{conversation.clientPhone}</span>
              <button
                onClick={handleCopyPhone}
                className="p-1 hover:text-white transition cursor-pointer"
                title="Copiar número"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Protocolo: {conversation.protocol}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
                Vertical: {conversation.verticalName}
              </span>
            </div>
          </div>

          {/* Section: Client Organization Details */}
          <div className="p-4 space-y-2.5 text-xs">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dados Cadastrais
            </h4>
            <div className="space-y-2 text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Documento/CNPJ:</span>
                <span className="font-mono text-slate-200">{clientData?.document || '18.234.567/0001-89'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Cidade / UF:</span>
                <span className="text-slate-200">{clientData ? `${clientData.city} - ${clientData.state}` : 'São Pedro da Serra - SP'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">E-mail:</span>
                <span className="text-slate-200 truncate max-w-[160px]">{clientData?.email || 'suporte@cliente.gov.br'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">SLA Contratual:</span>
                <span className="text-emerald-400 font-semibold">2h de Resposta (Ativo)</span>
              </div>
            </div>
          </div>

          {/* Section: Opção de Mídias (Mostra todas as mídias enviadas pelo cliente e técnico) */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Image className="w-4 h-4 text-emerald-400" />
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Mídias, Links & Docs
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {allMediaList.length}
                </span>
                <button
                  onClick={() => setAddMediaModalOpen(true)}
                  className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition cursor-pointer"
                  title="Simular envio de mídia"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Media Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-[10px]">
              {(['all', 'image', 'document', 'audio'] as const).map((tab) => {
                const count = tab === 'all' ? allMediaList.length : allMediaList.filter((m) => m.type === tab).length;
                const labels: Record<string, string> = {
                  all: 'Todas',
                  image: 'Fotos',
                  document: 'Docs',
                  audio: 'Áudios',
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveMediaTab(tab)}
                    className={`flex-1 py-1 rounded text-center font-medium transition cursor-pointer ${
                      activeMediaTab === tab
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {labels[tab]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Media Items Grid / List */}
            {filteredMedia.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredMedia.map((m) => {
                  const isClient = m.senderType === 'client';
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMedia(m)}
                      className="group p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/90 transition cursor-pointer flex items-center gap-2.5"
                    >
                      {/* Media Thumbnail / Icon */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800 flex items-center justify-center">
                        {m.type === 'image' ? (
                          <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        ) : m.type === 'document' ? (
                          <FileText className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Music className="w-5 h-5 text-amber-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate group-hover:text-emerald-300">
                          {m.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span
                            className={`px-1 rounded text-[9px] font-medium ${
                              isClient ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-indigo-950 text-indigo-400 border border-indigo-800/50'
                            }`}
                          >
                            {isClient ? 'Cliente' : 'Técnico'}
                          </span>
                          <span>•</span>
                          <span>{m.createdAt}</span>
                          {m.size && (
                            <>
                              <span>•</span>
                              <span>{m.size}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-[11px] text-slate-500">
                Nenhuma mídia encontrada nesta categoria.
              </div>
            )}
          </div>

          {/* Section: Opção de Histórico (Abre popup de busca por período, mensagem, frases e download PDF/Imagem) */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Histórico de Atendimentos
              </h4>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-800/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Chamados Registrados:</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 text-[11px] font-bold">
                  {clientConversations.length} atendimento(s)
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Consulte todas as conversas anteriores com este cliente, filtre por período, pesquise por mensagens ou frases e baixe em PDF ou imagem.
              </p>

              <button
                onClick={onOpenHistory}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>Consultar Histórico Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Lightbox Viewer Modal */}
      {selectedMedia && (
        <MediaViewerModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      {/* Add Media Simulation Modal */}
      {addMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMedia}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-5 text-xs space-y-3 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Simular Envio de Mídia
              </h3>
              <button
                type="button"
                onClick={() => setAddMediaModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tipo de Mídia:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewMediaType('image')}
                  className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                    newMediaType === 'image'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  📷 Foto/Imagem
                </button>
                <button
                  type="button"
                  onClick={() => setNewMediaType('document')}
                  className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                    newMediaType === 'document'
                      ? 'bg-blue-950 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  📄 Documento
                </button>
                <button
                  type="button"
                  onClick={() => setNewMediaType('audio')}
                  className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                    newMediaType === 'audio'
                      ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  🎤 Áudio
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Remetente:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewMediaSender('client')}
                  className={`py-1.5 rounded-lg border text-center transition cursor-pointer ${
                    newMediaSender === 'client'
                      ? 'bg-slate-700 border-slate-500 text-white font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Cliente ({conversation.clientName.split(' ')[0]})
                </button>
                <button
                  type="button"
                  onClick={() => setNewMediaSender('technician')}
                  className={`py-1.5 rounded-lg border text-center transition cursor-pointer ${
                    newMediaSender === 'technician'
                      ? 'bg-slate-700 border-slate-500 text-white font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Técnico ({currentUser.name.split(' ')[0]})
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome / Descrição do Arquivo:</label>
              <input
                type="text"
                value={newMediaTitle}
                onChange={(e) => setNewMediaTitle(e.target.value)}
                placeholder="Ex: comprovante_transmissao_folha.png"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddMediaModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md"
              >
                Anexar Mídia
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
