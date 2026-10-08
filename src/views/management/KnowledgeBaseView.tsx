import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { KnowledgeArticle } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Tag,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { knowledgeArticles, setKnowledgeArticles, verticals, addAuditLog } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(knowledgeArticles[0] || null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Geral',
    verticalId: 'vert-folha',
    content: '',
    tags: 'eSocial, Erro 401, Rubricas',
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
      verticalId: a.verticalId || '',
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
      addAuditLog('Edição de Artigo', `Base Conhecimento ${formData.title}`, 'Artigo atualizado.');
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
      addAuditLog('Criação de Artigo', `Base Conhecimento ${newArticle.title}`, 'Novo artigo publicado.');
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Excluir artigo "${title}"?`)) {
      setKnowledgeArticles((prev) => prev.filter((a) => a.id !== id));
      if (selectedArticle?.id === id) setSelectedArticle(null);
      addAuditLog('Exclusão de Artigo', `Base Conhecimento ${title}`, 'Artigo removido.');
    }
  };

  const filteredArticles = knowledgeArticles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchVert = selectedVertical === 'all' || a.verticalId === selectedVertical;
    return matchSearch && matchVert;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Base de Conhecimento & Procedimentos
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Artigos técnicos, FAQs e documentação oficial integrada à IA para respostas rápidas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Artigo</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por título, termos ou tags..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedVertical}
          onChange={(e) => setSelectedVertical(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Todas as Áreas / Verticais</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[640px]">
        {/* Article List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
            Artigos ({filteredArticles.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredArticles.map((a) => {
              const isSelected = selectedArticle?.id === a.id;
              const vert = verticals.find((v) => v.id === a.verticalId);

              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedArticle(a)}
                  className={`p-3.5 cursor-pointer transition text-left ${
                    isSelected ? 'bg-emerald-950/30 border-l-2 border-emerald-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium">
                      {vert?.name || a.category}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {a.views}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{a.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Article Reader */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {selectedArticle ? (
            <>
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">{selectedArticle.title}</h2>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Atualizado em {selectedArticle.updatedAt} • Categoria: {selectedArticle.category}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(selectedArticle)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="Editar artigo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedArticle.id, selectedArticle.title)}
                    className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40 text-xs leading-relaxed text-slate-200">
                <div className="whitespace-pre-wrap font-sans">{selectedArticle.content}</div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Selecione um artigo para leitura.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-xs">
            <h2 className="text-sm font-bold text-white mb-3">
              {editingArticle ? 'Editar Artigo' : 'Novo Artigo na Base de Conhecimento'}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Artigo *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vertical Vinculada</label>
                  <select
                    value={formData.verticalId}
                    onChange={(e) => setFormData({ ...formData, verticalId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {verticals.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="eSocial, S-1200, Tutorial"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Conteúdo do Artigo *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white"
                >
                  Publicar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
