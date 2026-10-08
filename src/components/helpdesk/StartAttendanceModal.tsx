import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Building2,
  Users,
  Phone,
  Mail,
  Tag as TagIcon,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Client, ClientContact, Tag } from '../../types';

interface StartAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (clientId: string, contactId: string, tagId?: string) => void;
}

export const StartAttendanceModal: React.FC<StartAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSelectContact,
}) => {
  const { clients, tags } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter entities
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchName = (c.companyName || '').toLowerCase().includes(term);
    const matchTrade = (c.tradeName || '').toLowerCase().includes(term);
    const matchCity = (c.city || '').toLowerCase().includes(term);
    const matchContacts = c.contacts.some(
      (ct) =>
        (ct.name || '').toLowerCase().includes(term) ||
        (ct.role || '').toLowerCase().includes(term) ||
        (ct.phone || '').includes(term)
    );
    return matchName || matchTrade || matchCity || matchContacts;
  });

  // Get tags for the selected client's contacts
  const clientTags = useMemo(() => {
    if (!selectedClient) return [];
    // Combine entity tags and system tags relevant to this client
    return tags.filter(
      (t) =>
        t.targetId === selectedClient.id ||
        selectedClient.verticalIds?.includes(t.targetId || '') ||
        t.type === 'entity'
    );
  }, [selectedClient, tags]);

  // Filter contacts by tag if selected
  const contactsToDisplay = useMemo(() => {
    if (!selectedClient) return [];
    return selectedClient.contacts.map((contact, idx) => {
      // Synthesize tags for contact if not explicitly set
      const contactTags = contact.tags && contact.tags.length > 0
        ? contact.tags
        : [
            tags.find((t) => t.targetId === selectedClient.id) || {
              id: `tag-ent-${selectedClient.id}`,
              name: selectedClient.tradeName || selectedClient.companyName,
              type: 'entity' as const,
              color: '#8B5CF6',
            },
            tags.find((t) => t.type === 'system' && (idx % 2 === 0 ? t.targetId === 'vert-folha' : t.targetId === 'vert-esocial')) || {
              id: 'tag-sys-default',
              name: 'Geral & Atendimento',
              type: 'system' as const,
              color: '#3B82F6',
            },
          ];

      return {
        ...contact,
        computedTags: contactTags,
      };
    }).filter((contact) => {
      if (selectedTagFilter === 'all') return true;
      return contact.computedTags.some((t) => t.id === selectedTagFilter);
    });
  }, [selectedClient, selectedTagFilter, tags]);

  const handleStartWithContact = (contactId: string, tagId?: string) => {
    if (!selectedClient) return;
    onSelectContact(selectedClient.id, contactId, tagId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-850/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedClient ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedClient(null);
                  setSelectedTagFilter('all');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Voltar para a lista de entidades"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {selectedClient ? (
                  <>
                    <span>Contatos de:</span>
                    <span className="text-emerald-400 truncate max-w-xs sm:max-w-md">
                      {selectedClient.tradeName || selectedClient.companyName}
                    </span>
                  </>
                ) : (
                  <span>Iniciar Atendimento — Contatos por Entidade</span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                {selectedClient
                  ? 'Contatos organizados de acordo com as etiquetas de Entidade e Sistema'
                  : 'Selecione uma Entidade (Prefeitura, Câmara ou Órgão) para visualizar seus contatos'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {!selectedClient && (
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-900">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar entidade por nome, cidade ou contato..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!selectedClient ? (
            /* STEP 1: Lista de Entidades */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredClients.map((client) => {
                const totalContacts = client.contacts?.length || 0;
                return (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setSelectedTagFilter('all');
                    }}
                    className="p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition cursor-pointer group text-left flex flex-col justify-between shadow-sm hover:shadow-emerald-950/30"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {client.tradeName?.charAt(0) || client.companyName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate">
                              {client.companyName}
                            </h3>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {client.city} - {client.state} • {client.tradeName}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition shrink-0 mt-1" />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span className="font-mono">{client.phone}</span>
                        <span>•</span>
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>{totalContacts} contato(s) registrado(s)</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        CNPJ: {client.document}
                      </span>
                      <span className="text-emerald-400 font-semibold group-hover:underline">
                        Ver contatos & etiquetas →
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredClients.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
                  Nenhuma entidade encontrada para a busca informada.
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: Contatos da Entidade de acordo com as Etiquetas */
            <div className="space-y-4">
              {/* Entity Banner */}
              <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{selectedClient.companyName}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    WhatsApp Geral: {selectedClient.whatsapp} • {selectedClient.city} - {selectedClient.state}
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold">
                  {selectedClient.contacts.length} Contato(s)
                </span>
              </div>

              {/* Tag Filter Pills */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <TagIcon className="w-3 h-3 text-amber-400" />
                  Filtrar por Etiqueta:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedTagFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      selectedTagFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos ({selectedClient.contacts.length})
                  </button>
                  {clientTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedTagFilter(tag.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        selectedTagFilter === tag.id
                          ? 'ring-2 ring-white text-white font-bold'
                          : 'opacity-80 hover:opacity-100 text-slate-200'
                      }`}
                      style={{ backgroundColor: `${tag.color}40`, borderColor: tag.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span>{tag.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-2.5">
                {contactsToDisplay.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 bg-slate-850 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{contact.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({contact.role})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span className="font-mono text-emerald-400">{contact.whatsapp || contact.phone}</span>
                          <span>•</span>
                          <span>{contact.email}</span>
                        </div>

                        {/* Etiquetas do Contato */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {contact.computedTags?.map((tag) => (
                            <span
                              key={tag.id}
                              className="text-[9px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1"
                              style={{
                                backgroundColor: `${tag.color}25`,
                                borderColor: `${tag.color}60`,
                                color: tag.color,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartWithContact(contact.id, contact.computedTags?.[0]?.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Iniciar Atendimento</span>
                    </button>
                  </div>
                ))}

                {contactsToDisplay.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    Nenhum contato encontrado para a etiqueta selecionada.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            {selectedClient
              ? `Exibindo contatos de ${selectedClient.tradeName || selectedClient.companyName}`
              : `Total de ${clients.length} entidades conveniadas cadastradas`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
