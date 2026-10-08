import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { KnowledgeArticle } from '../../types';
import {
  BookOpen,
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Tag as TagIcon,
  Copy,
  Check,
  Edit2,
  Trash2,
  FileText,
  Bookmark,
  Share2,
  X,
  ExternalLink,
} from 'lucide-react';

interface NormalKnowledgeBaseViewProps {
  onBackToInbox: () => void;
  onUseSnippetInChat?: (text: string) => void;
}

export const NormalKnowledgeBaseView: React.FC<NormalKnowledgeBaseViewProps> = ({
  onBackToInbox,
  onUseSnippetInChat,
}) => {
  const {
    knowledgeArticles,
    setKnowledgeArticles,
    verticals,
    addAuditLog,
    setActiveToast,
  } = useHelpdesk();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(
    knowledgeArticles[0] || null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Geral',
    verticalId: verticals[0]?.id || '',
    content: '',
    tags: '',
  });

  const filtered = knowledgeArticles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesVertical =
      selectedVertical === 'all' || a.verticalId === selectedVertical;
    return matchesSearch && matchesVertical;
  });

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Geral',
      verticalId: verticals[0]?.id || '',
      content: '',
      tags: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (a: KnowledgeArticle) => {
    setEditingArticle(a);
    setFormData({
      title: a.title,
      category: a.category,
      verticalId: a.verticalId || verticals[0]?.id || '',
      content: a.content,
      tags: a.tags.join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tagsArr = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticle) {
      setKnowledgeArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                ...formData,
                tags: tagsArr,
                updatedAt: new Date().toLocaleDateString('pt-BR'),
              }
            : a
        )
      );
      addAuditLog(
        'Edição de Artigo',
        `Base Conhecimento ${formData.title}`,
        'Artigo da base atualizado.'
      );
      setActiveToast({
        title: 'Artigo Atualizado',
        message: 'Alterações salvas com sucesso na Base de Conhecimento.',
        type: 'success',
      });
    } else {
      const newArticle: KnowledgeArticle = {
        id: 'kb-' + Date.now(),
        title: formData.title,
        category: formData.category,
        verticalId: formData.verticalId,
        content: formData.content,
        tags: tagsArr,
        published: true,
        views: 1,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
      };
      setKnowledgeArticles((prev) => [newArticle, ...prev]);
      setSelectedArticle(newArticle);
      addAuditLog(
        'Criação de Artigo',
        `Base Conhecimento ${newArticle.title}`,
        'Novo artigo publicado.'
      );
      setActiveToast({
        title: 'Artigo Criado',
        message: 'Novo conhecimento publicado com sucesso.',
        type: 'success',
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Deseja remover o artigo "${title}" da base de conhecimento?`)) {
      setKnowledgeArticles((prev) => prev.filter((a) => a.id !== id));
      if (selectedArticle?.id === id) {
        setSelectedArticle(knowledgeArticles.find((a) => a.id !== id) || null);
      }
      setActiveToast({
        title: 'Artigo Removido',
        message: 'O artigo foi excluído da Base de Conhecimento.',
        type: 'info',
      });
    }
  };

  const handleCopyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setActiveToast({
        title: 'Copiado',
        message: 'Conteúdo copiado para a área de transferência.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getVerticalName = (vId?: string) => {
    return verticals.find((v) => v.id === vId)?.name || 'Geral';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Header Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToInbox}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
            title="Voltar ao Atendimento"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Atendimento</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950/80 border border-indigo-700/60 text-indigo-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Bases de Conhecimento
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                  {knowledgeArticles.length} artigos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Manuais operacionais, FAQs técnicas, legislações e procedimentos de suporte
              </p>
            </div>
          </div>
        </div>

        {/* Ações do Topo: Criar Artigo */}
        <button
          type="button"
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Artigo</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, conteúdo, código de erro ou tag..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Todas as Verticais</option>
            {verticals.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Corpo da Base: Duas Colunas (Lista + Leitor) */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Coluna da Esquerda: Lista de Artigos */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-900/40 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-3 space-y-2">
          {filtered.map((art) => {
            const isSelected = selectedArticle?.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-3 rounded-xl border transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60 truncate max-w-[140px]">
                    {getVerticalName(art.verticalId)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {art.updatedAt}
                  </span>
                </div>

                <h3
                  className={`text-xs font-bold mb-1 line-clamp-2 leading-snug ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {art.title}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {art.content}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {art.views || 1} acessos
                  </span>
                  <div className="flex items-center gap-1">
                    {art.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono text-[9px]"
                      >
                        #{t}
                      </span>
                    ))}
                    {art.tags.length > 2 && (
                      <span className="text-[9px] text-slate-500">+{art.tags.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhum artigo encontrado para o filtro atual.
            </div>
          )}
        </div>

        {/* Coluna da Direita: Visualizador Detalhado do Artigo */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 select-text">
          {selectedArticle ? (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Topo do Artigo */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-xs font-bold">
                      {getVerticalName(selectedArticle.verticalId)}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-xs">
                      {selectedArticle.category || 'Geral'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyContent(selectedArticle.content)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                      title="Copiar texto do artigo"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    {onUseSnippetInChat && (
                      <button
                        type="button"
                        onClick={() => onUseSnippetInChat(selectedArticle.content)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        title="Inserir solução no atendimento"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Usar no Chamado</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditModal(selectedArticle)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Editar Artigo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedArticle.id, selectedArticle.title)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition cursor-pointer"
                      title="Excluir Artigo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Atualizado em: {selectedArticle.updatedAt}</span>
                  <span>•</span>
                  <span>{selectedArticle.views || 1} visualizações técnicas</span>
                </div>
              </div>

              {/* Conteúdo Completo */}
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedArticle.content}
              </div>

              {/* Tags do Artigo */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 flex items-center gap-2 flex-wrap">
                  <TagIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-slate-400 font-medium">Palavras-chave:</span>
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <BookOpen className="w-12 h-12 mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">Nenhum artigo selecionado</p>
              <p className="text-xs text-slate-500 mt-1">
                Selecione um artigo na lista à esquerda para visualizar seu conteúdo completo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Criar / Editar Artigo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {editingArticle ? 'Editar Artigo' : 'Novo Artigo na Base'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Artigo:</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Como resolver erro de autenticação no PNCP"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vertical:</label>
                  <select
                    value={formData.verticalId}
                    onChange={(e) => setFormData({ ...formData, verticalId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {verticals.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoria:</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Legislação, Erros, Configuração"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (separadas por vírgula):</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="eSocial, Rubricas, PNCP, Homologação"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Conteúdo & Instruções:</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escreva as orientações passo a passo para a equipe ou cliente..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Salvar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
